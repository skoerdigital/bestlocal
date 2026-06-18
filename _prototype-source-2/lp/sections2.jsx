// LocalExpert LP — sections part 2: features (5 blocks), audience, compare, pricing

const FEATURES = [
  {
    h: 'Opinie zaopiekowane: odpowiedzi i zdobywanie nowych',
    body: <React.Fragment>Na każdą nową opinię — pochwałę i krytykę — dostajesz gotową, kulturalną odpowiedź napisaną poprawną polszczyzną, w tonie Twojej firmy. <strong>Akceptujesz lub poprawiasz jednym dotknięciem.</strong> Do tego zdobywamy nowe opinie: kod QR przy kasie, link do wysłania klientowi po wizycie, gotowe podziękowania. Zgodnie z zasadami Google — żadnego kupowania ani filtrowania ocen.</React.Fragment>,
    ex: 'Przykład: klientka chwali koloryzację, ale wytyka 20 minut spóźnienia. Proponowana odpowiedź dziękuje, odnosi się do spóźnienia i zaprasza ponownie — Ty tylko klikasz „Akceptuję".',
    demo: () => <ReviewDemo />,
  },
  {
    h: 'Wizytówka zawsze aktualna i aktywna',
    body: <React.Fragment>Pilnujemy kompletności profilu: godziny (także świąteczne), usługi, zdjęcia, opis. Przygotowujemy 2–4 posty miesięcznie powiązane z tym, czego klienci w Twojej branży naprawdę szukają. <strong>Profil, który żyje, Google pokazuje chętniej</strong> — a klient widzi firmę, która działa.</React.Fragment>,
    ex: 'Przykład: przed majówką dostajesz do akceptacji aktualizację godzin i post o dostępnych terminach.',
    demo: () => <ProfileDemo />,
  },
  {
    h: 'Wiesz, na co narzekają klienci konkurencji',
    body: <React.Fragment>Czytamy za Ciebie publiczne opinie Twoich konkurentów i wyciągamy z nich konkrety: co klienci chwalą, na co się skarżą, czego szukają i nie znajdują. <strong>Każde takie odkrycie zamieniamy w propozycję działania dla Ciebie.</strong> Do tego — tam, gdzie to możliwe — porównanie cen z publicznych cenników i godziny największego ruchu w okolicy.</React.Fragment>,
    ex: 'Przykład: u trzech pobliskich warsztatów klienci powtarzają, że „nie da się dodzwonić". Masz rezerwacje online? Dostajesz gotowy post, który robi z tego Twoją przewagę.',
    demo: () => <InsightDemo />,
  },
  {
    h: 'Pilnujemy nieuczciwej konkurencji w Mapach',
    body: <React.Fragment>Część firm oszukuje: dopisuje do nazwy wizytówki frazy typu „Mechanik Warszawa Tanio 24h", żeby sztucznie wskoczyć wyżej. To łamie zasady Google, ale ktoś musi to zgłosić. <strong>Wykrywamy takie wizytówki w Twojej okolicy, zbieramy dowody i przygotowujemy gotowe zgłoszenie</strong> — po usunięciu naciągacza Twoja pozycja rośnie.</React.Fragment>,
    ex: 'Przykład: „Salon Beauty Anna | Manicure Hybrydowy Paznokcie Mokotów Tanio" — nazwa na szyldzie: „Salon Anna". Zgłoszenie gotowe do wysłania w 2 minuty.',
    demo: () => <FakeDemo />,
  },
  {
    h: 'Widoczność w AI: czy ChatGPT poleca Ciebie, czy konkurencję?',
    body: <React.Fragment>Coraz więcej osób zamiast w Google szuka w ChatGPT i podobnych: „poleć dobrego barbera na Woli". <strong>Regularnie zadajemy te pytania za Ciebie i sprawdzamy, kto pada w odpowiedziach</strong> — Ty czy konkurencja — i jak ten udział zmienia się w czasie. Dostajesz listę konkretów, które zwiększają szansę, że AI wymieni właśnie Twoją firmę. Tu nie zgadujemy: pokazujemy zapytania i odpowiedzi. <strong>Pierwsi w Polsce robimy to dla firm lokalnych.</strong></React.Fragment>,
    ex: 'Przykład: na 10 zapytań o Twoją kategorię w Twoim mieście konkurent X pada w 6 odpowiedziach, Ty w 1. Za miesiąc sprawdzamy znowu — i widzisz trend.',
    demo: () => <AIDemo />,
  },
];

