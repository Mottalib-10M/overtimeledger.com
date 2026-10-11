/** og-en.png (1200×630) with the flag-and-house logo of public/favicon.svg (the trame's generator writes the
 *  symbol as text, which shows the word "maison"). Does not touch the icons: gen-icons.mjs makes those. */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(here, '..', 'public');
const cfg = JSON.parse(readFileSync(join(here, '..', 'src', 'data', 'og.json'), 'utf8'));
const logo = Buffer.from(readFileSync(join(PUBLIC, 'favicon.svg'))).toString('base64');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
for (const v of cfg.variants) {
  const lines = v.title.split('\n');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630"><rect width="1200" height="630" fill="#fff"/><rect width="1200" height="14" fill="${cfg.accent}"/>
  <image x="80" y="70" width="72" height="72" href="data:image/svg+xml;base64,${logo}"/>
  <text x="172" y="116" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="#0f172a">${esc(v.brand)}</text>
  ${lines.map((l, i) => `<text x="80" y="${260 + i * 78}" font-family="Helvetica, Arial, sans-serif" font-size="62" font-weight="800" fill="#0f172a">${esc(l)}</text>`).join('')}
  <text x="80" y="${260 + lines.length * 78 + 10}" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#475569">${esc(v.subtitle)}</text>
  <rect x="80" y="540" width="${v.badge.length * 14 + 40}" height="44" rx="22" fill="#f8fafc" stroke="${cfg.accent}"/><text x="${100 + v.badge.length * 7}" y="569" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="600" fill="${cfg.accent}" text-anchor="middle">${esc(v.badge)}</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(PUBLIC, v.file));
  console.log('✓', v.file);
}
