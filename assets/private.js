// Perfil privado: descifra data/private.enc.js en el navegador con la contraseña de la persona.
// Sin contraseña el contenido es ilegible; la clave solo vive en esta pestaña (sessionStorage).
(function () {
  const { el, loadScript } = window.DC;
  const SKEY = 'dc-pk', SRC = 'data/private.enc.js';
  const b64d = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const b64e = u => btoa(String.fromCharCode(...u));
  const store = {
    get() { try { return sessionStorage.getItem(SKEY); } catch (e) { return null; } },
    set(v) { try { sessionStorage.setItem(SKEY, v); } catch (e) { /* sin almacenamiento: se pedirá de nuevo */ } },
    del() { try { sessionStorage.removeItem(SKEY); } catch (e) { /* ignorar */ } }
  };
  let cache = null, readyP = null;

  // true si el sitio trae contenido privado (data/private.enc.js existe)
  function ready() {
    if (!readyP) readyP = window.PRIVATE_BLOB ? Promise.resolve(true)
      : loadScript(SRC).then(() => !!window.PRIVATE_BLOB, () => false);
    return readyP;
  }

  async function decrypt(raw) {
    const b = window.PRIVATE_BLOB;
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(b.iv) }, key, b64d(b.ct));
    const p = JSON.parse(new TextDecoder().decode(pt));
    p.entry.id = 'privado';
    p.entry.estado = 'listo';
    return p;
  }

  async function unlock(pass) {
    if (!window.crypto || !crypto.subtle) throw new Error('Este navegador/contexto no permite descifrar (usa localhost o https).');
    const b = window.PRIVATE_BLOB;
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveBits']);
    const raw = new Uint8Array(await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: b64d(b.salt), iterations: b.iter }, base, 256));
    cache = await decrypt(raw); // lanza OperationError si la contraseña es incorrecta
    store.set(b64e(raw));
    return cache;
  }

  // Contenido ya desbloqueado en esta pestaña (o null)
  async function get() {
    if (cache) return cache;
    const k = store.get();
    if (!k || !(await ready())) return null;
    try { cache = await decrypt(b64d(k)); return cache; } catch (e) { store.del(); return null; }
  }

  function lock() { store.del(); cache = null; }

  // Ventana para escribir la contraseña; resuelve con el contenido o null si se cancela
  function prompt() {
    return new Promise(resolve => {
      const input = el('input', { type: 'password', placeholder: 'Contraseña', autocomplete: 'current-password', 'aria-label': 'Contraseña' });
      const err = el('p', { class: 'dlg-err', role: 'alert' });
      const cancel = el('button', { type: 'button', class: 'navbtn' }, 'Cancelar');
      const ok = el('button', { type: 'submit', class: 'navbtn next' }, 'Desbloquear');
      const form = el('form', {}, el('h2', {}, 'Perfil privado'), el('p', {}, 'Escribe tu contraseña para ver tus guías.'),
        input, err, el('div', { class: 'dlg-btns' }, cancel, ok));
      const dlg = el('dialog', { class: 'dlg' }, form);
      let done = false;
      const finish = v => { if (done) return; done = true; dlg.close(); dlg.remove(); resolve(v); };
      form.addEventListener('submit', async e => {
        e.preventDefault(); ok.disabled = true; err.textContent = '';
        try { finish(await unlock(input.value)); } catch (x) {
          err.textContent = x && x.name === 'OperationError' ? 'Contraseña incorrecta.' : 'No se pudo descifrar: ' + (x && x.message || x);
          ok.disabled = false; input.select();
        }
      });
      cancel.addEventListener('click', () => finish(null));
      dlg.addEventListener('cancel', e => { e.preventDefault(); finish(null); });
      document.body.append(dlg); dlg.showModal(); input.focus();
    });
  }

  if (window.LOGOS) window.LOGOS.privado =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
    '<rect x="12" y="28" width="40" height="28" rx="6" fill="currentColor"/>' +
    '<path d="M20 28v-8a12 12 0 0 1 24 0v8" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="32" cy="41" r="4" fill="#fff"/><path d="M32 43v6" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>';

  /* ----- comandos agregados desde la página -----
     Se guardan cifrados (con la misma clave) en el localStorage de este navegador hasta que los exportes
     y publiques en data/private.enc.js. Cada uno es { s: id de sección, t: título (si es nueva), cmd, desc }. */
  const XKEY = 'dc-priv-extra';
  const xget = () => { try { return JSON.parse(localStorage.getItem(XKEY)); } catch (e) { return null; } };
  function xset(v) {
    try { if (v) localStorage.setItem(XKEY, JSON.stringify(v)); else localStorage.removeItem(XKEY); }
    catch (e) { throw new Error('No se pudo guardar en este navegador.'); }
  }
  async function aesKey(usage) {
    const k = store.get();
    if (!k) throw new Error('El perfil está bloqueado.');
    return crypto.subtle.importKey('raw', b64d(k), 'AES-GCM', false, [usage]);
  }
  async function seal(text) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await aesKey('encrypt'), new TextEncoder().encode(text)));
    return { iv: b64e(iv), ct: b64e(ct) };
  }
  async function extras() {
    const box = xget();
    if (!box) return [];
    try {
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(box.iv) }, await aesKey('decrypt'), b64d(box.ct));
      const a = JSON.parse(new TextDecoder().decode(pt));
      return Array.isArray(a) ? a : [];
    } catch (e) { return []; } // cambió la contraseña o el archivo: lo pendiente ya no se puede leer
  }
  const saveExtras = async arr => xset(arr.length ? await seal(JSON.stringify(arr)) : null);
  const removeExtra = async (s, cmd) => saveExtras((await extras()).filter(x => !(x.s === s && x.cmd === cmd)));

  function merge(base, list, mark) {
    const p = JSON.parse(JSON.stringify(base));
    list.forEach(x => {
      let s = p.data.secciones.find(q => q.id === x.s);
      if (!s) { s = { id: x.s, titulo: x.t || x.s, items: [] }; p.data.secciones.push(s); }
      if (s.items.some(i => i.cmd === x.cmd)) return;
      s.items.push(x.desc ? { cmd: x.cmd, desc: x.desc } : { cmd: x.cmd });
      if (mark) s.items[s.items.length - 1]._local = true;
    });
    return p;
  }
  const has = (base, x) => base.data.secciones.some(s => s.id === x.s && s.items.some(i => i.cmd === x.cmd));

  // Lo pendiente de publicar (ya descontado lo que quedó incluido en el archivo publicado)
  async function pending() {
    const base = await get();
    if (!base) return [];
    const all = await extras(), list = all.filter(x => !has(base, x));
    if (list.length !== all.length) await saveExtras(list);
    return list;
  }
  // Contenido listo para mostrar: lo publicado + lo pendiente (marcado)
  async function merged() {
    const base = await get();
    return base ? merge(base, await pending(), true) : null;
  }

  async function exportFile() {
    const base = await get(), b = window.PRIVATE_BLOB;
    const box = await seal(JSON.stringify(merge(base, await pending(), false)));
    const text = '// Contenido cifrado: ilegible sin la contraseña. Generado por tools/encrypt.js\nwindow.PRIVATE_BLOB = ' +
      JSON.stringify({ v: 1, iter: b.iter, salt: b.salt, iv: box.iv, ct: box.ct }) + ';\n';
    const a = el('a', { href: URL.createObjectURL(new Blob([text], { type: 'text/javascript' })), download: 'private.enc.js' });
    document.body.append(a); a.click(); a.remove();
  }

  function modal(...kids) {
    const dlg = el('dialog', { class: 'dlg' }, ...kids);
    document.body.append(dlg); dlg.showModal();
    const close = () => { dlg.close(); dlg.remove(); };
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    return { dlg, close };
  }

  // Formulario para agregar un comando; resuelve true si se guardó algo
  function addDialog(secciones) {
    return new Promise(resolve => {
      const sel = el('select', { 'aria-label': 'Sección' },
        ...secciones.filter(s => s.tipo !== 'glosario').map(s => el('option', { value: s.id }, s.titulo)),
        el('option', { value: '__new' }, '➕ Nueva sección…'));
      const newT = el('input', { type: 'text', placeholder: 'Nombre de la nueva sección', 'aria-label': 'Nueva sección', hidden: true });
      const cmd = el('textarea', { rows: 3, placeholder: 'Comando (usa <valor> para partes editables)', 'aria-label': 'Comando', spellcheck: 'false' });
      const desc = el('input', { type: 'text', placeholder: 'Qué hace (opcional)', 'aria-label': 'Descripción' });
      const err = el('p', { class: 'dlg-err', role: 'alert' });
      const cancel = el('button', { type: 'button', class: 'navbtn' }, 'Cancelar');
      const ok = el('button', { type: 'submit', class: 'navbtn next' }, 'Guardar');
      const form = el('form', {}, el('h2', {}, 'Agregar comando'),
        el('p', {}, 'Se guarda cifrado en este navegador. Luego lo publicas con "Exportar".'),
        sel, newT, cmd, desc, err, el('div', { class: 'dlg-btns' }, cancel, ok));
      const m = modal(form);
      sel.addEventListener('change', () => { newT.hidden = sel.value !== '__new'; if (!newT.hidden) newT.focus(); });
      cancel.addEventListener('click', () => { m.close(); resolve(false); });
      m.dlg.addEventListener('cancel', () => resolve(false));
      form.addEventListener('submit', async e => {
        e.preventDefault(); err.textContent = '';
        const c = cmd.value.trim();
        if (!c) { err.textContent = 'Escribe el comando.'; return; }
        let s = sel.value, t = '';
        if (s === '__new') {
          t = newT.value.trim();
          if (!t) { err.textContent = 'Escribe el nombre de la sección.'; return; }
          s = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'nueva';
          const ex = secciones.find(q => q.id === s || q.titulo === t);
          if (ex) { s = ex.id; t = ''; }
        }
        try {
          const list = await extras();
          if (!list.some(x => x.s === s && x.cmd === c)) list.push({ s, t, cmd: c, desc: desc.value.trim() });
          await saveExtras(list);
          m.close(); resolve(true);
        } catch (x) { err.textContent = x.message; }
      });
      cmd.focus();
    });
  }

  // Lista lo pendiente; permite descargar el archivo actualizado o descartar. Resuelve true si cambió algo
  function pendingDialog(list) {
    return new Promise(resolve => {
      const close = el('button', { type: 'button', class: 'navbtn' }, 'Cerrar');
      const drop = el('button', { type: 'button', class: 'navbtn' }, 'Descartar');
      const down = el('button', { type: 'button', class: 'navbtn next' }, 'Descargar archivo');
      const m = modal(el('h2', {}, 'Sin publicar (' + list.length + ')'),
        el('p', {}, 'Descarga el archivo, reemplaza data/private.enc.js con él, y haz commit y push. Con la misma contraseña.'),
        el('ul', { class: 'dlg-list' }, ...list.map(x => {
          const quitar = el('button', { type: 'button', class: 'fav-copy', title: 'Quitar solo este comando' }, 'Quitar');
          quitar.addEventListener('click', async () => { await removeExtra(x.s, x.cmd); m.close(); resolve(true); });
          return el('li', {}, el('code', {}, x.cmd), ' ', quitar);
        })),
        el('div', { class: 'dlg-btns' }, drop, close, down));
      close.addEventListener('click', () => { m.close(); resolve(false); });
      m.dlg.addEventListener('cancel', () => resolve(false));
      down.addEventListener('click', () => exportFile().then(() => { down.textContent = '¡Descargado!'; }));
      drop.addEventListener('click', async () => {
        if (!confirm('¿Descartar los ' + list.length + ' comandos sin publicar?')) return;
        await saveExtras([]); m.close(); resolve(true);
      });
    });
  }

  window.DC.priv = { ready, get, prompt, lock, unlock, merged, pending, removeExtra, addDialog, pendingDialog };
})();
