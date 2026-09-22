(function () {
  const { el, codeBlock, loadScript, logoFor, initTheme, norm } = window.DC;
  const params = new URLSearchParams(location.search);
  const id = params.get('t');
  const entry = (window.REGISTRY || []).find(t => t.id === id);

  const layout = document.getElementById('layout');
  const toc = document.getElementById('toc');
  const content = document.getElementById('content');
  const searchInput = document.getElementById('q');

  initTheme();

  function fail(msg) {
    layout.replaceChildren(el('main', { style: 'grid-column:1/-1' },
      el('div', { class: 'empty' }, msg, ' ', el('a', { href: 'index.html' }, 'Volver al inicio'))));
  }
  if (!entry) return fail('No existe esa guía.');

  document.documentElement.style.setProperty('--accent', entry.color);
  document.title = entry.nombre + ' · Dev-Cheatsheets';
  document.getElementById('crumb').textContent = entry.nombre;
  document.getElementById('crumb-logo').innerHTML = logoFor(entry.id);

  if (entry.estado !== 'listo') {
    document.querySelector('.topbar .search').hidden = true;
    document.getElementById('toc-toggle').hidden = true;
    layout.replaceChildren(el('main', { class: 'construction' },
      el('div', { class: 'logo', html: logoFor(entry.id) }),
      el('h1', {}, entry.nombre),
      el('p', {}, entry.descripcion),
      el('span', { class: 'pill big' }, 'En construcción'),
      el('p', { class: 'hint' }, 'Esta guía todavía no está lista. Vuelve pronto.'),
      el('a', { class: 'navbtn', href: 'index.html' }, '← Volver a todas las guías')));
    return;
  }

  loadScript('data/' + entry.id + '.js').then(() => {
    const data = window.CHEATSHEETS && window.CHEATSHEETS[entry.id];
    if (!data) throw new Error('El archivo de datos no define CHEATSHEETS.' + entry.id);
    render(data);
  }).catch(e => fail(e.message));

  // Se muestra una sección a la vez; al buscar se muestran todas las coincidencias.
  let cur = 0, searching = false;

  function render(data) {
    const total = data.secciones.reduce((n, s) => n + s.items.length, 0);
    const baseStatus = total + ' entradas en ' + data.secciones.length + ' secciones · Haz clic en un <valor> amarillo para escribir el tuyo';
    const status = el('p', { class: 'status', 'aria-live': 'polite' }, baseStatus);

    content.append(
      el('div', { class: 'tool-head' },
        el('div', { class: 'logo', html: logoFor(entry.id) }),
        el('div', {}, el('h1', {}, data.meta.nombre), el('p', {}, data.meta.subtitulo))),
      status
    );

    const secEls = [], tocLinks = [];

    function apply() {
      document.body.classList.toggle('searching', searching);
      secEls.forEach((s, i) => s.sec.classList.toggle('off', !searching && i !== cur));
      if (!searching) tocLinks.forEach((l, j) => l.classList.toggle('active', j === cur));
    }
    function go(i) {
      cur = i; apply();
      try { history.replaceState(null, '', '#' + secEls[i].sec.id); } catch (e) { /* ignorar */ }
      secEls[i].sec.scrollIntoView();
    }
    toc.append(el('h2', {}, 'Índice'));

    data.secciones.forEach((s, idx) => {
      const isGloss = s.tipo === 'glosario';
      const list = el('div', { class: isGloss ? 'glosario' : 'items' + (s.tipo === 'pasos' ? ' pasos' : '') });
      const itemEls = s.items.map(it => {
        let node;
        if (isGloss) {
          node = el('div', { class: 'item' }, el('dl', { style: 'margin:0' }, el('dt', {}, it.term), el('dd', {}, it.def)));
        } else {
          node = el('article', { class: 'item' },
            codeBlock(it.cmd, { plain: !!s.lang }),
            it.desc && el('p', { class: 'desc' }, it.desc),
            it.ej && el('div', { class: 'ej' }, el('span', { class: 'lbl' }, 'Salida de ejemplo'), el('pre', {}, it.ej)),
            it.alias && el('div', { class: 'alias' }, el('span', { class: 'lbl' }, 'Alias'), codeBlock(it.alias, { small: true })),
            it.tip && el('div', { class: 'tip' }, it.tip),
            it.warn && el('div', { class: 'warn' }, it.warn));
        }
        node._text = norm([it.cmd, it.desc, it.alias, it.ej, it.tip, it.term, it.def].filter(Boolean).join(' '));
        list.append(node);
        return node;
      });

      const count = el('span', { class: 'count' }, s.items.length + (isGloss ? ' términos' : ' entradas'));
      const last = data.secciones.length - 1;
      const navBtn = (to, label, cls) => {
        const b = el('button', { type: 'button', class: 'navbtn ' + cls }, label);
        b.addEventListener('click', () => go(to));
        return b;
      };
      const secnav = el('div', { class: 'secnav' },
        idx > 0 ? navBtn(idx - 1, '← ' + data.secciones[idx - 1].titulo, 'prev') : el('span'),
        idx < last ? navBtn(idx + 1, data.secciones[idx + 1].titulo + ' →', 'next') : el('span'));
      const sec = el('section', { class: 'sec', id: s.id },
        el('h2', {}, el('span', { class: 'num' }, String(idx + 1).padStart(2, '0')), s.titulo, count),
        s.intro && el('p', { class: 'intro' }, s.intro),
        s.nota && el('div', { class: 'note' }, s.nota),
        list,
        secnav);
      content.append(sec);

      const n = el('span', { class: 'n' }, String(s.items.length));
      const a = el('a', { href: '#' + s.id }, el('span', {}, s.titulo), n);
      a.addEventListener('click', e => {
        document.body.classList.remove('toc-open');
        if (!searching) { e.preventDefault(); go(idx); }
      });
      toc.append(a);
      secEls.push({ sec, itemEls, count, n, total: s.items.length, gloss: isGloss });
      tocLinks.push(a);
    });

    const empty = el('div', { class: 'empty hidden', hidden: true }, 'Nada coincide con tu búsqueda.');
    content.append(empty);

    /* ----- búsqueda ----- */
    function filter() {
      const q = norm(searchInput.value.trim());
      const words = q.split(/\s+/).filter(Boolean);
      searching = words.length > 0;
      let shown = 0;
      secEls.forEach((s, i) => {
        let vis = 0;
        s.itemEls.forEach(n => {
          const ok = words.every(w => n._text.includes(w));
          n.classList.toggle('hidden', !ok);
          if (ok) vis++;
        });
        s.sec.classList.toggle('hidden', vis === 0);
        tocLinks[i].classList.toggle('dim', vis === 0);
        s.n.textContent = words.length ? vis + '/' + s.total : String(s.total);
        s.count.textContent = words.length ? vis + ' de ' + s.total : s.total + (s.gloss ? ' términos' : ' entradas');
        shown += vis;
      });
      empty.hidden = shown !== 0 || !words.length;
      status.textContent = words.length ? shown + ' resultado' + (shown === 1 ? '' : 's') : baseStatus;
      apply();
    }
    searchInput.addEventListener('input', filter);
    document.addEventListener('keydown', e => {
      const typing = /input|textarea/i.test(document.activeElement.tagName);
      if (e.key === '/' && !typing) { e.preventDefault(); searchInput.focus(); }
      else if (e.key === 'Escape' && document.activeElement === searchInput) { searchInput.value = ''; filter(); searchInput.blur(); }
    });
    const q0 = params.get('q');
    if (q0) { searchInput.value = q0; filter(); }

    /* ----- índice: sección activa mientras se hace scroll ----- */
    const io = new IntersectionObserver(entries => {
      if (!searching) return; // sin búsqueda, apply() marca la sección activa
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const i = secEls.findIndex(s => s.sec === en.target);
        tocLinks.forEach((l, j) => l.classList.toggle('active', i === j));
        if (window.innerWidth > 900) tocLinks[i].scrollIntoView({ block: 'nearest' });
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    secEls.forEach(s => io.observe(s.sec));

    const idxFromHash = () => secEls.findIndex(s => s.sec.id === decodeURIComponent(location.hash.slice(1)));
    const h0 = location.hash ? idxFromHash() : -1;
    if (h0 >= 0) cur = h0;
    apply();
    if (h0 >= 0) requestAnimationFrame(() => secEls[h0].sec.scrollIntoView());

    // Botón atrás / enlaces con #sección estando ya en la página
    window.addEventListener('hashchange', () => {
      const i = idxFromHash();
      if (i < 0) return;
      cur = i; apply(); secEls[i].sec.scrollIntoView();
    });
  }

  document.getElementById('toc-toggle').addEventListener('click', () => document.body.classList.toggle('toc-open'));
  document.addEventListener('click', e => {
    if (document.body.classList.contains('toc-open') && !e.target.closest('.toc, #toc-toggle')) document.body.classList.remove('toc-open');
  });
})();
