/* BestLocal — minimal zero-dependency static server for Railway.
   Features: Brotli/gzip (cached in memory), long-cache immutable assets,
   no-cache HTML, security headers + CSP, clean 404. No npm deps at runtime. */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "public");
const PORT = process.env.PORT || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8"
};

const COMPRESSIBLE = new Set([
  ".html", ".css", ".js", ".mjs", ".json", ".webmanifest", ".xml", ".txt", ".svg", ".map"
]);
// content-hashed / versioned assets — safe to cache for a year
const IMMUTABLE_DIRS = ["/assets/", "/fonts/", "/js/"];
const compressCache = new Map(); // key: filePath|enc -> Buffer

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "connect-src 'self' https://api.web3forms.com",
    "form-action 'self' https://api.web3forms.com",
    "base-uri 'self'",
    "frame-ancestors 'self'"
  ].join("; ")
};

function cacheControl(urlPath, ext) {
  if (ext === ".html" || ext === ".xml" || ext === ".txt" || ext === ".webmanifest") {
    return "public, max-age=0, must-revalidate";
  }
  if (IMMUTABLE_DIRS.some((d) => urlPath.startsWith(d))) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=3600"; // css/js/favicons at root
}

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  let rel = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  let full = path.join(root, rel);
  if (!full.startsWith(root)) return null; // path traversal guard
  return full;
}

function pickEncoding(accept) {
  accept = accept || "";
  if (/\bbr\b/.test(accept)) return "br";
  if (/\bgzip\b/.test(accept)) return "gzip";
  return null;
}

function getCompressed(filePath, enc, raw) {
  const key = filePath + "|" + enc;
  let buf = compressCache.get(key);
  if (buf) return buf;
  buf = enc === "br"
    ? zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 10 } })
    : zlib.gzipSync(raw, { level: 8 });
  compressCache.set(key, buf);
  return buf;
}

function send(res, status, headers, body) {
  res.writeHead(status, Object.assign({}, SECURITY_HEADERS, headers));
  if (body) res.end(body); else res.end();
}

function serveFile(req, res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) return notFound(req, res);
    const ext = path.extname(filePath).toLowerCase();
    const urlPath = "/" + path.relative(ROOT, filePath).split(path.sep).join("/");
    const headers = {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": cacheControl(urlPath, ext),
      "Vary": "Accept-Encoding"
    };
    const enc = COMPRESSIBLE.has(ext) ? pickEncoding(req.headers["accept-encoding"]) : null;
    if (enc) {
      const out = getCompressed(filePath, enc, data);
      headers["Content-Encoding"] = enc;
      headers["Content-Length"] = Buffer.byteLength(out);
      if (req.method === "HEAD") return send(res, 200, headers);
      return send(res, 200, headers, out);
    }
    headers["Content-Length"] = Buffer.byteLength(data);
    if (req.method === "HEAD") return send(res, 200, headers);
    send(res, 200, headers, data);
  });
}

function notFound(req, res) {
  const custom = path.join(ROOT, "404.html");
  fs.readFile(custom, (err, data) => {
    if (err) {
      return send(res, 404, { "Content-Type": "text/html; charset=utf-8" },
        "<!doctype html><meta charset=utf-8><title>404</title><h1>404 — nie znaleziono</h1><p><a href='/'>Wróć na stronę główną</a></p>");
    }
    send(res, 404, { "Content-Type": "text/html; charset=utf-8" }, data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return send(res, 405, { Allow: "GET, HEAD" }, "Method Not Allowed");
  }
  let full = safeJoin(ROOT, req.url);
  if (!full) return notFound(req, res);

  fs.stat(full, (err, stat) => {
    if (!err && stat.isDirectory()) full = path.join(full, "index.html");
    fs.stat(full, (err2, stat2) => {
      if (err2 || !stat2.isFile()) {
        // allow extensionless -> .html (e.g. /regulamin)
        if (!path.extname(full)) {
          const asHtml = full + ".html";
          return fs.stat(asHtml, (e3, s3) => (!e3 && s3.isFile()) ? serveFile(req, res, asHtml) : notFound(req, res));
        }
        return notFound(req, res);
      }
      serveFile(req, res, full);
    });
  });
});

server.listen(PORT, () => {
  console.log(`BestLocal static server → http://0.0.0.0:${PORT} (serving ${ROOT})`);
});
