// Build-time icon + OG image pipeline for BestLocal (v2 "Gaja" brand).
// Cream + serif editorial, deep green. Run: npm run build:icons
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const ICONS = "public/assets/icons";
const PUB = "public";
await mkdir(ICONS, { recursive: true });
await mkdir(`${PUB}/assets/img`, { recursive: true });

const PINE = "#16301F";
const PINE_DEEP = "#102417";
const ACCENT = "#2E9E58";
const CREAM = "#F6F2E8";
const INK = "#182A1E";

// --- favicon: pine rounded tile + accent dot (the "● BestLocal" mark) ---
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="${PINE}"/>
  <circle cx="16" cy="16" r="7.5" fill="${ACCENT}"/>
</svg>`;
await writeFile(`${PUB}/favicon.svg`, faviconSvg);

const tile = (s) => sharp(Buffer.from(faviconSvg)).resize(s, s);
await tile(32).png().toFile(`${ICONS}/favicon-32.png`);
await tile(16).png().toFile(`${ICONS}/favicon-16.png`);
await tile(180).png().toFile(`${ICONS}/apple-touch-icon.png`);
await tile(192).png().toFile(`${ICONS}/icon-192.png`);
await tile(512).png().toFile(`${ICONS}/icon-512.png`);
await tile(32).png().toFile(`${PUB}/favicon.ico`);

// maskable (more padding around the dot)
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${PINE}"/>
  <circle cx="16" cy="16" r="6" fill="${ACCENT}"/>
</svg>`;
await sharp(Buffer.from(maskable)).png().toFile(`${ICONS}/icon-maskable-512.png`);

// --- OG image 1200x630 — cream editorial, serif headline ---
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="88%" cy="-12%" r="95%">
      <stop offset="0%" stop-color="#2E9E58" stop-opacity="0.14"/>
      <stop offset="60%" stop-color="${CREAM}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${CREAM}"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(80 78)">
    <circle cx="11" cy="14" r="11" fill="${ACCENT}"/>
    <text x="36" y="24" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="${INK}">BestLocal</text>
  </g>
  <text x="80" y="270" font-family="Georgia, 'Times New Roman', serif" font-size="74" font-weight="600" fill="${INK}">Wizytówka Google</text>
  <text x="80" y="356" font-family="Georgia, 'Times New Roman', serif" font-size="74" font-weight="600" fill="${INK}">zadbana <tspan fill="${ACCENT}" font-style="italic">za Ciebie.</tspan></text>
  <text x="82" y="446" font-family="Arial, Helvetica, sans-serif" font-size="29" fill="#182A1Eb0">Opinie, posty, pozycja w Mapach, wywiad konkurencyjny i widoczność w AI.</text>
  <g transform="translate(82 520)">
    <rect x="0" y="-26" width="560" height="44" rx="22" fill="${PINE}"/>
    <text x="24" y="3" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="${CREAM}">Wczesny dostęp · od 99 zł/mc · start jesienią 2026</text>
  </g>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 86, mozjpeg: true }).toFile(`${PUB}/assets/img/og-image.jpg`);

console.log("✓ v2 icons + favicon.svg + og-image.jpg generated");
