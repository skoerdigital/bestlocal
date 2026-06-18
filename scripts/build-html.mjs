// Build-time HTML optimizer (v2).
// Source: index.template.html + public/css/*.css + public/js/landing.js
// Output: public/index.html with all CSS inlined (no render-blocking
// stylesheets) and a content-hashed landing.<hash>.js. Run: npm run build:html
import { readFile, writeFile, readdir, unlink, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const PUB = "public";

// --- fingerprint landing.js ---
const jsRaw = await readFile(`${PUB}/js/landing.js`);
const hash = createHash("sha256").update(jsRaw).digest("hex").slice(0, 8);
const hashedJs = `landing.${hash}.js`;
for (const f of await readdir(`${PUB}/js`)) {
  if (/^landing\.[0-9a-f]{8}\.js$/.test(f) && f !== hashedJs) await unlink(`${PUB}/js/${f}`);
}
await copyFile(`${PUB}/js/landing.js`, `${PUB}/js/${hashedJs}`);

// --- assemble inline CSS (fonts first, absolute /fonts/ paths) ---
let fontsCss = (await readFile(`${PUB}/fonts/fonts.css`, "utf8")).replace(/url\(\.\//g, "url(/fonts/");
const styles = await readFile(`${PUB}/css/styles.css`, "utf8");
const v3 = await readFile(`${PUB}/css/v3.css`, "utf8");
const extra = await readFile(`${PUB}/css/extra.css`, "utf8");
// conservative CSS minifier: strip comments, collapse whitespace, trim around delimiters
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")      // comments
    .replace(/\s+/g, " ")                   // collapse whitespace (keeps single spaces in calc())
    .replace(/\s*([{}:;,>])\s*/g, "$1")     // trim around delimiters
    .replace(/;}/g, "}")                     // drop last semicolon in a block
    .trim();
}
const combinedCss = minifyCss(`${fontsCss}\n${styles}\n${v3}\n${extra}`);
const inlineCss = `<style>${combinedCss}</style>`;

// --- transform template ---
let html = await readFile(`index.template.html`, "utf8");
html = html
  .replace(/\n?[ \t]*<link rel="stylesheet" href="\/css\/styles\.css" \/>/, "")
  .replace(/\n?[ \t]*<link rel="stylesheet" href="\/css\/v3\.css" \/>/, "")
  .replace(/\n?[ \t]*<link rel="stylesheet" href="\/css\/extra\.css" \/>/, "")
  .replace(/[ \t]*<link rel="stylesheet" href="\/fonts\/fonts\.css" \/>/, inlineCss)
  .replace(/\/js\/landing\.js/, `/js/${hashedJs}`);

await writeFile(`${PUB}/index.html`, html);
console.log(`✓ index.html built — inlined CSS (${(Buffer.byteLength(inlineCss) / 1024).toFixed(1)} KB), JS → ${hashedJs}`);
