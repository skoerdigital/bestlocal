# BestLocal — landing page (v2 „Gaja”)

Statyczny, mocno zoptymalizowany landing page (PL) dla platformy do lokalnego SEO
i zarządzania wizytówką Google. Wariant **v2** — edytorski, kremowo-zielony, serif,
z **pełną listą funkcji platformy**. Serwowany przez minimalny serwer Node bez
zależności runtime — gotowy do deployu na **Railway**.

**Lighthouse (produkcyjny build):** Desktop **100 / 100 / 100 / 100**,
Mobile **98 / 100 / 100 / 100** (Performance / Accessibility / Best Practices / SEO), **CLS 0**.

Powstał z prototypu React (`_prototype-source-2/`, „LocalExpert v3”) przez
prerender do statycznego HTML + ten sam proces produkcyjny co poprzednia wersja.
Poprzedni build (wariant v1) jest zarchiwizowany w `_build-v1/`.

---

## Szybki start (lokalnie)

```bash
npm install        # sharp + puppeteer-core (tylko build), 0 zależności runtime
npm start          # serwer na http://localhost:8080
```

`public/` jest już zbudowane i wersjonowane w repo, więc do uruchomienia wystarczy
`npm start`.

### Rebuild

```bash
npm run build        # ikony + OG + inline CSS + hash JS (po zmianie CSS/JS/ikon)
npm run build:html   # tylko: inline CSS + hash JS (po edycji index.template.html lub css/)
npm run build:all    # pełna regeneracja z prototypu Reactowego:
                     #   prerender → template → icons → html
```

> `build:all` (a konkretnie `build:prerender`) uruchamia headless Chrome i renderuje
> prototyp z `_prototype-source-2/` do `scripts/.v3-root.html`. Potrzebny zainstalowany
> Google Chrome. Potrzebne tylko, gdy zmieniasz prototyp źródłowy.

---

## Deploy na Railway

1. Repo → GitHub → Railway: **New Project → Deploy from GitHub repo**.
2. Railway wykryje `railway.json` / `nixpacks.toml`:
   - build: `npm install --omit=dev` (pomija `sharp`/`puppeteer-core` — runtime ich nie potrzebuje),
   - start: `node server.js` (nasłuchuje na `PORT` z Railway).
3. Podepnij domenę w **Settings → Networking → Custom Domain**.

`server.js` (0 zależności) obsługuje: Brotli/gzip, nagłówki cache (immutable dla
`/assets`, `/fonts`, `/js`; `no-cache` dla HTML), nagłówki bezpieczeństwa + CSP
(z `connect-src`/`form-action` na Web3Forms), czyste URL-e (`/regulamin`) i stronę 404.

---

## ⚙️ Do uzupełnienia PRZED publikacją

| Co | Gdzie | Domyślnie |
|----|-------|-----------|
| **Klucz formularza** (Web3Forms) | `name="access_key"` w `index.template.html` (2×) → potem `npm run build:html` | `YOUR_WEB3FORMS_ACCESS_KEY` |
| **Domena** | `index.template.html`, `public/sitemap.xml`, `public/robots.txt` | `https://bestlocal.pl` |
| **Administrator danych / założyciel** | `{PODMIOT}`, `{Imię i nazwisko}`, `{BLOK_ZALOZYCIELA}` w `index.template.html` | placeholdery |
| **Zdjęcie założyciela** | sekcja „Kto za tym stoi” — placeholder `.founder-photo-ph`; wstaw `<img>` | placeholder |
| **Treści prawne** | `public/polityka-prywatnosci.html`, `public/regulamin.html` | szkielet RODO |

### Formularz zapisu (Web3Forms)

1. Załóż darmowy klucz na <https://web3forms.com>.
2. Wklej go w oba pola `access_key` w `index.template.html`, uruchom `npm run build:html`.
3. Dopóki klucz to `YOUR_WEB3FORMS_ACCESS_KEY`, formularz działa w **trybie demo**
   (bez wysyłki — od razu przekierowuje na `/dziekujemy.html`).

---

## Struktura

```
public/                      # ← serwowany statyczny site
  index.html                 # generowany z index.template.html (CSS inline + hashed JS)
  dziekujemy.html            # podziękowanie + mikroankieta (noindex)
  polityka-prywatnosci.html, regulamin.html, 404.html
  css/{styles,v3,extra}.css  # źródła stylów (inline'owane do index.html)
  js/landing.js              # źródło; build tworzy landing.<hash>.js
  fonts/                     # self-hosted woff2 (Source Serif 4 + Manrope + IBM Plex Mono)
  assets/icons/, assets/img/og-image.jpg, favicon.*, robots.txt, sitemap.xml, site.webmanifest

index.template.html          # ŹRÓDŁO strony głównej (edytuj tu → build:html)
server.js                    # zero-dependency serwer (Brotli/gzip, cache, CSP)
scripts/                     # prerender-v2 / build-template-v2 / build-icons / build-html
_prototype-source-2/         # oryginalny prototyp React „LocalExpert v3” (źródło, nie serwowane)
_build-v1/                   # poprzedni wariant (archiwum)
railway.json, nixpacks.toml, Procfile, .nvmrc
```

## Co zostało zrobione względem prototypu

- **Prerender** React→statyczny HTML (puppeteer): identyczna treść i układ, zero
  React/Babel w produkcji. Usunięto panel „tweaks”, `image-slot`, warianty hero.
- **Rebranding** LocalExpert → BestLocal w całym serwisie.
- **Self-hosting fontów** (woff2, latin + latin-ext dla polskich znaków); display
  z `font-display: optional` + preload → zero CLS z powodu wymiany fontu.
- **Dostępność do WCAG AA 4.5:1** (Lighthouse A11y 100): przyciemniony zielony
  akcent na jasnych tłach (jasny na ciemnych), podbite stłumione teksty, nagłówki
  tabeli porównania, etykiety pól, focus, skip-link.
- **Naprawione błędy RWD**: overflow hero na mobile (flex/grid `min-width: 0`),
  stackowanie formularza, brak poziomego scrolla.
- **SEO**: title/description, jedno `<h1>`, dane strukturalne JSON-LD (Organization,
  WebSite, SoftwareApplication, **FAQPage**), OG/Twitter, sitemap, robots, manifest.
- **Formularz** zapisu (Web3Forms, AJAX, honeypot + zgoda RODO).
- **Wydajność**: CSS wbudowany inline i zminifikowany (zero render-blocking),
  `landing.js` wersjonowany hashem, Brotli/gzip + długi cache z poziomu serwera.
