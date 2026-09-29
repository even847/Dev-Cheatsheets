(function () {
  const { el, codeBlock, loadScript, logoFor, initTheme, norm, favButton, favs, icons } = window.DC;
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
    const baseStatus = total + ' entradas en ' + data.secciones.length + ' secciones · Haz clic en un <valor> amarillo para escribir el tuyo · Marca con ★ tus favoritos';
    const status = el('p', { class: 'status', 'aria-live': 'polite' }, baseStatus);

    content.append(
      el('div', { class: 'tool-head' },
        el('div', { class: 'logo', html: logoFor(entry.id) }),
        el('div', {}, el('h1', {}, data.meta.nombre), el('p', {}, data.meta.subtitulo))),
      status
    );

    const secEls = [], tocLinks = [];
    const FAV_ID = 'mis-favoritos';
    let showFavs = false; // vista "Favoritos" de esta guía (no es una sección de los datos)

    function apply() {
      document.body.classList.toggle('searching', searching);
      secEls.forEach((s, i) => s.sec.classList.toggle('off', showFavs || (!searching && i !== cur)));
      favSec.classList.toggle('off', !showFavs);
      favLink.classList.toggle('active', showFavs);
      if (!searching) tocLinks.forEach((l, j) => l.classList.toggle('active', !showFavs && j === cur));
    }
    function go(i) {
      showFavs = false; cur = i; apply();
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
          const main = codeBlock(it.cmd, { plain: !!s.lang });
          main.insertBefore(favButton({ t: entry.id, s: s.id, c: it.cmd }), main.querySelector('.copy'));
          node = el('article', { class: 'item' },
            main,
            it.desc && el('p', { class: 'desc' }, it.desc),
            it.ej && el('div', { class: 'ej' }, el('span', { class: 'lbl' }, 'Salida de ejemplo'), el('pre', {}, it.ej)),
            it.alias && el('div', { class: 'alias' }, el('span', { class: 'lbl' }, 'Alias'), codeBlock(it.alias, { small: true })),
            it.tip && el('div', { class: 'tip' }, it.tip),
            it.warn && el('div', { class: 'warn' }, it.warn));
        }
        node._cmd = it.cmd || it.term;
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

    // Centra un comando en pantalla y lo ilumina unos segundos, para ubicarlo dentro de su sección
    let flashTimer;
    function flash(cmd, sid) {
      const s = secEls.find(x => x.sec.id === sid) || secEls.find(x => x.itemEls.some(n => n._cmd === cmd));
      const node = s && s.itemEls.find(n => n._cmd === cmd);
      if (!node) return;
      const i = secEls.indexOf(s);
      if (!searching && (showFavs || i !== cur)) { showFavs = false; cur = i; apply(); } // la sección tiene que estar visible
      document.querySelectorAll('.item.flash').forEach(n => n.classList.remove('flash'));
      void node.offsetWidth; // reinicia la animación si ya estaba iluminado
      node.classList.add('flash');
      node.scrollIntoView({ block: 'center' });
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => node.classList.remove('flash'), 5000);
    }

    /* ----- vista "Favoritos" de esta guía: solo los comandos marcados aquí ----- */
    const favCount = el('span', { class: 'n' }, '0');
    const favLink = el('a', { href: '#' + FAV_ID, class: 'favlink' },
      el('span', {}, el('span', { class: 'star', html: icons.starOn }), 'Favoritos'), favCount);
    toc.querySelector('h2').after(favLink);
    const favList = el('div', { class: 'items' });
    const favSecCount = el('span', { class: 'count' });
    const favSec = el('section', { class: 'sec off', id: FAV_ID },
      el('h2', {}, el('span', { class: 'num' }, '★'), 'Favoritos', favSecCount),
      el('p', { class: 'intro' }, 'Tus comandos marcados con ★ en esta guía. Se guardan solo en este navegador.'),
      favList);
    content.append(favSec);

    function favItem(f) {
      const idx = data.secciones.findIndex(s => s.id === f.s);
      const sec = data.secciones[idx];
      const it = sec && sec.items.find(i => i.cmd === f.c);
      const code = codeBlock(f.c, { plain: !!(sec && sec.lang) });
      const remove = el('button', { class: 'fav on', type: 'button', title: 'Quitar de favoritos', 'aria-label': 'Quitar de favoritos', html: icons.starOn });
      remove.addEventListener('click', () => favs.toggle(f));
      code.insertBefore(remove, code.querySelector('.copy'));
      const where = sec ? el('button', { type: 'button', class: 'fav-where' }, sec.titulo + ' →') : null;
      if (where) where.addEventListener('click', () => { go(idx); flash(f.c, f.s); });
      return el('article', { class: 'item' }, code,
        it && it.desc ? el('p', { class: 'desc' }, it.desc) : null,
        it ? null : el('p', { class: 'desc' }, 'Este comando ya no está en la guía.'),
        where);
    }
    function renderGuideFavs() {
      const mine = favs.list().filter(f => f.t === entry.id);
      favCount.textContent = String(mine.length);
      favSecCount.textContent = mine.length + (mine.length === 1 ? ' entrada' : ' entradas');
      favList.replaceChildren(...(mine.length ? mine.map(favItem)
        : [el('div', { class: 'empty', style: 'margin-top:14px' }, 'Aún no marcaste favoritos en esta guía. Usa la ★ junto a un comando para guardarlo aquí.')]));
    }
    function goFavs() {
      if (searching) { searchInput.value = ''; filter(); }
      showFavs = true; apply();
      try { history.replaceState(null, '', '#' + FAV_ID); } catch (e) { /* ignorar */ }
      favSec.scrollIntoView();
    }
    favLink.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.remove('toc-open');
      goFavs();
    });
    favs.onChange(renderGuideFavs);
    renderGuideFavs();

    const empty = el('div', { class: 'empty hidden', hidden: true }, 'Nada coincide con tu búsqueda.');
    content.append(empty);

    /* ----- búsqueda ----- */
    function filter() {
      const q = norm(searchInput.value.trim());
      const words = q.split(/\s+/).filter(Boolean);
      searching = words.length > 0;
      if (searching) showFavs = false; // al buscar se muestran las coincidencias de toda la guía
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
    if (decodeURIComponent(location.hash.slice(1)) === FAV_ID) showFavs = true;
    apply();
    if (h0 >= 0) requestAnimationFrame(() => secEls[h0].sec.scrollIntoView());

    // Enlaces con ?hl=<comando> (favoritos, resultados de búsqueda): ilumina ese comando
    const hl = params.get('hl');
    if (hl) {
      requestAnimationFrame(() => {
        flash(hl, h0 >= 0 ? secEls[h0].sec.id : '');
        try { history.replaceState(null, '', location.pathname + '?t=' + encodeURIComponent(entry.id) + location.hash); } catch (e) { /* ignorar */ }
      });
    }

    // Botón atrás / enlaces con #sección estando ya en la página
    window.addEventListener('hashchange', () => {
      if (decodeURIComponent(location.hash.slice(1)) === FAV_ID) { showFavs = true; apply(); favSec.scrollIntoView(); return; }
      const i = idxFromHash();
      if (i < 0) return;
      showFavs = false; cur = i; apply(); secEls[i].sec.scrollIntoView();
    });
  }

  document.getElementById('toc-toggle').addEventListener('click', () => document.body.classList.toggle('toc-open'));
  document.addEventListener('click', e => {
    if (document.body.classList.contains('toc-open') && !e.target.closest('.toc, #toc-toggle')) document.body.classList.remove('toc-open');
  });
})();
