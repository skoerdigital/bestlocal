// Build a clean production index.template.html from the prerendered #root HTML.
// - strips dev-only bits (image-slot), rebrands LocalExpert -> BestLocal
// - replaces the two React forms with Web3Forms-ready markup
// - extracts FAQ -> FAQPage JSON-LD
// - wraps in a production <head> (meta/OG/Twitter/JSON-LD/fonts/preload)
import { readFile, writeFile } from "node:fs/promises";

const DOMAIN = "https://bestlocal.pl";
let body = await readFile("scripts/.v3-root.html", "utf8");

// ---- 0. product copy edits (applied BEFORE FAQ extraction so JSON-LD matches) ----
// start date → "wkrótce" (zamiast "jesienią/jesień 2026")
body = body.replace(/jesienią 2026/g, "wkrótce").replace(/jesień 2026/g, "wkrótce");

// "Brzmi znajomo?" — mocniej o konkurencji (ranking, ceny, wady)
body = body.replace(
  `<div class="pain-list"><div class="pain lit"><span class="pain-n">/01</span><span>Masz 14 opinii. Konkurent z drugiej strony ulicy — 120.</span></div><div class="pain lit"><span class="pain-n">/02</span><span>Ktoś wystawił Ci 1 gwiazdkę i wisi bez odpowiedzi od trzech miesięcy.</span></div><div class="pain lit"><span class="pain-n">/03</span><span>Wpisujesz „fryzjer + swoja dzielnica" i nie ma Cię poza własną ulicą.</span></div><div class="pain lit"><span class="pain-n">/04</span><span>Płacisz komuś za „pozycjonowanie" i nie wiesz, co właściwie dostajesz.</span></div><div class="pain lit"><span class="pain-n">/05</span><span>Wiesz, że wizytówka jest ważna. Ale zawsze przegrywa z prowadzeniem firmy.</span></div></div>`,
  `<div class="pain-list"><div class="pain lit"><span class="pain-n">/01</span><span>Masz 14 opinii. Konkurent z drugiej strony ulicy — 120. I nie wiesz, jak to nadrobił.</span></div><div class="pain lit"><span class="pain-n">/02</span><span>Konkurent ciągle wisi nad Tobą w Mapach — a Ty nie wiesz, co takiego robi lepiej.</span></div><div class="pain lit"><span class="pain-n">/03</span><span>Nie wiesz, ile naprawdę bierze konkurencja za to samo — gdzie jesteś tańszy, a gdzie droższy.</span></div><div class="pain lit"><span class="pain-n">/04</span><span>Jego klienci na coś narzekają w opiniach. To gotowa szansa dla Ciebie — ale kto ma czas to czytać.</span></div><div class="pain lit"><span class="pain-n">/05</span><span>Ktoś wystawił Ci 1 gwiazdkę i wisi bez odpowiedzi od trzech miesięcy.</span></div><div class="pain lit"><span class="pain-n">/06</span><span>Płacisz komuś za „pozycjonowanie" i nie wiesz, co właściwie dostajesz.</span></div></div>`
);

// Funkcja 05 — widoczność w AI: uniwersalnie (bez zapięcia na ChatGPT)
body = body.replace(
  `<span class="feature-n">05 / 05</span><h3>Widoczność w AI: czy ChatGPT poleca Ciebie, czy konkurencję?</h3><p class="body">Coraz więcej osób zamiast w Google szuka w ChatGPT i podobnych: „poleć dobrego barbera na Woli". <strong>Regularnie zadajemy te pytania za Ciebie i sprawdzamy, kto pada w odpowiedziach</strong> — Ty czy konkurencja — i jak ten udział zmienia się w czasie. Dostajesz listę konkretów, które zwiększają szansę, że AI wymieni właśnie Twoją firmę. Tu nie zgadujemy: pokazujemy zapytania i odpowiedzi. <strong>Pierwsi w Polsce robimy to dla firm lokalnych.</strong></p>`,
  `<span class="feature-n">05 / 05</span><h3>Widoczność w AI: czy sztuczna inteligencja poleca Ciebie, czy konkurencję?</h3><p class="body">Klienci coraz częściej nie przewijają listy linków — pytają wprost: „poleć dobrego barbera na Woli". I dostają gotową odpowiedź od AI: w odpowiedziach Google (napędzanych przez Gemini), w asystentach i nowych wyszukiwarkach. <strong>Regularnie zadajemy te pytania za Ciebie i sprawdzamy, kogo AI wskazuje w odpowiedziach</strong> — Ciebie czy konkurencję — i jak ten udział zmienia się w czasie. Dostajesz listę konkretów, które zwiększają szansę, że AI wymieni właśnie Twoją firmę. Tu nie zgadujemy: pokazujemy zapytania i odpowiedzi. <strong>Pierwsi w Polsce robimy to dla firm lokalnych.</strong></p>`
);

