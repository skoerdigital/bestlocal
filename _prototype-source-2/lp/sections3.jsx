// LocalExpert LP — sections part 3: founder, FAQ, final CTA, footer

function Founder() {
  return (
    <section className="sec" id="zalozyciel" data-screen-label="Kto za tym stoi" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" className="label">Zaufanie</Reveal>
          <Reveal as="h2" className="display h2" delay={0.1}>Kto za tym stoi</Reveal>
        </div>
        <Reveal className="founder">
          <image-slot id="founder-photo" shape="circle" style={{ width: '180px', height: '180px' }} placeholder="Zdjęcie założyciela"></image-slot>
          <div>
            <p className="founder-quote">
              „Buduję LocalExpert, bo mali przedsiębiorcy przegrywają w Google nie przez brak jakości, tylko przez brak czasu. {'{BLOK_ZALOZYCIELA}'} — tu wstaw 2–3 zdania o doświadczeniu i motywacji."
            </p>
            <div className="founder-sig">
              <strong>{'{Imię i nazwisko}'}</strong>
              założyciel LocalExpert · <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn ↗</a><br></br>
              {'{Nazwa firmy}'} · kontakt@{'{domena}'}.pl
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const FAQS = [
  ['Czy to kolejne „narzędzie AI"?', 'Nie w tym sensie, w jakim się tego obawiasz. Nie ma czatu, nie ma generatora tekstów, nie musisz niczego „promptować". System wykonuje konkretną pracę na prawdziwych danych — Twoje opinie, Twój profil, publiczne informacje o konkurencji — a każdy tekst czytasz i akceptujesz Ty. Tak, do pisania używamy modeli językowych. Ale to hydraulika, nie produkt.'],
  ['Nie znam się na pozycjonowaniu. Dam radę?', 'Tak, bo niczego nie konfigurujesz. Wpisujesz nazwę firmy, a potem tylko akceptujesz albo odrzucasz gotowe propozycje. Wszystko jest po polsku i po ludzku.'],
  ['Ile czasu mi to zajmie?', 'Około 15 minut tygodniowo: przejrzeć propozycje, kliknąć „Akceptuję", przeczytać podsumowanie.'],
  ['Skąd wiecie, na co narzekają klienci mojej konkurencji?', 'Z publicznie dostępnych opinii w internecie. Czytamy je hurtowo i wyciągamy powtarzające się wątki. Przy każdym wniosku pokazujemy źródło — możesz sprawdzić każdy cytat.'],
  ['Czy publikujecie coś bez mojej wiedzy?', 'Nie. Domyślnie nic nie wychodzi bez Twojego kliknięcia. Jeśli kiedyś dodamy tryb automatyczny, będzie wyłącznie na Twoje wyraźne życzenie.'],
  ['Czy to zastąpi agencję?', 'Jeśli agencja prowadzi Ci reklamy, stronę i strategię — nie, i nie udajemy, że tak. Zastępujemy systematyczną, żmudną pracę przy wizytówce, opiniach i obserwowaniu konkurencji. Wielu firmom to wystarcza.'],
  ['Co z moimi danymi i RODO?', 'Dane trzymamy na serwerach w Unii Europejskiej. Zbieramy tylko to, co potrzebne do działania usługi. W każdej chwili możesz poprosić o wgląd lub usunięcie. Szczegóły w polityce prywatności.'],
  ['Kiedy start i co dostaję za zapis?', 'Planowany start: jesień 2026. Zapisani dostają: wcześniejszy dostęp, 3 miesiące za pół ceny (pierwsze 100 firm) i wpływ na kolejność funkcji. Piszemy rzadko: o postępach i starcie. Żadnego spamu, wypisujesz się jednym kliknięciem.'],
  ['Czy działa dla mojej branży?', 'Budujemy dla firm lokalnych: beauty, gastro, moto, zdrowie, usługi domowe i podobne. Jeśli masz wątpliwości — zapisz się i odpowiedz na pytanie o branżę, wprost powiemy, czy to dla Ciebie.'],
];

function FaqItem({ q, a, open, onToggle }) {
  const bodyRef = React.useRef(null);
  return (
    <div className={`faq ${open ? 'open' : ''}`}>
      <button className="faq-q" onClick={onToggle} aria-expanded={open}>
        {q}
        <span className="plus">+</span>
      </button>
      <div className="faq-a" ref={bodyRef} style={{ maxHeight: open && bodyRef.current ? bodyRef.current.scrollHeight + 'px' : 0 }}>
        <div className="faq-a-in">{a}</div>
      </div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="sec" id="faq" data-screen-label="FAQ" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" className="label">Wątpliwości</Reveal>
          <Reveal as="h2" className="display h2" delay={0.1}>Pytania i odpowiedzi</Reveal>
        </div>
        <div className="faq-list">
          {FAQS.map(([q, a], i) => (
            <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
              <FaqItem q={q} a={a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="sec sec-dark final" id="final" data-screen-label="CTA końcowe">
      <div className="wrap">
        <Reveal as="span" className="label" style={{ justifyContent: 'center' }}>Ostatni krok</Reveal>
        <Reveal as="h2" className="display" delay={0.1}>
          Wyprzedź konkurencję, <em>zanim ona wyprzedzi Ciebie.</em>
        </Reveal>
        <Reveal as="p" className="lead" delay={0.2} style={{ maxWidth: '52ch' }}>
          Zostaw e-mail — odezwiemy się, gdy będzie co pokazać. Pierwsze 100 firm zaczyna za pół ceny.
        </Reveal>
        <Reveal delay={0.3} style={{ display: 'flex', justifyContent: 'center' }}>
          <SignupForm compact={true} idPrefix="final" />
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <a className="logo" href="#top" style={{ fontSize: 17, color: 'var(--bone)' }}>
          <span className="logo-dot"></span>
          LocalExpert
        </a>
        <nav className="flinks" aria-label="Stopka">
          <a href="#" onClick={(e) => e.preventDefault()}>Polityka prywatności</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Regulamin listy oczekujących</a>
          <a href="mailto:kontakt@localexpert.pl">kontakt@{'{domena}'}.pl</a>
          <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn ↗</a>
        </nav>
        <span className="admin">Administrator danych: {'{PODMIOT}'} · © 2026 LocalExpert. Bez ciasteczek reklamowych — dlatego nie męczy Cię żaden baner.</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Founder, Faq, FinalCta, Footer });
