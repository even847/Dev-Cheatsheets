(function () {
  const { el, loadScript, logoFor, initTheme, copyText, favs, icons } = window.DC;
  initTheme();

  const content = document.getElementById('content');
  // Mismo orden que el inicio: alfabético por nombre
  const registry = [...(window.REGISTRY || [])].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
  document.documentElement.style.setProperty('--accent', '#e8a33d');

  let importing = false, favMsg = '';
  const requested = new Set(); // guías cuyos datos ya se pidieron (para mostrar sección y descripción)

  function lookup(f) {
    const d = window.CHEATSHEETS && window.CHEATSHEETS[f.t];
    const sec = d && d.secciones.find(s => s.id === f.s);
    const it = sec && sec.items.find(i => i.cmd === f.c);
    return { sec, it };
  }

  function row(f) {
    const { sec, it } = lookup(f);
    const detail = [sec && sec.titulo, it && it.desc].filter(Boolean).join(' — ');
    const link = el('a', { class: 'fav-link', href: 'tool.html?t=' + encodeURIComponent(f.t) + '#' + encodeURIComponent(f.s) },
      el('code', {}, f.c),
      detail && el('small', {}, detail));
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

  function render() {
    const list = favs.list();
    const groups = registry.map(t => ({ t, items: list.filter(f => f.t === t.id) })).filter(g => g.items.length);
    const known = new Set(registry.map(t => t.id));
    const orphans = list.filter(f => !known.has(f.t)); // guías que ya no existen

    const msg = el('p', { class: 'favs-msg', role: 'status', 'aria-live': 'polite' }, favMsg);
    const exportBtn = el('button', { type: 'button', class: 'favs-btn', disabled: list.length === 0 }, 'Exportar');
    exportBtn.addEventListener('click', async () => {
      favMsg = (await copyText(favs.exportText()))
        ? 'Favoritos copiados al portapapeles. Pégalos en otro navegador con Importar.'
        : 'No se pudo copiar al portapapeles.';
      msg.textContent = favMsg;
    });
    const importBtn = el('button', { type: 'button', class: 'favs-btn' }, importing ? 'Cancelar' : 'Importar');
    importBtn.addEventListener('click', () => { importing = !importing; favMsg = ''; render(); });

    const importArea = !importing ? null : (() => {
      const ta = el('textarea', { class: 'favs-import', rows: '4', placeholder: 'Pega aquí los favoritos que exportaste', 'aria-label': 'Favoritos exportados' });
      const apply = el('button', { type: 'button', class: 'favs-btn primary' }, 'Aplicar');
      apply.addEventListener('click', () => {
        const r = favs.importText(ta.value);
        if (!r) favMsg = 'Ese texto no es una exportación de favoritos válida.';
        else {
          favMsg = r.added + ' agregado' + (r.added === 1 ? '' : 's') + (r.skipped ? ' · ' + r.skipped + ' omitido' + (r.skipped === 1 ? '' : 's') : '');
          importing = false;
        }
        render();
      });
      return el('div', { class: 'favs-importbox' }, ta, apply);
    })();

    content.replaceChildren(
      el('div', { class: 'tool-head' },
        el('div', { class: 'logo', html: icons.starOn }),
        el('div', {}, el('h1', {}, 'Favoritos'),
          el('p', {}, 'Los comandos que marcaste con ★ en todas las guías. Se guardan solo en este navegador.'))),
      list.length
        ? el('div', {}, ...groups.map(g => group(g.t.nombre, g.t.color, g.t.id, g.items)),
            orphans.length ? group('Otras', null, null, orphans) : null)
        : el('div', { class: 'empty' }, 'Todavía no tienes favoritos. Abre una guía y marca con ★ los comandos que más usas. ',
            el('a', { href: 'index.html' }, 'Ver las guías')),
      el('div', { class: 'favs-tools' }, exportBtn, importBtn,
        el('span', { class: 'favs-note' }, 'Exporta tus favoritos para tener un respaldo o llevarlos a otro navegador.')),
      importArea, msg);
  }

  // Pide los datos de las guías con favoritos, para mostrar el nombre de la sección y la descripción
  function load() {
    const ids = [...new Set(favs.list().map(f => f.t))]
      .filter(id => !requested.has(id) && registry.some(t => t.id === id && t.estado === 'listo'));
    ids.forEach(id => requested.add(id));
    return Promise.all(ids.map(id => loadScript('data/' + id + '.js').catch(() => { /* se muestra sin detalle */ })))
      .then(() => { if (ids.length) render(); });
  }

  favs.onChange(() => { favMsg = ''; render(); load(); });
  render();
  load();
})();
