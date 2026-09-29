(function () {
  const { el, loadScript, logoFor, initTheme, norm, copyText, favs, icons } = window.DC;
  initTheme();

  const grid = document.getElementById('grid');
  const results = document.getElementById('results');
  const input = document.getElementById('q');
  // Orden alfabético por nombre, sin distinguir mayúsculas (así "nvm" queda entre Maven y Scoop)
  const registry = [...(window.REGISTRY || [])].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));

  const cards = registry.map(t => {
    const listo = t.estado === 'listo';
    const meta = el('div', { class: 'meta' }, listo ? 'Cargando…' : el('span', { class: 'pill' }, 'En construcción'));
    const card = el('a', { class: 'card', href: 'tool.html?t=' + t.id, style: '--accent:' + t.color },
      el('div', { class: 'logo', html: logoFor(t.id) }),
      el('h2', {}, t.nombre),
      el('p', {}, t.descripcion),
      meta);
    grid.append(card);
    return { t, meta, listo };
  });

  // Carga los datos de cada guía lista: cuenta entradas y habilita la búsqueda global.
  const index = []; // { tool, seccion, sid, cmd, desc, text }
  Promise.all(cards.filter(c => c.listo).map(c =>
    loadScript('data/' + c.t.id + '.js').then(() => {
      const d = window.CHEATSHEETS[c.t.id];
      let n = 0;
      d.secciones.forEach(s => s.items.forEach(it => {
        n++;
        const cmd = it.cmd || it.term, desc = it.desc || it.def || '';
        index.push({ tool: c.t, seccion: s.titulo, sid: s.id, cmd, desc, text: norm([cmd, desc, it.alias].filter(Boolean).join(' ')) });
      }));
      c.meta.textContent = d.secciones.length + ' secciones · ' + n + ' entradas';
    }).catch(() => { c.meta.textContent = 'No se pudo cargar'; })
  )).then(() => renderFavs()); // con las guías cargadas se puede mostrar el nombre de cada sección

  /* ----- favoritos (solo de este navegador) ----- */
  const favsBox = document.getElementById('favs');
  let favsOpen = favs.list().length > 0, importing = false, favMsg = '';

  function favRow(f) {
    const tool = registry.find(t => t.id === f.t);
    const hit = index.find(h => h.tool.id === f.t && h.sid === f.s);
    const link = el('a', { class: 'fav-link', href: 'tool.html?t=' + encodeURIComponent(f.t) + '#' + encodeURIComponent(f.s) },
      el('code', {}, f.c),
      el('small', {}, el('span', { class: 'tag', style: tool ? 'color:' + tool.color : null }, tool ? tool.nombre : f.t), hit ? ' › ' + hit.seccion : ''));
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

  function renderFavs() {
    const list = favs.list();
    const details = el('details', { class: 'favs-box', open: favsOpen });
    details.addEventListener('toggle', () => { favsOpen = details.open; });

    const msg = el('p', { class: 'favs-msg', role: 'status', 'aria-live': 'polite' }, favMsg);
    const exportBtn = el('button', { type: 'button', class: 'favs-btn', disabled: list.length === 0 }, 'Exportar');
    exportBtn.addEventListener('click', async () => {
      favMsg = (await copyText(favs.exportText()))
        ? 'Favoritos copiados al portapapeles. Pégalos en otro navegador con Importar.'
        : 'No se pudo copiar al portapapeles.';
      msg.textContent = favMsg;
    });
    const importBtn = el('button', { type: 'button', class: 'favs-btn' }, importing ? 'Cancelar' : 'Importar');
    importBtn.addEventListener('click', () => { importing = !importing; favMsg = ''; renderFavs(); });

    const importArea = importing && (() => {
      const ta = el('textarea', { class: 'favs-import', rows: '4', placeholder: 'Pega aquí los favoritos que exportaste', 'aria-label': 'Favoritos exportados' });
      const apply = el('button', { type: 'button', class: 'favs-btn primary' }, 'Aplicar');
      apply.addEventListener('click', () => {
        const r = favs.importText(ta.value);
        if (!r) favMsg = 'Ese texto no es una exportación de favoritos válida.';
        else {
          favMsg = r.added + ' agregado' + (r.added === 1 ? '' : 's') + (r.skipped ? ' · ' + r.skipped + ' omitido' + (r.skipped === 1 ? '' : 's') : '');
          importing = false;
        }
        renderFavs();
      });
      return el('div', { class: 'favs-importbox' }, ta, apply);
    })();

    details.append(
      el('summary', {}, el('span', { class: 'star', html: icons.starOn }), 'Favoritos', el('span', { class: 'count' }, String(list.length))),
      el('div', { class: 'favs-body' },
        list.length
          ? el('div', { class: 'fav-list' }, ...list.map(favRow))
          : el('p', { class: 'favs-empty' }, 'Todavía no tienes favoritos. Abre una guía y marca con ★ los comandos que más usas.'),
        el('div', { class: 'favs-tools' }, exportBtn, importBtn,
          el('span', { class: 'favs-note' }, 'Se guardan solo en este navegador.')),
        importArea, msg));
    favsBox.replaceChildren(details);
  }
  favs.onChange(() => { favMsg = ''; renderFavs(); });
  renderFavs();

  function search() {
    const words = norm(input.value.trim()).split(/\s+/).filter(Boolean);
    favsBox.hidden = words.length > 0;
    grid.hidden = words.length > 0;
    results.hidden = words.length === 0;
    if (!words.length) return;
    const hits = index.filter(h => words.every(w => h.text.includes(w)));
    const shown = hits.slice(0, 60);
    results.replaceChildren(
      el('h2', {}, hits.length + ' resultado' + (hits.length === 1 ? '' : 's') + (hits.length > shown.length ? ' (mostrando ' + shown.length + ')' : '')),
      ...shown.map(h => el('a', { class: 'hit', href: 'tool.html?t=' + h.tool.id + '#' + h.sid },
        el('code', {}, h.cmd),
        el('small', {}, el('span', { class: 'tag', style: 'color:' + h.tool.color }, h.tool.nombre), ' › ' + h.seccion + (h.desc ? ' — ' + h.desc : '')))));
  }
  input.addEventListener('input', search);
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });
})();
