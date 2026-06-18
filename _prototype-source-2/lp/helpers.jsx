// LocalExpert LP — shared helpers
const { useState, useEffect, useRef, useCallback } = React;

/* IntersectionObserver hook */
function useInView(opts) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setInView(true); io.disconnect(); }
        });
      },
      opts || { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    const onSkip = () => { setInView(true); io.disconnect(); };
    window.addEventListener('le-skip-anim', onSkip);
    return () => { io.disconnect(); window.removeEventListener('le-skip-anim', onSkip); };
  }, []);
  return [ref, inView];
}

/* Reveal wrapper — fades/slides children in on scroll */
function Reveal({ as = 'div', delay = 0, scale = false, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`rv ${scale ? 'rv-scale' : ''} ${inView ? 'in' : ''} ${className}`}
      style={{ ...(style || {}), '--d': `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Word-by-word animated heading text */
function Words({ text, accent = [], startDelay = 0 }) {
  const words = text.split(' ');
  return (
    <React.Fragment>
      {words.map((word, i) => {
        const clean = word.replace(/[.,!?]/g, '');
        const isAccent = accent.includes(clean);
        const inner = isAccent ? <em>{word}</em> : word;
        const last = i === words.length - 1;
        return (
          <span key={i} className="w" style={{ '--wd': `${startDelay + i * 0.055}s`, marginRight: last ? 0 : '0.24em' }}>{inner}</span>
        );
      })}
    </React.Fragment>
  );
}

/* Magnetic hover for buttons */
function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = '';
  };
  return (
    <span ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ display: 'inline-block', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
      {children}
    </span>
  );
}

/* Animated number ticker */
function Ticker({ to, suffix = '', duration = 1200 }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('skip-anim')
    ) { setVal(to); return; }
    let start;
    let done = false;
    const tick = (ts) => {
      if (done) return;
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * ease));
      if (p < 1) requestAnimationFrame(tick);
      else done = true;
    };
    requestAnimationFrame(tick);
    // Safety: rAF can be frozen (hidden iframe, background tab) — snap to final value.
    const snap = () => { done = true; setVal(to); };
    const tid = setTimeout(snap, duration + 400);
    window.addEventListener('le-skip-anim', snap);
    return () => { done = true; clearTimeout(tid); window.removeEventListener('le-skip-anim', snap); };
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* Signup form — email + consent + optional industry/city, mocked submit */
function SignupForm({ compact = false, idPrefix = 'f' }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!ok) { setError('Podaj poprawny adres e-mail — np. anna@twojafirma.pl'); return; }
    if (!consent) { setError('Zaznacz zgodę, żebyśmy mogli legalnie do Ciebie napisać.'); return; }
    setError(null);
    setDone(true);
    setTimeout(() => { window.location.href = 'Dziekujemy.html'; }, 1200);
  };

  if (done) {
    return (
      <div className="signup-success" role="status">
        <span className="check-ring">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </span>
        <div>
          <strong>Jesteś na liście.</strong><br></br>
          <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Sprawdź skrzynkę — przenosimy Cię dalej…</span>
        </div>
      </div>
    );
  }

  return (
    <form className="signup" onSubmit={submit} noValidate={true}>
      <div className="signup-row">
        <input
          type="email"
          id={`${idPrefix}-email`}
          aria-label="Twój adres e-mail"
          placeholder="Twój adres e-mail"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
        ></input>
        <Magnetic>
          <button type="submit" className="btn btn-accent">
            Chcę wcześniejszy dostęp
            <span className="arr">→</span>
          </button>
        </Magnetic>
      </div>
      {error ? <div className="err" role="alert">{error}</div> : null}
      {!compact ? (
        <details className="signup-extra">
          <summary>Branża i miasto — opcjonalnie, pomożesz nam ustawić kolejność branż</summary>
          <div className="signup-extra-fields">
            <select aria-label="Branża" defaultValue="">
              <option value="" disabled={true}>Branża</option>
              <option>Fryzjer / barber</option>
              <option>Beauty</option>
              <option>Gastronomia</option>
              <option>Moto</option>
              <option>Zdrowie</option>
              <option>Usługi domowe</option>
              <option>Inna</option>
            </select>
            <input type="text" aria-label="Miasto" placeholder="Miasto"></input>
          </div>
        </details>
      ) : null}
      <label className="consent">
        <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setError(null); }}></input>
        <span>
          Zapisując się, zgadzam się na otrzymywanie informacji o produkcie LocalExpert na podany e-mail.
          Administratorem danych jest {'{PODMIOT}'}. Mogę wypisać się w każdej chwili.{' '}
          <a href="#" onClick={(e) => e.preventDefault()}>Polityka prywatności</a>
        </span>
      </label>
      <p className="micro">
        Start <strong>jesienią 2026</strong> · Pierwsze 100 firm: <strong>3 miesiące za pół ceny</strong> · Zero spamu — napiszemy o starcie i wynikach budowy.
      </p>
    </form>
  );
}

/* Industries marquee band */
function MarqueeBand() {
  const items = ['fryzjerzy i barberzy', 'beauty', 'gastronomia', 'warsztaty', 'gabinety', 'usługi domowe'];
  const chunk = (key) => (
    <div className="marquee-chunk" key={key} aria-hidden={key > 0}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <span>{it}</span>
          <span className="dot">✳</span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="marquee-band" role="presentation">
      <div className="marquee-inner">{chunk(0)}{chunk(1)}</div>
    </div>
  );
}

Object.assign(window, { useInView, Reveal, Words, Magnetic, Ticker, SignupForm, MarqueeBand });
