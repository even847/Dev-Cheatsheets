// Cifra private/mis-comandos.json -> data/private.enc.js (AES-GCM, clave derivada con PBKDF2).
// Uso:  node tools/encrypt.js            (pide la contraseña dos veces, sin mostrarla)
// El JSON en claro vive en private/ (ignorado por git); solo el archivo cifrado va al repo.
const fs = require('fs');
const path = require('path');
const { webcrypto: crypto } = require('crypto');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'private', 'mis-comandos.json');
const OUT = process.env.PRIV_OUT || path.join(ROOT, 'data', 'private.enc.js');
const ITER = 600000;

function askHidden(label) {
  return new Promise(resolve => {
    process.stdout.write(label);
    let pass = '';
    const stdin = process.stdin;
    stdin.setRawMode(true); stdin.resume(); stdin.setEncoding('utf8');
    stdin.on('data', function onData(ch) {
      for (const c of ch) {
        if (c === '\r' || c === '\n') {
          stdin.setRawMode(false); stdin.pause(); stdin.removeListener('data', onData);
          process.stdout.write('\n'); return resolve(pass);
        }
        if (c === '\u0003') process.exit(1);               // Ctrl+C
        if (c === '\u007f' || c === '\b') pass = pass.slice(0, -1);
        else pass += c;
      }
    });
  });
}

const b64 = u8 => Buffer.from(u8).toString('base64');

(async () => {
  const plain = fs.readFileSync(SRC, 'utf8');
  JSON.parse(plain); // falla aquí si el JSON está mal escrito

  let pass = process.env.PRIV_PASS; // solo para pruebas automáticas
  if (!pass) {
    if (!process.stdin.isTTY) { console.error('Ejecútalo en una terminal interactiva.'); process.exit(1); }
    pass = await askHidden('Contraseña: ');
    if (pass.length < 12) { console.error('Usa al menos 12 caracteres (mejor una frase de varias palabras).'); process.exit(1); }
    if (pass !== await askHidden('Repítela:   ')) { console.error('No coinciden.'); process.exit(1); }
  }

  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITER }, base,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain)));

  const blob = { v: 1, iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct) };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, '// Contenido cifrado: ilegible sin la contraseña. Generado por tools/encrypt.js\nwindow.PRIVATE_BLOB = ' + JSON.stringify(blob) + ';\n');
  console.log('Listo: ' + path.relative(ROOT, OUT));
})();
