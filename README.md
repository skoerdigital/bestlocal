# BestLocal — landing page

Statyczny, mocno zoptymalizowany landing page (PL) dla platformy do lokalnego SEO
i zarządzania wizytówką Google. Serwowany przez minimalny serwer Node bez zależności
runtime — gotowy do deployu na **Railway**.

Lighthouse (produkcyjny build): **Desktop 100/100/100/100**, **Mobile ~98 / 100 / 100 / 100**
(Performance / Accessibility / Best Practices / SEO), CLS 0.

---

## Szybki start (lokalnie)

```bash
npm install        # instaluje sharp (tylko do builda obrazków/ikon)
npm run build      # generuje obrazki (AVIF/WebP/JPEG), ikony, OG i wbudowuje CSS
npm start          # serwer na http://localhost:8080
```

> Pliki w `public/` są już zbudowane i wersjonowane w repo, więc do samego
> uruchomienia wystarczy `npm start` (build potrzebny tylko po zmianie obrazków,
> ikon lub szablonu/CSS).

---

## Deploy na Railway

1. Wypchnij repo do GitHub i w Railway → **New Project → Deploy from GitHub repo**.
2. Railway wykryje `railway.json` / `nixpacks.toml`:
   - build: `npm install --omit=dev` (pomija `sharp` — runtime go nie potrzebuje),
   - start: `node server.js` (nasłuchuje na `PORT` ustawianym przez Railway).
3. Po deployu podepnij domenę w zakładce **Settings → Networking → Custom Domain**.

Serwer (`server.js`) ma 0 zależności i sam obsługuje: Brotli/gzip, nagłówki cache
(immutable dla `/assets`, `/fonts`, `/js`; `no-cache` dla HTML), nagłówki
bezpieczeństwa + CSP, czyste URL-e (`/regulamin`) i stronę 404.

---

## ⚙️ Do uzupełnienia PRZED publikacją

| Co | Gdzie | Domyślnie |
|----|-------|-----------|
| **Klucz formularza** (Web3Forms) | `input[name="access_key"]` w `index.template.html` (2×) | `YOUR_WEB3FORMS_ACCESS_KEY` |
| **Domena** (canonical, OG, JSON-LD, sitemap, robots) | `index.template.html`, `public/sitemap.xml`, `public/robots.txt` | `https://bestlocal.pl` |
| **Administrator danych** | `{PODMIOT}` w `index.template.html` i stronach prawnych | placeholder |
| **Treści prawne** | `public/polityka-prywatnosci.html`, `public/regulamin.html` | szkielet RODO do uzupełnienia |
| **E-mail kontaktowy** | `kontakt@bestlocal.pl` | placeholder |

Po zmianie `index.template.html` lub plików CSS uruchom `npm run build:html`,
żeby przebudować `public/index.html` (CSS jest wbudowany inline, a `landing.js`
dostaje hash w nazwie do cache'owania).

### Formularz zapisu (Web3Forms)

1. Załóż darmowy klucz na <https://web3forms.com> (podpinasz swój e-mail odbiorczy).
2. Wklej klucz w `index.template.html` w oba pola `access_key` i uruchom `npm run build:html`.
3. Dopóki klucz to `YOUR_WEB3FORMS_ACCESS_KEY`, formularz działa w **trybie demo**
   (bez realnej wysyłki — od razu przekierowuje na `dziekujemy.html`).

---

## Struktura

```
public/                      # ← to serwuje serwer (cały statyczny site)
  index.html                 # generowany z index.template.html (CSS inline + hashed JS)
  dziekujemy.html            # strona podziękowania + mikroankieta (noindex)
  polityka-prywatnosci.html  # szkielet prawny (noindex)
  regulamin.html             # szkielet prawny (noindex)
  404.html
  css/{base,sections}.css    # źródło stylów (inline'owane do index.html; używane przez podstrony)
  js/landing.js              # źródło; build tworzy landing.<hash>.js
  fonts/                     # self-hosted woff2 (latin + latin-ext) + fonts.css
  assets/img/                # AVIF/WebP/JPEG (srcset) + og-image.jpg
  assets/icons/              # favicony, apple-touch, ikony PWA (maskable)
  favicon.svg, favicon.ico, robots.txt, sitemap.xml, site.webmanifest

index.template.html          # ŹRÓDŁO strony głównej (edytuj tu, potem build:html)
server.js                    # zero-dependency serwer (Brotli/gzip, cache, CSP)
scripts/                     # build-images / build-icons / build-html
src-assets/                  # oryginalne zdjęcia źródłowe (do ponownego builda)
_prototype-source/           # oryginalny prototyp (referencja, NIE serwowane)
railway.json, nixpacks.toml, Procfile, .nvmrc
```

## Co zostało zrobione względem prototypu

- Usunięto kod deweloperski: panel „tweaks” (React/Babel z CDN), `image-slot`,
  warianty A/B/C — produkcja używa wariantu A.
- Self-hostowane fonty (woff2, latin-ext dla polskich znaków) zamiast Google Fonts.
- Zdjęcia z Unsplash pobrane i zoptymalizowane lokalnie (AVIF/WebP/JPEG + `srcset`,
  `width/height`, `loading=lazy`, hero z `preload` + `fetchpriority=high`).
- Pełny zestaw meta: Open Graph, Twitter Card, JSON-LD (Organization, WebSite,
  SoftwareApplication, **FAQPage**), favicony, manifest PWA, sitemap, robots.
- Eksperckie poprawki SEO (title/description, jedno `<h1>`, hierarchia nagłówków,
  alty, dane strukturalne pod rich results).
- Poprawki wizualne/RWD: zawijanie długich nagłówków na tabletach, dostępność
  (kontrast, kolejność nagłówków, focus, skip-link, etykiety pól).
- Formularz zapisu na listę oczekujących (Web3Forms, AJAX, honeypot + zgoda RODO).
- CSS wbudowany inline (zero render-blocking), CSS/JS minifikowane przez kompresję
  serwera; `landing.js` wersjonowany hashem.
# bestlocal
