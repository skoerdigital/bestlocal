// Build-time HTML optimizer for the landing page.
// Source of truth: public/index.template.html + css/*.css + js/landing.js
// Output: public/index.html with (1) all CSS inlined (no render-blocking
// stylesheet requests) and (2) a content-hashed landing.<hash>.js for
// 1-year immutable caching. Run: npm run build:html
import { readFile, writeFile, readdir, unlink, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const PUB = "public";

// --- 1. fingerprint landing.js ---
const jsRaw = await readFile(`${PUB}/js/landing.js`);
const hash = createHash("sha256").update(jsRaw).digest("hex").slice(0, 8);
const hashedJs = `landing.${hash}.js`;
// clean old hashed copies
for (const f of await readdir(`${PUB}/js`)) {
  if (/^landing\.[0-9a-f]{8}\.js$/.test(f) && f !== hashedJs) await unlink(`${PUB}/js/${f}`);
}
await copyFile(`${PUB}/js/landing.js`, `${PUB}/js/${hashedJs}`);

// --- 2. assemble inline CSS (fonts first, with absolute /fonts/ paths) ---
let fontsCss = await readFile(`${PUB}/fonts/fonts.css`, "utf8");
fontsCss = fontsCss.replace(/url\(\.\//g, "url(/fonts/");
const baseCss = await readFile(`${PUB}/css/base.css`, "utf8");
const sectionsCss = await readFile(`${PUB}/css/sections.css`, "utf8");
const inlineCss = `<style>\n${fontsCss}\n${baseCss}\n${sectionsCss}\n</style>`;

// --- 3. transform template (lives at project root, not web-served) ---
let html = await readFile(`index.template.html`, "utf8");

// drop the three render-blocking stylesheet links, inject one <style> in their place
html = html
  .replace(/\n?[ \t]*<link rel="stylesheet" href="\/css\/base\.css" \/>/, "")
  .replace(/\n?[ \t]*<link rel="stylesheet" href="\/css\/sections\.css" \/>/, "")
  .replace(/[ \t]*<link rel="stylesheet" href="\/fonts\/fonts\.css" \/>/, inlineCss);

// fingerprint the script reference
html = html.replace(/\/js\/landing\.js/, `/js/${hashedJs}`);

await writeFile(`${PUB}/index.html`, html);

const cssBytes = Buffer.byteLength(inlineCss);
console.log(`✓ index.html built — inlined CSS (${(cssBytes / 1024).toFixed(1)} KB), JS → ${hashedJs}`);
