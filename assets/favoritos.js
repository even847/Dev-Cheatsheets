(function () {
  const { el, loadScript, logoFor, initTheme, copyText, favs, icons } = window.DC;
  initTheme();

  const content = document.getElementById('content');
  // Mismo orden que el inicio: alfabético por nombre
  const registry = [...(window.REGISTRY || [])].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
  document.documentElement.style.setProperty('--accent', '#e8a33d');

  let importing = false, favMsg = '';
  const requested = new Map(); // id de guía -> promesa de carga de sus datos
  const ready = t => t.estado === 'listo';

  function ensure(id) {
    if (!requested.has(id)) requested.set(id, loadScript('data/' + id + '.js').catch(() => { /* la guía no carga: se muestra sin detalle */ }));
    return requested.get(id);
  }
  const dataOf = id => window.CHEATSHEETS && window.CHEATSHEETS[id];

  /* ----- filas: solo el comando; al hacer clic lleva a su lugar en la guía ----- */
  function row(f) {
    const link = el('a', { class: 'fav-link', href: 'tool.html?t=' + encodeURIComponent(f.t) + '&hl=' + encodeURIComponent(f.c) + '#' + encodeURIComponent(f.s),
      title: 'Ir a este comando en la guía' }, el('code', {}, f.c));
    const copy = el('button', { class: 'fav-copy', type: 'button' }, 'Copiar');
    let timer;
    copy.addEventListener('click', async () => {
      copy.textContent = (await copyText(f.c)) ? '¡Copiado!' : 'Error';
      clearTimeout(timer);
      timer = setTimeout(() => { copy.textContent = 'Copiar'; }, 1400);
    });
    const remove = el('button', { class: 'fav on', type: 'button', title: 'Quitar de favoritos', 'aria-label': 'Quitar de favoritos', html: icons.starOn });
    remove.addEventListener('click', () => favs.toggle(f));
    return el('div', { class: 'fav-row' }, link, copy, remove);
  }

  function group(name, color, logoId, items) {
    return el('section', { class: 'fav-group', style: color ? '--accent:' + color : null },
      el('h2', {}, logoId && el('span', { class: 'logo', html: logoFor(logoId) }), name, el('span', { class: 'badge' }, String(items.length))),
      el('div', { class: 'fav-list' }, ...items.map(row)));
  }

  /* ----- exportar / importar como archivo de texto -----
     Formato legible y editable a mano:
       ## Git › Remotos
       git remote -v
     Las líneas que empiezan con # son comentarios. */
  function toTxt(list) {
    const lines = ['# Dev-Cheatsheets · Favoritos', '# Exportado el ' + new Date().toISOString().slice(0, 10), '# Una línea por comando, bajo "## Guía › Sección".', ''];
    const bySection = new Map();
    list.forEach(f => {
      const key = f.t + '\u0000' + f.s;
      if (!bySection.has(key)) bySection.set(key, { t: f.t, s: f.s, cmds: [] });
      bySection.get(key).cmds.push(f.c);
    });
    const tools = [...registry.map(t => t.id), ...new Set(list.map(f => f.t).filter(id => !registry.some(t => t.id === id)))];
    tools.forEach(id => {
      const tool = registry.find(t => t.id === id), data = dataOf(id);
      const secs = [...bySection.values()].filter(g => g.t === id);
      // secciones en el orden de la guía
      secs.sort((a, b) => {
        const ia = data ? data.secciones.findIndex(s => s.id === a.s) : -1, ib = data ? data.secciones.findIndex(s => s.id === b.s) : -1;
        return ia - ib;
      });
      secs.forEach(g => {
        const sec = data && data.secciones.find(s => s.id === g.s);
        lines.push('## ' + (tool ? tool.nombre : g.t) + ' › ' + (sec ? sec.titulo : g.s), ...g.cmds, '');
      });
    });
    return lines.join('\n');
  }

  async function fromTxt(text) {
    await Promise.all(registry.filter(ready).map(t => ensure(t.id)));
    const found = [], out = { added: 0, skipped: 0 };
    const norm = s => s.trim().toLowerCase();
    const inSection = (t, sec, cmd) => sec.items.some(i => i.cmd === cmd) && { t, s: sec.id, c: cmd };
    const anywhere = cmd => {
      for (const t of registry.filter(ready)) {
        const d = dataOf(t.id);
        for (const sec of (d ? d.secciones : [])) { const hit = inSection(t.id, sec, cmd); if (hit) return hit; }
      }
      return null;
    };
    let ctx = null; // { t, sec }
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith('##')) {
        const [a, b] = line.replace(/^##\s*/, '').split(/\s*›\s*/);
        const tool = registry.find(t => norm(t.nombre) === norm(a || '') || t.id === norm(a || ''));
        const d = tool && dataOf(tool.id);
        const sec = d && d.secciones.find(s => norm(s.titulo) === norm(b || '') || s.id === norm(b || ''));
        ctx = sec ? { t: tool.id, sec } : null;
        continue;
      }
      if (line.startsWith('#')) continue;
      const hit = (ctx && inSection(ctx.t, ctx.sec, line)) || anywhere(line); // si la sección no coincide, busca en todas las guías
      if (hit) found.push(hit); else out.skipped++;
    }
    const r = favs.addMany(found);
    return { added: r.added, skipped: out.skipped + r.skipped };
  }

  function download(name, text) {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const a = el('a', { href: url, download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function render() {
    const list = favs.list();
    const groups = registry.map(t => ({ t, items: list.filter(f => f.t === t.id) })).filter(g => g.items.length);
    const known = new Set(registry.map(t => t.id));
    const orphans = list.filter(f => !known.has(f.t)); // guías que ya no existen

    const msg = el('p', { class: 'favs-msg', role: 'status', 'aria-live': 'polite' }, favMsg);
    const exportBtn = el('button', { type: 'button', class: 'favs-btn', disabled: list.length === 0 }, 'Descargar .txt');
    exportBtn.addEventListener('click', async () => {
      await Promise.all([...new Set(list.map(f => f.t))].filter(id => registry.some(t => t.id === id && ready(t))).map(ensure));
      download('favoritos-dev-cheatsheets.txt', toTxt(favs.list()));
      favMsg = 'Se descargó favoritos-dev-cheatsheets.txt. En otro navegador, súbelo con Importar.';
      msg.textContent = favMsg;
    });
    const importBtn = el('button', { type: 'button', class: 'favs-btn' }, importing ? 'Cancelar' : 'Importar');
    importBtn.addEventListener('click', () => { importing = !importing; favMsg = ''; render(); });

    const importArea = !importing ? null : (() => {
      const file = el('input', { type: 'file', accept: '.txt,.json,text/plain,application/json', 'aria-label': 'Archivo de favoritos' });
      const ta = el('textarea', { class: 'favs-import', rows: '5', placeholder: 'Elige el archivo .txt que descargaste, o pega aquí su contenido', 'aria-label': 'Contenido de favoritos' });
      file.addEventListener('change', async () => { if (file.files[0]) ta.value = await file.files[0].text(); });
      const apply = el('button', { type: 'button', class: 'favs-btn primary' }, 'Aplicar');
      apply.addEventListener('click', async () => {
        const text = ta.value.trim();
        if (!text) { favMsg = 'No hay nada que importar: elige un archivo o pega su contenido.'; msg.textContent = favMsg; return; }
        const r = /^[[{]/.test(text) ? favs.importText(text) : await fromTxt(text); // también acepta el JSON de versiones anteriores
        if (!r) favMsg = 'Ese texto no es una exportación de favoritos válida.';
        else {
          favMsg = r.added === 0 && r.skipped === 0 ? 'Esos comandos ya estaban en tus favoritos.'
            : r.added + ' agregado' + (r.added === 1 ? '' : 's') + (r.skipped ? ' · ' + r.skipped + ' omitido' + (r.skipped === 1 ? '' : 's') + ' (no se encontraron en las guías)' : '');
          importing = false;
        }
        render();
      });
      return el('div', { class: 'favs-importbox' }, file, ta, apply);
    })();

    content.replaceChildren(
      el('div', { class: 'tool-head' },
        el('div', { class: 'logo', html: icons.starOn }),
        el('div', {}, el('h1', {}, 'Favoritos'),
          el('p', {}, 'Los comandos que marcaste con ★ en todas las guías. Haz clic en uno para ir a su lugar en la guía.'))),
      list.length
        ? el('div', {}, ...groups.map(g => group(g.t.nombre, g.t.color, g.t.id, g.items)),
            orphans.length ? group('Otras', null, null, orphans) : null)
        : el('div', { class: 'empty' }, 'Todavía no tienes favoritos. Abre una guía y marca con ★ los comandos que más usas. ',
            el('a', { href: 'index.html' }, 'Ver las guías')),
      el('div', { class: 'favs-tools' }, exportBtn, importBtn,
        el('span', { class: 'favs-note' }, 'Se guardan solo en este navegador. Descárgalos como respaldo o para llevarlos a otro.')),
      ...[importArea, msg].filter(Boolean)); // replaceChildren escribe "null" si recibe null
  }

  favs.onChange(() => { favMsg = ''; render(); });
  render();
})();
