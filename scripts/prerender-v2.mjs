// Prerender the v3 React prototype to clean static HTML (#root innerHTML).
// Uses system Chrome via puppeteer-core. Output: scripts/.v3-root.html
import puppeteer from "puppeteer-core";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { writeFile } from "node:fs/promises";

const PROTO = "_prototype-source-2";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 8123;

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jsx": "text/babel", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/LocalExpert v3.html";
  const f = path.join(PROTO, p);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(f).toLowerCase()] || "application/octet-stream" });
    res.end(d);
  });
});
await new Promise((r) => server.listen(PORT, r));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1 });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle0", timeout: 60000 });
// wait for React to render + reveals to settle
await page.waitForSelector(".hero .display", { timeout: 30000 });
await page.evaluate(() => {
  // force all reveal elements visible + finalize so the static snapshot is complete
  document.documentElement.classList.add("skip-anim");
  document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"));
  window.dispatchEvent(new Event("le-skip-anim"));
});
await new Promise((r) => setTimeout(r, 1500)); // let tickers/bars snap to final
const rootHtml = await page.evaluate(() => document.getElementById("root").innerHTML);

await writeFile("scripts/.v3-root.html", rootHtml);
console.log(`✓ prerendered #root → scripts/.v3-root.html (${(rootHtml.length / 1024).toFixed(1)} KB)`);

await browser.close();
server.close();
