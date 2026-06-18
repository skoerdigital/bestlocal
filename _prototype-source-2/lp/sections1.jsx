// LocalExpert LP — sections part 1: header, hero, problem, how-it-works

/* Scroll progress bar + header chrome */
function HeaderBar() {
  const [scrolled, setScrolled] = React.useState(false);
  const barRef = React.useRef(null);
  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <React.Fragment>
      <div className="progress" ref={barRef} aria-hidden="true"></div>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-in">
          <a className="logo" href="#top">
            <span className="logo-dot"></span>
            LocalExpert
          </a>
          <nav className="nav" aria-label="Sekcje strony">
            <a href="#problem">Brzmi znajomo?</a>
            <a href="#jak">Jak to działa</a>
            <a href="#funkcje">Co dostajesz</a>
            <a href="#lista">Pełna lista</a>
            <a href="#cennik">Cennik</a>
            <a href="#faq">Pytania</a>
          </nav>
          <Magnetic><a className="btn btn-sm" href="#zapis">Wcześniejszy dostęp</a></Magnetic>
        </div>
      </header>
    </React.Fragment>
  );
}

/* Hero — variant-driven headline + form + flagship demo */
const HERO_VARIANTS = {
  widocznosc: {
    h1: 'Cała okolica szuka w Google. Niech znajduje Ciebie.',
    accent: ['Ciebie'],
    sub: 'Wizytówka, opinie i pozycja w Mapach — zadbane za Ciebie, tydzień po tygodniu. Ty tylko akceptujesz gotowe działania z telefonu. 15 minut tygodniowo, zero żargonu.',
  },
  autopilot: {
    h1: 'Twoja widoczność w okolicy, zadbana za Ciebie.',
    accent: ['zadbana'],
    sub: 'Gotowe odpowiedzi na opinie, posty i zbieranie ocen od klientów. Akceptujesz jednym kliknięciem z telefonu — 15 minut tygodniowo zamiast agencji za 1000 zł/mc.',
  },
  przewaga: {
    h1: 'Wiedz o konkurencji więcej, niż ona wie o sobie.',
    accent: ['więcej,'],
    sub: 'Na co skarżą się jej klienci, jakie ma ceny, kiedy ma ruch — i co poprawić u Ciebie, żeby przejąć jej klientów. Plus wizytówka Google zadbana za Ciebie.',
  },
};

function Hero({ variant }) {
  const v = HERO_VARIANTS[variant] || HERO_VARIANTS.widocznosc;
  return (
    <section className="hero" id="top" data-screen-label="Hero">
      <span className="hero-asterisk" aria-hidden="true">✳</span>
      <div className="wrap">
        <div className="hero-top">
          <Reveal as="span" className="label">Wizytówka Google · opinie · konkurencja · AI</Reveal>
          <Reveal as="div" className="address-block" delay={0.2}>
            <strong>LocalExpert</strong>
            <span className="addr-mark">✳</span>
            <span>widoczność lokalna</span>
            <span>start: jesień 2026 · PL</span>
          </Reveal>
        </div>
        <div className="hero-grid">
          <div>
            <h1 className="display" key={variant}>
              <Words text={v.h1} accent={v.accent} startDelay={0.1} />
            </h1>
            <Reveal as="p" className="lead" delay={0.35} style={{ marginTop: 24 }}>{v.sub}</Reveal>
            <Reveal delay={0.5} id="zapis">
              <SignupForm idPrefix="hero" />
            </Reveal>
          </div>
          <div className="hero-visual">
            <svg className="tech-orn" viewBox="0 0 600 600" aria-hidden="true">
              <circle cx="300" cy="280" r="230"></circle>
              <circle cx="300" cy="280" r="150"></circle>
              <circle cx="300" cy="280" r="60"></circle>
              <line x1="300" y1="20" x2="300" y2="540"></line>
              <line x1="40" y1="280" x2="560" y2="280"></line>
            </svg>
            <span className="float-word" style={{ top: '-4%', right: '-2%' }} aria-hidden="true">;Opinie</span>
            <span className="float-word" style={{ bottom: '24%', left: '-14%', filter: 'blur(1.5px)' }} aria-hidden="true">;Posty</span>
            <span className="float-word" style={{ bottom: '-7%', right: '4%', filter: 'blur(4px)' }} aria-hidden="true">;Pozycja</span>
            <Reveal scale={true} delay={0.45} className="floaty" style={{ '--rot': '0.6deg' }}>
              <ReviewDemo titlebar="Twój telefon · 1 nowe powiadomienie" />
            </Reveal>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 'clamp(48px, 6vw, 80px)' }}>
        <MarqueeBand />
      </div>
    </section>
  );
}

