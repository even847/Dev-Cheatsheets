(function () {
  const KEY = 'dc-theme';
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* sin almacenamiento: no pasa nada */ } }
  };
  const saved = store.get();
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;

  const ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
  const ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat()) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(c));
    return n;
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext !== false) { await navigator.clipboard.writeText(text); return true; }
    } catch (e) { /* cae al método antiguo */ }
    const ta = el('textarea', { style: 'position:fixed;opacity:0;top:0' });
    ta.value = text; document.body.append(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  // Los <marcadores> son editables: escribes tu valor y se actualiza en toda la página.
  // Todo se inserta con textContent (sin innerHTML).
  function withPlaceholders(text) {
    const frag = document.createDocumentFragment();
    text.split(/(<[^<>\s][^<>\n]*>)/).forEach(part => {
      frag.append(/^<[^<>\s][^<>\n]*>$/.test(part)
        ? el('span', { class: 'ph', contenteditable: 'plaintext-only', spellcheck: 'false', 'data-name': part,
                       role: 'textbox', 'aria-label': 'Valor para ' + part, title: 'Haz clic para escribir tu valor' }, part)
        : part);
    });
    return frag;
  }

  function selectAll(node) {
    const r = document.createRange(); r.selectNodeContents(node);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  function sameName(name, except) {
    return [...document.querySelectorAll('.ph')].filter(p => p !== except && p.dataset.name === name);
  }
  document.addEventListener('click', e => {
    const p = e.target.closest && e.target.closest('.ph');
    if (p && !p.classList.contains('filled')) selectAll(p);
  });
  document.addEventListener('focusin', e => {
    if (e.target.classList && e.target.classList.contains('ph') && !e.target.classList.contains('filled')) selectAll(e.target);
  });
  document.addEventListener('input', e => {
    const p = e.target;
    if (!p.classList || !p.classList.contains('ph')) return;
    const v = p.textContent.replace(/\s+/g, ' ');
    p.classList.toggle('filled', v.trim() !== '');
    sameName(p.dataset.name, p).forEach(o => { o.textContent = v.trim() ? v : o.dataset.name; o.classList.toggle('filled', v.trim() !== ''); });
  });
  document.addEventListener('focusout', e => {
    const p = e.target;
    if (!p.classList || !p.classList.contains('ph')) return;
    if (p.textContent.trim() === '') { p.textContent = p.dataset.name; p.classList.remove('filled'); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('ph')) { e.preventDefault(); e.target.blur(); }
  });

  function codeBlock(text, opts) {
    opts = opts || {};
    const btn = el('button', { class: 'copy', type: 'button', 'aria-label': 'Copiar al portapapeles', html: ICON_COPY + '<span>Copiar</span>' });
    let timer;
    btn.addEventListener('click', async () => {
      const ok = await copyText(code.textContent); // incluye los valores que escribiste en los marcadores
      btn.classList.toggle('ok', ok);
      btn.innerHTML = (ok ? ICON_OK : ICON_COPY) + '<span>' + (ok ? '¡Copiado!' : 'Error') + '</span>';
      clearTimeout(timer);
      timer = setTimeout(() => { btn.classList.remove('ok'); btn.innerHTML = ICON_COPY + '<span>Copiar</span>'; }, 1600);
    });
    const code = el('code', {}, withPlaceholders(text));
    return el('div', { class: 'code' + (opts.plain ? ' plain' : '') + (opts.small ? ' small' : '') }, el('pre', {}, code), btn);
  }

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = el('script', { src });
      s.onload = res; s.onerror = () => rej(new Error('No se pudo cargar ' + src));
      document.head.append(s);
    });
  }

  function logoFor(id) { return (window.LOGOS && (window.LOGOS[id] || window.LOGOS.generico)) || ''; }

  function initTheme() {
    const btn = document.getElementById('theme');
    if (!btn) return;
    const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    const isDark = () => document.documentElement.dataset.theme === 'dark' ||
      (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    const paint = () => { btn.innerHTML = isDark() ? sun : moon; btn.title = isDark() ? 'Modo claro' : 'Modo oscuro'; btn.setAttribute('aria-label', btn.title); };
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      document.documentElement.dataset.theme = next; store.set(next); paint();
    });
    paint();
  }

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* ---------- favoritos ----------
     Se guardan solo en el localStorage de este navegador: no se comparten ni viajan con el enlace.
     Cada favorito es { t: id de la guía, s: id de la sección, c: comando tal como está en la guía }. */
  const STAR_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>';
  const STAR_ON = STAR_OFF.replace('fill="none"', 'fill="currentColor"');
  const FAV_KEY = 'dc-favs', FAV_MAX = 200;
  const favId = f => f.t + '|' + f.s + '|' + f.c;
  const validFav = f => !!f && typeof f.t === 'string' && typeof f.s === 'string' && typeof f.c === 'string' &&
    f.t !== '' && f.c !== '' && f.t.length <= 60 && f.s.length <= 120 && f.c.length <= 2000;
  const cleanFav = f => ({ t: f.t, s: f.s, c: f.c });

  function favRead() {
    try {
      const a = JSON.parse(localStorage.getItem(FAV_KEY));
      return Array.isArray(a) ? a.filter(validFav).slice(0, FAV_MAX).map(cleanFav) : [];
    } catch (e) { return []; }
  }

  let favList = favRead();
  const favListeners = [];
  const favNotify = () => favListeners.slice().forEach(fn => fn());
  function favSave() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favList)); } catch (e) { /* sin almacenamiento: quedan solo en esta pestaña */ }
    favNotify();
  }
  // Cambios hechos desde otra pestaña del mismo navegador
  window.addEventListener('storage', e => { if (e.key === FAV_KEY) { favList = favRead(); favNotify(); } });

  const favs = {
    max: FAV_MAX,
    list: () => favList.slice(),
    has: f => favList.some(x => favId(x) === favId(f)),
    onChange: fn => { favListeners.push(fn); },
    // devuelve true si quedó marcado, false si se quitó, null si se alcanzó el límite
    toggle(f) {
      const i = favList.findIndex(x => favId(x) === favId(f));
      if (i >= 0) { favList.splice(i, 1); favSave(); return false; }
      if (favList.length >= FAV_MAX) return null;
      favList.unshift(cleanFav(f)); favSave(); return true;
    },
    // agrega varios favoritos { t, s, c } sin duplicar; devuelve { added, skipped }
    addMany(arr) {
      let added = 0, skipped = 0;
      for (const f of arr) {
        if (!validFav(f)) { skipped++; continue; }
        if (favList.some(x => favId(x) === favId(f))) continue;
        if (favList.length >= FAV_MAX) { skipped++; continue; }
        favList.push(cleanFav(f)); added++;
      }
      if (added) favSave();
      return { added, skipped };
    },
    // acepta un JSON ({ favs: [...] } o un arreglo); devuelve { added, skipped } o null si el texto no sirve
    importText(text) {
      let data;
      try { data = JSON.parse(text); } catch (e) { return null; }
      const arr = Array.isArray(data) ? data : data && Array.isArray(data.favs) ? data.favs : null;
      return arr ? favs.addMany(arr) : null;
    }
  };

  // Botón de estrella sincronizado con el estado de favoritos (para las páginas de guía)
  function favButton(f) {
    const btn = el('button', { class: 'fav', type: 'button' });
    const paint = () => {
      const on = favs.has(f);
      btn.classList.toggle('on', on);
      btn.innerHTML = on ? STAR_ON : STAR_OFF;
      btn.title = on ? 'Quitar de favoritos' : 'Marcar como favorito';
      btn.setAttribute('aria-label', btn.title);
      btn.setAttribute('aria-pressed', String(on));
    };
    btn.addEventListener('click', () => {
      if (favs.toggle(f) === null) btn.title = 'Límite de ' + FAV_MAX + ' favoritos alcanzado';
    });
    favs.onChange(paint);
    paint();
    return btn;
  }

  window.DC = { el, copyText, codeBlock, loadScript, logoFor, initTheme, norm, favs, favButton, icons: { starOn: STAR_ON, starOff: STAR_OFF } };
})();