// Pełna lista, poz. monitoringu AI — generyczny opis
body = body.replace(
  "Czy ChatGPT i nowe wyszukiwarki polecają Ciebie, czy konkurencję — co tydzień, z trendem.",
  "Czy wyszukiwarki AI i asystenci polecają Ciebie, czy konkurencję — co tydzień, z trendem."
);

// Nagłówek sekcji porównania: bez slangu
body = body.replace(">Bez ściemy</span>", ">Uczciwie</span>");

// Plan Start — dodatkowy punkt: ceny konkurencji
body = body.replace(
  "<li>Raport o konkurencji na start</li></ul>",
  "<li>Raport o konkurencji na start</li><li>Ceny konkurencji: gdzie jesteś tańszy, a gdzie droższy</li></ul>"
);

// Pełna lista — nowa funkcja bazowa "Ceny konkurencji na oku" po poz. 02, potem renumeracja
const cap02 = `<div class="rv  in cap " style="--d: 0.05s;"><span class="cap-n">02</span><div class="cap-body"><span class="cap-name">Raport otwarcia: wywiad konkurencyjny</span><span class="cap-desc">Analiza opinii 5 najbliższych konkurentów: skargi, pochwały, luki w ofercie.</span></div><span class="cap-status cs-now">Od startu</span></div>`;
const capPrice = `<div class="rv  in cap " style="--d: 0.075s;"><span class="cap-n">03</span><div class="cap-body"><span class="cap-name">Ceny konkurencji na oku</span><span class="cap-desc">Publiczne cenniki firm wokół Ciebie w jednym miejscu: gdzie jesteś tańszy, gdzie droższy i co się zmieniło.</span></div><span class="cap-status cs-now">Od startu</span></div>`;
body = body.replace(cap02, cap02 + capPrice);
let capN = 0;
body = body.replace(/<span class="cap-n">\d+<\/span>/g, () => `<span class="cap-n">${String(++capN).padStart(2, "0")}</span>`);

// ---- 1. extract FAQ pairs (before mutating) for JSON-LD ----
const faqs = [];
const faqRe = /<button class="faq-q"[^>]*>(.*?)<span class="plus">[\s\S]*?<div class="faq-a-in">([\s\S]*?)<\/div>/g;
let m;
while ((m = faqRe.exec(body)) !== null) {
  const q = m[1].replace(/<[^>]+>/g, "").trim();
  const a = m[2].replace(/<[^>]+>/g, "").trim();
  if (q && a) faqs.push({ q, a });
}

// ---- 2. rebrand + domain ----
body = body.replace(/LocalExpert/g, "BestLocal");
body = body.replace(/kontakt@localexpert\.pl/g, "kontakt@bestlocal.pl")
           .replace(/kontakt@\{domena\}\.pl/g, "kontakt@bestlocal.pl");

// ---- 3. remove the founder section entirely (per product decision) ----
body = body.replace(/<section class="sec" id="zalozyciel"[\s\S]*?<\/section>/g, "");

// ---- 4. FAQ: start closed, drop React inline max-height ----
body = body.replace(/class="faq open"/g, 'class="faq"')
           .replace(/aria-expanded="true"/g, 'aria-expanded="false"')
           .replace(/ style="max-height: 0px;"/g, "")
           .replace(/ style="max-height: \d+px;"/g, "");

