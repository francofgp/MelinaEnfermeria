// Renderiza las piezas a static/kit/<slug>.png (y el volante también a PDF).
// Uso: pnpm piezas            → todas
//      pnpm piezas volante    → una o varias por slug
// Construye el sitio en el entorno de desarrollo (los datos pendientes salen resaltados) en .piezas-build/,
// lo sirve en un puerto local y captura cada /piezas/<slug>/ con el Chrome (o Edge) instalado.
import { execFileSync } from 'node:child_process';
import { createReadStream, existsSync, readdirSync, readFileSync, statSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const ROOT = resolve(import.meta.dirname, '..');
const BUILD = join(ROOT, '.piezas-build');
const OUT = join(ROOT, 'static', 'kit');
const PORT = Number(process.env.PIEZAS_PORT || 4321);

const SIZES = {
  post: { width: 1080, height: 1350, scale: 1 },
  estado: { width: 1080, height: 1920, scale: 1 },
  volante: { width: 397, height: 560, scale: 3 }, // 105 × 148 mm a 96 dpi, capturado a ~290 dpi
};

const wanted = process.argv.slice(2);
const piezas = readdirSync(join(ROOT, 'content', 'piezas'))
  .filter((f) => f.endsWith('.md') && f !== '_index.md')
  .map((f) => {
    const slug = f.replace(/\.md$/, '');
    const formato = readFileSync(join(ROOT, 'content', 'piezas', f), 'utf8').match(/^formato:\s*(\w+)/m)?.[1];
    if (!SIZES[formato]) throw new Error(`${f}: formato desconocido "${formato}"`);
    return { slug, formato };
  })
  .filter((p) => !wanted.length || wanted.includes(p.slug));
if (!piezas.length) throw new Error(`No hay piezas que coincidan con: ${wanted.join(', ')}`);

execFileSync('hugo', ['--environment', 'development', '--destination', BUILD, '--cleanDestinationDir', '--baseURL', `http://127.0.0.1:${PORT}/`], { cwd: ROOT, stdio: 'inherit' });

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  let file = join(BUILD, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(BUILD) || !existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1');

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch({ channel: 'msedge' }));
try {
  for (const { slug, formato } of piezas) {
    const { width, height, scale } = SIZES[formato];
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
    await page.goto(`http://127.0.0.1:${PORT}/piezas/${slug}/`, { waitUntil: 'networkidle' });
    // Esperar la fuente de verdad: document.fonts.check() da true aunque la familia no esté cargada.
    await page.evaluate(() => document.fonts.ready);
    const ok = await page.evaluate(() => [...document.fonts].some((f) => f.family.includes('Schibsted') && f.status === 'loaded'));
    if (!ok) throw new Error(`${slug}: no cargó Schibsted Grotesk`);
    await page.locator('.pieza').screenshot({ path: join(OUT, `${slug}.png`) });
    if (formato === 'volante') {
      await page.pdf({ path: join(OUT, `${slug}.pdf`), width: '105mm', height: '148mm', printBackground: true, pageRanges: '1' });
    }
    console.log(`✓ ${slug} (${formato})`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
