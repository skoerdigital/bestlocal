// Build-time icon + OG image pipeline for BestLocal.
// Generates favicon.svg, PNG favicons, apple-touch-icon, maskable icons,
// and a 1200x630 OG/Twitter share image. Run: npm run build:icons
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const ICONS = "public/assets/icons";
const PUB = "public";
await mkdir(ICONS, { recursive: true });

const FOREST = "#0f2e22";
const ACCENT = "#22c08a";
const CREAM = "#f7f4ec";

// --- brand pin path (viewBox 0 0 26 26) ---
const PIN = `<path d="M13 1.5C8.3 1.5 4.5 5.3 4.5 10c0 6.4 8.5 14.5 8.5 14.5S21.5 16.4 21.5 10c0-4.7-3.8-8.5-8.5-8.5Z"/>`;

// --- favicon.svg: rounded forest tile + accent pin + cream "eye" ---
// Drawn in the pin's native 0..26 space (pin is centered, eye at cx13 cy10).
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 26 26">
  <rect width="26" height="26" rx="6" fill="${FOREST}"/>
  <g transform="translate(13 13) scale(0.86) translate(-13 -13)">
    <g fill="${ACCENT}">${PIN}</g>
    <circle cx="13" cy="10" r="3.1" fill="${CREAM}"/>
  </g>
</svg>`;
await writeFile(`${PUB}/favicon.svg`, faviconSvg);

// rasterize favicon tile to PNGs
const tile = (size) => sharp(Buffer.from(faviconSvg)).resize(size, size);
await tile(32).png().toFile(`${ICONS}/favicon-32.png`);
await tile(16).png().toFile(`${ICONS}/favicon-16.png`);
await tile(180).png().toFile(`${ICONS}/apple-touch-icon.png`);
await tile(192).png().toFile(`${ICONS}/icon-192.png`);
await tile(512).png().toFile(`${ICONS}/icon-512.png`);

// maskable icon (extra padding so safe-zone isn't clipped) — pin in 26-space, scaled down for margin
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 26 26">
  <rect width="26" height="26" fill="${FOREST}"/>
  <g transform="translate(13 13) scale(0.66) translate(-13 -13)">
    <g fill="${ACCENT}">${PIN}</g>
    <circle cx="13" cy="10" r="3.1" fill="${CREAM}"/>
  </g>
</svg>`;
await sharp(Buffer.from(maskableSvg)).png().toFile(`${ICONS}/icon-maskable-512.png`);

// .ico (multi-size) — emit 32px png named .ico (browsers accept png-in-ico via link rel=icon)
await tile(32).png().toFile(`${PUB}/favicon.ico`);

// --- OG / Twitter share image 1200x630 ---
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="85%" cy="-10%" r="90%">
      <stop offset="0%" stop-color="#22c08a" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="${FOREST}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f2e22"/>
      <stop offset="100%" stop-color="#0b241a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#b)"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(80 70)">
    <g transform="scale(1.7)" fill="${ACCENT}">${PIN}</g>
    <circle cx="22.1" cy="17" r="5.8" fill="${CREAM}"/>
    <text x="62" y="32" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="${CREAM}">BestLocal</text>
  </g>
  <text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="${CREAM}">Twoja wizytówka Google</text>
  <text x="80" y="380" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="${ACCENT}" font-style="italic">zadbana za Ciebie.</text>
  <text x="80" y="468" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#f2f3eac0">Opinie, posty i pozycja w Mapach — Ty tylko akceptujesz z telefonu.</text>
  <text x="80" y="560" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="${ACCENT}">Wczesny dostęp · od 99 zł/mc · start jesienią 2026</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 86, mozjpeg: true }).toFile(`${PUB}/assets/img/og-image.jpg`);

console.log("✓ icons + favicon.svg + og-image.jpg generated");
