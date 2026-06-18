// Build-time image pipeline for BestLocal.
// Reads originals from src-assets/, writes optimized AVIF + WebP + JPEG
// (multiple widths) into public/assets/img/. Run: npm run build:images
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const SRC = "src-assets";
const OUT = "public/assets/img";

// width sets per role
const HERO_WIDTHS = [560, 840, 1120];
const CARD_WIDTHS = [480, 700, 900];

const jobs = [
  { file: "hero-barber.jpg", base: "hero-barber", widths: HERO_WIDTHS },
  { file: "ind-fryzjer.jpg", base: "ind-fryzjer", widths: CARD_WIDTHS },
  { file: "ind-beauty.jpg",  base: "ind-beauty",  widths: CARD_WIDTHS },
  { file: "ind-gastro.jpg",  base: "ind-gastro",  widths: CARD_WIDTHS },
  { file: "ind-moto.jpg",    base: "ind-moto",    widths: CARD_WIDTHS },
  { file: "ind-zdrowie.jpg", base: "ind-zdrowie", widths: CARD_WIDTHS },
  { file: "ind-uslugi.jpg",  base: "ind-uslugi",  widths: CARD_WIDTHS },
];

await mkdir(OUT, { recursive: true });

let total = 0;
for (const job of jobs) {
  const input = path.join(SRC, job.file);
  for (const w of job.widths) {
    const pipe = sharp(input).resize({ width: w, withoutEnlargement: true });
    const stem = path.join(OUT, `${job.base}-${w}`);
    await pipe.clone().avif({ quality: 52, effort: 6 }).toFile(`${stem}.avif`);
    await pipe.clone().webp({ quality: 74 }).toFile(`${stem}.webp`);
    await pipe.clone().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(`${stem}.jpg`);
    total += 3;
  }
  console.log(`✓ ${job.base} → ${job.widths.join(",")}px`);
}

// report
const files = await readdir(OUT);
console.log(`\nGenerated ${total} files (${files.length} total in ${OUT}).`);
