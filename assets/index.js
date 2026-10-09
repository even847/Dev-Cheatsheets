(function () {
  const { el, loadScript, logoFor, initTheme, norm, favs } = window.DC;
  initTheme();

  const grid = document.getElementById('grid');
  const results = document.getElementById('results');
  const input = document.getElementById('q');
  // Orden alfabético por nombre, sin distinguir mayúsculas (así "nvm" queda entre Maven y Scoop)
  const registry = [...(window.REGISTRY || [])].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));

  // Contador del botón de favoritos (los favoritos viven solo en este navegador)
  const favCount = document.getElementById('fav-count');
  const paintFavCount = () => { favCount.textContent = String(favs.list().length); };
  favs.onChange(paintFavCount);
  paintFavCount();

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
      ...shown.map(h => el('a', { class: 'hit', href: 'tool.html?t=' + h.tool.id + '&hl=' + encodeURIComponent(h.cmd) + '#' + h.sid },
        el('code', {}, h.cmd),
        el('small', {}, el('span', { class: 'tag', style: 'color:' + h.tool.color }, h.tool.nombre), ' › ' + h.seccion + (h.desc ? ' — ' + h.desc : '')))));
  }
  input.addEventListener('input', search);

  /* ----- perfil privado: la card y sus comandos solo existen mientras está desbloqueado ----- */
  const lockBtn = document.getElementById('lock');
  const ICON_LOCKED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  const ICON_UNLOCKED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/></svg>';
  let privCard = null;

  function paintLock() {
    const open = !!privCard;
    lockBtn.innerHTML = open ? ICON_UNLOCKED : ICON_LOCKED;
    lockBtn.classList.toggle('on', open);
    lockBtn.hidden = !open;
    lockBtn.title = open ? 'Bloquear perfil privado' : 'Perfil privado';
    lockBtn.setAttribute('aria-label', lockBtn.title);
  }
  function showPrivate(p) {
    const t = p.entry;
    let n = 0;
    p.data.secciones.forEach(s => s.items.forEach(it => {
      n++;
      const cmd = it.cmd || it.term, desc = it.desc || it.def || '';
      index.push({ tool: t, seccion: s.titulo, sid: s.id, cmd, desc, text: norm([cmd, desc, it.alias].filter(Boolean).join(' ')) });
    }));
    privCard = el('a', { class: 'card', href: 'tool.html?t=' + t.id, style: '--accent:' + t.color },
      el('div', { class: 'logo', html: logoFor(t.id) }),
      el('h2', {}, t.nombre),
      el('p', {}, t.descripcion),
      el('div', { class: 'meta' }, el('span', { class: 'pill' }, 'Privado'), p.data.secciones.length + ' secciones · ' + n + ' entradas'));
    grid.prepend(privCard);
    paintLock(); search();
  }
  function hidePrivate() {
    if (privCard) privCard.remove();
    privCard = null;
    for (let i = index.length - 1; i >= 0; i--) if (index[i].tool.id === 'privado') index.splice(i, 1);
    paintLock(); search();
  }
  let busy = false;
  async function toggle() {
    if (busy) return;
    busy = true;
    try {
      if (privCard) { DC.priv.lock(); hidePrivate(); return; }
      if (!(await DC.priv.ready())) return;
      if (await DC.priv.prompt()) showPrivate(await DC.priv.merged());
    } finally { busy = false; }
  }
  lockBtn.addEventListener('click', toggle);
  // Sin candado a la vista: se desbloquea con Ctrl+Alt+D. El botón solo aparece mientras está desbloqueado, para poder bloquear
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && !e.shiftKey && e.code === 'KeyD') { e.preventDefault(); toggle(); }
  });
  // Si ya lo desbloqueaste en esta pestaña, vuelve solo
  DC.priv.ready().then(async has => {
    if (!has) return;
    const p = await DC.priv.merged();
    if (p) showPrivate(p);
  });

  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });
})();
