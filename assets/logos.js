// Logos en SVG inline (sin descargas). Para una herramienta nueva: agrega una clave con su id,
// o se usará el logo genérico de terminal.
(function () {
  const svg = (inner, vb) =>
    `<svg viewBox="${vb || '0 0 64 64'}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${inner}</svg>`;

  // Ballena de Docker: casco + contenedores apilados
  const docker = svg(
    '<g fill="currentColor">' +
    '<rect x="12" y="24" width="7" height="7" rx="1"/><rect x="20.5" y="24" width="7" height="7" rx="1"/>' +
    '<rect x="29" y="24" width="7" height="7" rx="1"/><rect x="37.5" y="24" width="7" height="7" rx="1"/>' +
    '<rect x="20.5" y="15.5" width="7" height="7" rx="1"/><rect x="29" y="15.5" width="7" height="7" rx="1"/>' +
    '<rect x="29" y="7" width="7" height="7" rx="1"/>' +
    '<path d="M4 34h49.5c2.3-.1 4.3-1.4 5.3-3.5 1.9.6 3.6 1.7 4.6 3.4-1.3 1-3 1.8-4.6 2C55.7 47 45.2 55 30 55 16.5 55 6.8 47.7 4 34z"/>' +
    '</g>'
  );

  // Timón de Kubernetes: heptágono + rueda de 7 rayos
  const cx = 32, cy = 33;
  const pt = (r, i, n, off) => {
    const a = (i * 2 * Math.PI) / n - Math.PI / 2 + (off || 0);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const poly = Array.from({ length: 7 }, (_, i) => pt(28, i, 7).map(v => v.toFixed(1)).join(',')).join(' ');
  const spokes = Array.from({ length: 7 }, (_, i) => {
    const [x1, y1] = pt(6, i, 7), [x2, y2] = pt(15, i, 7), [x3, y3] = pt(15, i, 7);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>` +
           `<circle cx="${x3.toFixed(1)}" cy="${y3.toFixed(1)}" r="2.6" fill="#fff" stroke="none"/>`;
  }).join('');
  const kubernetes = svg(
    `<polygon points="${poly}" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>` +
    `<g stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"><circle cx="${cx}" cy="${cy}" r="15"/>${spokes}</g>` +
    `<circle cx="${cx}" cy="${cy}" r="4" fill="#fff"/>`
  );

  // Git: rombo con rama y tres nodos
  const git = svg(
    '<rect x="11" y="11" width="42" height="42" rx="6" transform="rotate(45 32 32)" fill="currentColor"/>' +
    '<g stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"><path d="M27 22v20M27 32h10c3 0 5 2 5 5"/></g>' +
    '<g fill="#fff"><circle cx="27" cy="22" r="4"/><circle cx="27" cy="42" r="4"/><circle cx="42" cy="38" r="4"/></g>'
  );

  // Scoop: helado en cono
  const scoop = svg(
    '<path d="M22 32h20L32 58z" fill="currentColor" opacity=".75"/>' +
    '<circle cx="32" cy="22" r="14" fill="currentColor"/>' +
    '<path d="M24 22a8 8 0 0 1 6-7" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".8"/>'
  );

  // Maven: cuadro con una M
  const maven = svg(
    '<rect x="6" y="6" width="52" height="52" rx="11" fill="currentColor"/>' +
    '<path d="M17 46V20l15 17 15-17v26" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  );

  // Node.js: hexágono con una N
  const hex = Array.from({ length: 6 }, (_, i) => pt(28, i, 6, Math.PI / 6).map(v => v.toFixed(1)).join(',')).join(' ');
  const node = svg(
    `<polygon points="${hex}" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>` +
    '<path d="M24 44V22l16 22V22" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  );

  const generico = svg(
    '<rect x="6" y="10" width="52" height="44" rx="7" fill="none" stroke="currentColor" stroke-width="4"/>' +
    '<path d="M17 26l10 8-10 8M31 44h16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
  );

  // PowerShell: ventana con el símbolo >_
  const powershell = svg(
    '<path d="M12 10h46c2.4 0 3.6 2.6 2.8 5L50 54c-.6 1.8-2.2 3-4 3H6c-2.4 0-3.6-2.6-2.8-5L14 13c.6-1.8 2.2-3 4-3z" fill="currentColor" transform="translate(0 -1)"/>' +
    '<path d="M22 22l14 11-19 12M31 47h16" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'
  );

  window.LOGOS = { docker, kubernetes, git, scoop, maven, node, powershell, generico };
})();