function Features() {
  return (
    <section className="sec" id="funkcje" data-screen-label="Co dostajesz" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" className="label">Produkt</Reveal>
          <Reveal as="h2" className="display h2" delay={0.1}>Co dostajesz</Reveal>
          <Reveal as="p" className="lead" delay={0.2}>
            Pięć rzeczy, które robimy za Ciebie co tydzień. Każdą możesz wypróbować poniżej — klikaj śmiało.
          </Reveal>
        </div>
        {FEATURES.map((f, i) => (
          <div className="feature" key={i}>
            <div className="feature-copy">
              <Reveal>
                <span className="feature-n">{String(i + 1).padStart(2, '0')} / 05</span>
                <h3>{f.h}</h3>
                <p className="body">{f.body}</p>
                <p className="example">{f.ex}</p>
              </Reveal>
            </div>
            <Reveal scale={true} delay={0.15}>
              {f.demo()}
            </Reveal>
          </div>
        ))}
        <div className="allin">
          <Reveal as="p" className="big">
            Wszystko w jednym miejscu, wszystko <em>za Twoją zgodą</em>, wszystko po polsku.
          </Reveal>
          <Reveal delay={0.15}>
            <Magnetic><a className="btn btn-accent" href="#zapis">Chcę wcześniejszy dostęp <span className="arr">→</span></a></Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Audience */
const AUDIENCES = [
  { i: '✂️', t: 'Fryzjerzy i barberzy', d: 'Odpowiedzi na opinie i posty o wolnych terminach — bez odrywania się od fotela.' },
  { i: '💅', t: 'Salony beauty', d: 'Więcej opinii z QR przy kasie i pilnowanie naciągaczy z „Tanio" w nazwie.' },
  { i: '🍽️', t: 'Restauracje i kawiarnie', d: 'Godziny świąteczne zawsze aktualne, kulturalna odpowiedź na każdą recenzję.' },
  { i: '🔧', t: 'Warsztaty samochodowe', d: 'Wiesz, że u konkurencji „nie da się dodzwonić" — i robisz z tego przewagę.' },
  { i: '🩺', t: 'Gabinety', d: 'Fizjoterapia, stomatologia, weterynarz — zaufanie buduje się w opiniach.' },
  { i: '🔌', t: 'Usługi domowe', d: 'Hydraulik czy elektryk z 80 opiniami wygrywa telefon, zanim zadzwoni klient.' },
];

function Audience() {
  return (
    <section className="sec sec-dark" id="dla-kogo" data-screen-label="Dla kogo">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" className="label">Dla kogo</Reveal>
          <Reveal as="h2" className="display h2" delay={0.1}>Dla kogo to jest</Reveal>
        </div>
        <div className="aud-grid">
          {AUDIENCES.map((a, i) => (
            <Reveal key={i} delay={(i % 3) * 0.1} className="aud">
              <span className="aud-icon" aria-hidden="true">{a.i}</span>
              <h3>{a.t}</h3>
              <p>{a.d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" className="honest" delay={0.2}>
          Uczciwie: <strong>jeśli Twoi klienci znajdują Cię przez Google lub polecenia — to jest dla Ciebie.</strong> Jeśli prowadzisz sklep internetowy bez lokalu i klientów z okolicy — to (jeszcze) nie dla Ciebie.
        </Reveal>
      </div>
    </section>
  );
}

/* Compare table */
function Compare() {
  return (
    <section className="sec" id="porownanie" data-screen-label="Porównanie">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" className="label">Bez ściemy</Reveal>
          <Reveal as="h2" className="display h2" delay={0.1}>Ile to kosztuje — i z czym porównać</Reveal>
        </div>
        <Reveal scale={true}>
          <div className="compare-scroll">
            <table className="compare">
              <thead>
                <tr>
                  <th></th>
                  <th>Agencja / freelancer</th>
                  <th>Samemu</th>
                  <th className="col-us">LocalExpert</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Koszt</td>
                  <td>500–1500 zł/mc</td>
                  <td>0 zł</td>
                  <td className="col-us">od 99 zł/mc</td>
                </tr>
                <tr>
                  <td>Twój czas</td>
                  <td>umowy, raporty, pilnowanie</td>
                  <td>4–6 h/mc (jeśli systematycznie)</td>
                  <td className="col-us">~15 min/tydz.</td>
                </tr>
                <tr>
                  <td>Co widzisz</td>
                  <td>raport raz na miesiąc</td>
                  <td>wszystko, jeśli wiesz gdzie</td>
                  <td className="col-us">każde działanie akceptujesz, każdy wniosek ma źródło</td>
                </tr>
                <tr>
                  <td>Wiedza o konkurencji</td>
                  <td>rzadko</td>
                  <td>brak</td>
                  <td className="col-us">skargi klientów, ceny, godziny ruchu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal as="p" className="compare-note" delay={0.15}>
          Dobra agencja robi więcej (strona, reklamy, strategia) — i słusznie kosztuje. My robimy systematyczną pracę przy wizytówce, opiniach i konkurencji, której nikt nie ma czasu robić ręcznie.
        </Reveal>
      </div>
    </section>
  );
}

/* Pricing */
function Pricing() {
  return (
    <section className="sec" id="cennik" data-screen-label="Cennik" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" className="label">Proste ceny</Reveal>
          <Reveal as="h2" className="display h2" delay={0.1}>Dwa plany. Zero gwiazdek.</Reveal>
        </div>
        <div className="plans">
          <Reveal className="plan">
            <span className="plan-name">Start</span>
            <div className="plan-price"><Ticker to={99} /> zł <span className="per">/ mc</span></div>
            <p className="plan-desc">Zadbana wizytówka i rosnące opinie — minimum, które robi różnicę.</p>
            <ul>
              <li>Zadbana wizytówka: odpowiedzi, posty, poprawki</li>
              <li>Zdobywanie opinii: kod QR, linki dla klientów</li>
              <li>Tygodniowe podsumowanie po ludzku</li>
              <li>Raport o konkurencji na start</li>
            </ul>
            <Magnetic><a className="btn" href="#zapis">Zapisz się <span className="arr">→</span></a></Magnetic>
          </Reveal>
          <Reveal className="plan plan-pro" delay={0.12}>
            <span className="plan-name">Pro <span className="plan-badge">pełna przewaga</span></span>
            <div className="plan-price"><Ticker to={199} /> zł <span className="per">/ mc</span></div>
            <p className="plan-desc">Wszystko ze Start + stały wywiad konkurencyjny i pilnowanie Map.</p>
            <ul>
              <li>Stały wywiad: skargi, ceny, godziny ruchu, alerty</li>
              <li>Pilnowanie nieuczciwych wizytówek w okolicy</li>
              <li>Sprawdzanie poleceń w nowych wyszukiwarkach</li>
              <li>SMS-y z prośbą o opinię do Twoich klientów</li>
            </ul>
            <Magnetic><a className="btn btn-accent" href="#zapis">Zapisz się <span className="arr">→</span></a></Magnetic>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="pricing-notes">
            <span>Ceny netto</span><span>Faktura VAT</span><span>Karta lub BLIK</span><span>Anulujesz kiedy chcesz</span>
          </div>
          <span className="pricing-offer">Pierwsze 100 firm z tej listy: 3 miesiące za pół ceny + wpływ na kolejność funkcji</span>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { Features, Audience, Compare, Pricing });
