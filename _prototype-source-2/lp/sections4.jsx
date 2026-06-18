// LocalExpert LP — sections part 4: full capabilities index ("Pełna lista")
// Spec-sheet style: numbered mono rows, status chips (Start / Wkrótce / Plany)

const CAPS = [
  // MVP — od startu
  { n: 'Audyt z kolejką działań', d: 'Audyt nie jest PDF-em — od razu zasila kolejkę gotowych działań do akceptacji.', s: 0 },
  { n: 'Raport otwarcia: wywiad konkurencyjny', d: 'Analiza opinii 5 najbliższych konkurentów: skargi, pochwały, luki w ofercie.', s: 0 },
  { n: 'Gotowe odpowiedzi na opinie', d: 'Każda nowa opinia dostaje propozycję odpowiedzi. Ty klikasz „Akceptuję".', s: 0 },
  { n: 'Zbieranie opinii: QR + link + e-mail', d: 'Systematyczne proszenie o opinie — zgodnie z zasadami Google.', s: 0 },
  { n: 'Posty na autopilocie', d: '2–4 posty miesięcznie, podpięte pod wnioski z wywiadu konkurencyjnego.', s: 0 },
  { n: 'Pozycja w Mapach: mapa dzielnic', d: 'Gdzie Cię widać, a gdzie nie — sprawdzane co tydzień, pokazane na siatce.', s: 0 },
  { n: 'Miesięczny raport „Twój miesiąc w Google"', d: 'Co urosło, co zrobiliśmy, co znaleźliśmy. Po ludzku, nie po marketingowemu.', s: 0 },
  // F2 — wkrótce po starcie
  { n: 'Monitoring poleceń w AI', d: 'Czy ChatGPT i nowe wyszukiwarki polecają Ciebie, czy konkurencję — co tydzień, z trendem.', s: 1, hot: true },
  { n: 'Wywiad konkurencyjny: monitoring ciągły', d: 'Alerty: nowy konkurent, skok skarg, zmiany cen, godziny szczytu w okolicy.', s: 1 },
  { n: 'Pilnowanie nieuczciwych wizytówek', d: 'Wykrywanie naciągaczy w Mapach + gotowe zgłoszenia z dowodami.', s: 1 },
  { n: 'Wzmianki lokalne: fora i grupy', d: '„Polecicie kogoś?" w Twojej okolicy — alert + szkic odpowiedzi do wklejenia.', s: 1 },
  { n: 'Opinie spoza Google', d: 'Facebook, GoWork, ZnanyLekarz, Booksy, TripAdvisor — w jednym miejscu.', s: 1 },
  { n: 'SMS-y z prośbą o opinię', d: 'Po wizycie klient dostaje SMS z linkiem — najkrótsza droga do nowej oceny.', s: 1 },
  { n: 'Spójność danych: katalogi PL', d: 'Te same dane firmy w ~30–50 polskich katalogach — sprawdzane i budowane.', s: 1 },
  { n: 'Audyt strony WWW', d: 'Czy strona zgadza się z wizytówką + dane dla wyszukiwarek (schema).', s: 1 },
  // F3 — dalej
  { n: 'Pakiety branżowe', d: 'Szablony postów, odpowiedzi i fraz skrojone pod beauty, moto, gastro…', s: 2 },
  { n: 'Plan agencyjny i wiele lokalizacji', d: 'Dla firm z kilkoma punktami i dla agencji obsługujących lokalne biznesy.', s: 2 },
];

const CAP_STATUS = [
  { t: 'Od startu', cls: 'cs-now' },
  { t: 'Wkrótce', cls: 'cs-soon' },
  { t: 'W planach', cls: 'cs-later' },
];

function CapRow({ cap, index }) {
  const st = CAP_STATUS[cap.s];
  return (
    <Reveal as="div" delay={Math.min((index % 6) * 0.05, 0.3)} className={`cap ${cap.hot ? 'cap-hot' : ''}`}>
      <span className="cap-n">{String(index + 1).padStart(2, '0')}</span>
      <div className="cap-body">
        <span className="cap-name">{cap.n}{cap.hot ? <span className="cap-flame" title="Pierwsi w Polsce"> ✳ pierwsi w PL</span> : null}</span>
        <span className="cap-desc">{cap.d}</span>
      </div>
      <span className={`cap-status ${st.cls}`}>{st.t}</span>
    </Reveal>
  );
}

function FullList() {
  return (
    <section className="sec" id="lista" data-screen-label="Pełna lista funkcji">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" className="label">Spec sheet</Reveal>
          <Reveal as="h2" className="display h2" delay={0.1}>Pełna lista — co robi platforma</Reveal>
          <Reveal as="p" className="lead" delay={0.2}>
            Wyżej pokazaliśmy pięć rzeczy w działaniu. Tu jest cała mapa — łącznie z tym, co dopiero budujemy. Zapisani na listę głosują nad kolejnością.
          </Reveal>
        </div>
        <div className="cap-list">
          {CAPS.map((c, i) => <CapRow key={i} cap={c} index={i} />)}
        </div>
        <Reveal as="p" className="cap-note" delay={0.1}>
          Status na czerwiec 2026. „Wkrótce" = pierwsze miesiące po starcie. Kolejność w dużej mierze ustawiają odpowiedzi z ankiety po zapisie.
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { FullList });