// ---- 5. replace the signup forms with Web3Forms-ready markup ----
const industries = ["Fryzjer / barber","Beauty","Gastronomia","Moto","Zdrowie","Usługi domowe","Inna"];
function formMarkup(idPrefix, source) {
  return `<form class="signup" id="${idPrefix}-form" novalidate action="https://api.web3forms.com/submit" method="POST">` +
    `<input type="hidden" name="access_key" value="1c98fbc6-fa65-49b6-bacc-823763d4fef1">` +
    `<input type="hidden" name="subject" value="Nowy zapis na listę BestLocal (${source})">` +
    `<input type="hidden" name="from_name" value="BestLocal — lista oczekujących">` +
    `<input type="hidden" name="source" value="${source}">` +
    `<div class="signup-row">` +
      `<input type="email" id="${idPrefix}-email" name="email" aria-label="Twój adres e-mail" placeholder="Twój adres e-mail" autocomplete="email" required>` +
      `<span class="mag"><button type="submit" class="btn btn-accent">Chcę wcześniejszy dostęp <span class="arr">→</span></button></span>` +
    `</div>` +
    `<input class="hp-field" type="text" name="bl_hp" tabindex="-1" autocomplete="off" aria-hidden="true">` +
    `<input class="hp-field" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">` +
    `<p class="err" role="alert" hidden></p>` +
    `<details class="signup-extra"><summary>Branża i miasto — opcjonalnie, pomożesz nam ustawić kolejność branż</summary>` +
      `<div class="signup-extra-fields">` +
        `<select name="industry" aria-label="Branża"><option value="" disabled selected>Branża</option>` +
        industries.map((i) => `<option>${i}</option>`).join("") + `</select>` +
        `<input type="text" name="city" aria-label="Miasto" placeholder="Miasto">` +
      `</div></details>` +
    `<label class="consent"><input type="checkbox" name="consent"><span>Zapisując się, zgadzam się na otrzymywanie informacji o produkcie BestLocal na podany e-mail. Administratorem danych jest <span class="ph">{PODMIOT}</span>. Mogę wypisać się w każdej chwili. <a href="/polityka-prywatnosci.html">Polityka prywatności</a></span></label>` +
    `<p class="micro">Start <strong>wkrótce</strong> · Pierwsze 100 firm: <strong>3 miesiące za pół ceny</strong> · Zero spamu — napiszemy o starcie i wynikach budowy.</p>` +
  `</form>`;
}
let formIdx = 0;
body = body.replace(/<form class="signup"[^>]*>[\s\S]*?<\/form>/g, (match) => {
  const isFinal = match.includes('id="final-email"') || formIdx > 0;
  formIdx++;
  return isFinal ? formMarkup("final", "footer_cta") : formMarkup("hero", "hero");
});

// ---- 5b. comparison table a11y: row headers + scope ----
body = body.replace(/<table class="compare">([\s\S]*?)<\/table>/, (tbl) => {
  return tbl
    // header row cells -> scope=col
    .replace(/<thead>([\s\S]*?)<\/thead>/, (th) => th.replace(/<th(?=[ >])(?![^>]*scope)/g, '<th scope="col"'))
    // first cell of each body row -> row header
    .replace(/<tr>\s*<td>/g, '<tr><th scope="row">')
    .replace(/(<th scope="row">[\s\S]*?)<\/td>/g, "$1</th>");
});

// ---- 6. founder LinkedIn placeholder link ----
body = body.replace(/<a href="#"([^>]*)>LinkedIn/g, '<a href="#stopka"$1>LinkedIn');