/* Problem — mirror of pain, rows light up as you scroll */
const PAINS = [
  'Masz 14 opinii. Konkurent z drugiej strony ulicy — 120.',
  'Ktoś wystawił Ci 1 gwiazdkę i wisi bez odpowiedzi od trzech miesięcy.',
  'Wpisujesz „fryzjer + swoja dzielnica" i nie ma Cię poza własną ulicą.',
  'Płacisz komuś za „pozycjonowanie" i nie wiesz, co właściwie dostajesz.',
  'Wiesz, że wizytówka jest ważna. Ale zawsze przegrywa z prowadzeniem firmy.',
];

function PainRow({ text, index }) {
  const [ref, inView] = useInView({ threshold: 0.7 });
  return (
    <div ref={ref} className={`pain ${inView ? 'lit' : ''}`}>
      <span className="pain-n">/{String(index + 1).padStart(2, '0')}</span>
      <span>{text}</span>
    </div>
  );
}

function Problem() {
  return (
    <section className="sec sec-dark" id="problem" data-screen-label="Brzmi znajomo?">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" className="label">Lustro</Reveal>
          <Reveal as="h2" className="display h2" delay={0.1}>Brzmi znajomo?</Reveal>
        </div>
        <div className="pain-list">
          {PAINS.map((p, i) => <PainRow key={i} text={p} index={i} />)}
        </div>
        <Reveal as="p" className="pain-close" delay={0.15}>
          To nie Twoja wina. To praca na kilka godzin tygodniowo — <strong>i dokładnie tę pracę zdejmujemy z Ciebie.</strong>
        </Reveal>
      </div>
    </section>
  );
}

/* How it works — 3 steps */
function HowItWorks() {
  const steps = [
    {
      t: 'Wskaż swoją firmę',
      d: <React.Fragment>Wpisujesz nazwę firmy, potwierdzasz wizytówkę. Znajdujemy Twój profil w Google i konkurentów wokół Ciebie. <strong>60 sekund, żadnej konfiguracji.</strong></React.Fragment>,
    },
    {
      t: 'Akceptuj gotowe działania',
      d: <React.Fragment>Przygotowujemy za Ciebie: odpowiedzi na nowe opinie, posty na wizytówkę, poprawki w profilu, prośby o opinie. Dostajesz powiadomienie, czytasz, klikasz „Akceptuję" — i to jest opublikowane. <strong>Nic nigdy nie wychodzi bez Twojej zgody.</strong></React.Fragment>,
    },
    {
      t: 'Patrz, jak rośnie',
      d: <React.Fragment>Co tydzień krótkie podsumowanie: ile opinii przybyło, jak zmieniła się Twoja pozycja w Mapach, co zrobiliśmy i co znaleźliśmy u konkurencji. <strong>Po ludzku, bez wykresów dla specjalistów.</strong></React.Fragment>,
    },
  ];
  return (
    <section className="sec" id="jak" data-screen-label="Jak to działa">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" className="label">Mechanizm, nie magia</Reveal>
          <Reveal as="h2" className="display h2" delay={0.1}>Jak to działa</Reveal>
          <Reveal as="p" className="lead" delay={0.2}>
            Trzy kroki. Pierwszy zajmuje minutę, pozostałe dwa robią się same — Ty tylko zatwierdzasz.
          </Reveal>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.13} scale={true} className="step">
              <span className="step-n">Krok {i + 1} / 3</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HeaderBar, Hero, Problem, HowItWorks, HERO_VARIANTS });
