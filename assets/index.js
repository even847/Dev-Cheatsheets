(function () {
  const { el, loadScript, logoFor, initTheme, norm } = window.DC;
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
  ));

  function search() {
    const words = norm(input.value.trim()).split(/\s+/).filter(Boolean);
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