// ---- JSON-LD ----
const faqJson = faqs.map((f) => ({
  "@type": "Question",
  name: f.q,
  acceptedAnswer: { "@type": "Answer", text: f.a }
}));
const ld = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${DOMAIN}/#organization`, name: "BestLocal", url: `${DOMAIN}/`, logo: `${DOMAIN}/assets/icons/icon-512.png`, email: "kontakt@bestlocal.pl", description: "BestLocal prowadzi wizytówkę Google lokalnych firm: odpowiedzi na opinie, posty, pozycja w Mapach i wywiad konkurencyjny.", areaServed: "PL" },
    { "@type": "WebSite", "@id": `${DOMAIN}/#website`, name: "BestLocal", url: `${DOMAIN}/`, inLanguage: "pl-PL", publisher: { "@id": `${DOMAIN}/#organization` } },
    { "@type": "SoftwareApplication", name: "BestLocal", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: `${DOMAIN}/`, inLanguage: "pl-PL", description: "Zarządzanie wizytówką Google i lokalnym SEO za firmę: odpowiedzi na opinie, posty, zdobywanie ocen, pozycja w Mapach oraz wiedza o konkurencji.", offers: [ { "@type": "Offer", name: "Start", price: "99", priceCurrency: "PLN", availability: "https://schema.org/PreOrder" }, { "@type": "Offer", name: "Pro", price: "199", priceCurrency: "PLN", availability: "https://schema.org/PreOrder" } ] },
    { "@type": "FAQPage", mainEntity: faqJson }
  ]
};

const head = `<!DOCTYPE html>
<html lang="pl" data-type="serif">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

<!-- =======================================================================
     PRZED PUBLIKACJĄ podmień w razie potrzeby:
       • {PODMIOT} → administrator danych (firma/osoba) — w zgodzie formularza i stopce
       • Klucz Web3Forms jest już ustawiony w formularzach. NIE zmieniaj sentinela
         "YOUR_WEB3FORMS_ACCESS_KEY" w public/js/landing.js (to przełącznik trybu demo).
     ======================================================================= -->

<title>Wizytówka Google zadbana za Ciebie — opinie, posty, Mapy | BestLocal</title>
<meta name="description" content="BestLocal prowadzi Twoją wizytówkę Google za Ciebie: gotowe odpowiedzi na opinie, posty, wyższa pozycja w Mapach, wywiad konkurencyjny i widoczność w AI. 15 minut tygodniowo. Dołącz do listy oczekujących." />
<link rel="canonical" href="${DOMAIN}/" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<meta name="theme-color" content="#16301F" />
<meta name="author" content="BestLocal" />
<meta name="format-detection" content="telephone=no" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="BestLocal" />
<meta property="og:locale" content="pl_PL" />
<meta property="og:title" content="Wizytówka Google zadbana za Ciebie — BestLocal" />
<meta property="og:description" content="Opinie, posty, pozycja w Mapach Google, wywiad konkurencyjny i widoczność w AI — Ty tylko akceptujesz z telefonu. 15 minut tygodniowo." />
<meta property="og:url" content="${DOMAIN}/" />
<meta property="og:image" content="${DOMAIN}/assets/img/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="BestLocal — Twoja wizytówka Google zadbana za Ciebie." />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Wizytówka Google zadbana za Ciebie — BestLocal" />
<meta name="twitter:description" content="Opinie, posty i pozycja w Mapach Google — Ty tylko akceptujesz z telefonu. Wywiad konkurencyjny i widoczność w AI w cenie." />
<meta name="twitter:image" content="${DOMAIN}/assets/img/og-image.jpg" />

<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />

<link rel="preload" as="font" type="font/woff2" href="/fonts/schibsted-grotesk-latin-normal-7.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/fonts/schibsted-grotesk-latin-ext-normal-6.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/fonts/schibsted-grotesk-latin-italic-5.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/fonts/schibsted-grotesk-latin-ext-italic-4.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/fonts/manrope-latin-normal-7.woff2" crossorigin />

<link rel="stylesheet" href="/fonts/fonts.css" />
<link rel="stylesheet" href="/css/styles.css" />
<link rel="stylesheet" href="/css/v3.css" />
<link rel="stylesheet" href="/css/extra.css" />

<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
</head>
<body>
<a class="skip-link" href="#top">Przejdź do treści</a>
<div id="root">`;

const tail = `</div>
<script src="/js/landing.js" defer></script>
</body>
</html>
`;

await writeFile("index.template.html", head + body + tail);
console.log(`✓ index.template.html built — ${faqs.length} FAQ entries, ${formIdx} forms rebuilt`);
