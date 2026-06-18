// LocalExpert LP — interactive product demos (HTML/CSS mockups)
// All demos are self-contained, animate on scroll into view, and reset.

/* Typewriter text that starts when in view (or on demand) */
function useTypewriter(fullText, active, speed = 14) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!active) { setN(0); return; }
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('skip-anim')
    ) { setN(fullText.length); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setN(Math.min(i, fullText.length));
      if (i >= fullText.length) clearInterval(id);
    }, speed);
    // Safety: timers are heavily throttled in hidden iframes/background tabs —
    // finish the sentence instantly if animations get skipped.
    const snap = () => { clearInterval(id); setN(fullText.length); };
    const tid = setTimeout(() => {
      setN((cur) => (cur < fullText.length ? fullText.length : cur));
    }, (fullText.length / 2) * speed + 1500);
    window.addEventListener('le-skip-anim', snap);
    return () => { clearInterval(id); clearTimeout(tid); window.removeEventListener('le-skip-anim', snap); };
  }, [active, fullText]);
  return [fullText.slice(0, n), n >= fullText.length];
}

/* ① Review reply approval — the flagship demo (also used in hero) */
function ReviewDemo({ titlebar = 'Nowa opinia · do akceptacji' }) {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const replyFull = 'Dziękujemy za zaufanie i miłe słowa o koloryzacji! Za spóźnienie szczerze przepraszamy — pracujemy nad lepszym planowaniem wizyt. Zapraszamy ponownie, następna kawa na nasz koszt. — Studio Lume';
  const [typed, typedDone] = useTypewriter(replyFull, inView);
  const [published, setPublished] = React.useState(false);

  return (
    <div className="demo" ref={ref}>
      {published ? (
        <button className="demo-reset" onClick={() => setPublished(false)}>↺ od nowa</button>
      ) : null}
      <div className="demo-titlebar">
        <span>{titlebar}</span>
        <span className="live">na żywo</span>
      </div>
      <div className="review-card">
        <div className="review-head">
          <span className="avatar">AK</span>
          <div>
            <div className="review-name">Anna K.</div>
            <div className="review-meta">2 godziny temu · Google</div>
          </div>
          <span className="stars" style={{ marginLeft: 'auto' }}>★★★★<span className="off">★</span></span>
        </div>
        <p className="review-text">„Koloryzacja wyszła pięknie i obsługa bardzo miła. Jedyny minus — czekałam 20 minut po umówionej godzinie."</p>
      </div>
      <div className={`reply-card ${published ? 'published' : ''}`}>
        <div className="reply-tag">
          {published ? '✓ Opublikowano na wizytówce' : 'Proponowana odpowiedź — czeka na Ciebie'}
        </div>
        <p className="reply-text">
          {typed}
          {!typedDone && inView ? <span className="caret"></span> : null}
        </p>
        <div className="reply-actions">
          {published ? (
            <span className="published-note">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              Gotowe. Tyle z Twojej strony.
            </span>
          ) : (
            <React.Fragment>
              <button className="btn-approve" disabled={!typedDone} onClick={() => setPublished(true)}>
                Akceptuję
              </button>
              <button className="btn-ghost" disabled={!typedDone}>Popraw</button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

/* ② Profile checklist + scheduled post */
function ProfileDemo() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const rows = [
    { t: 'Godziny na majówkę zaktualizowane', when: 'dziś' },
    { t: 'Post: wolne terminy przed weekendem', when: 'zaplanowany' },
    { t: 'Nowe zdjęcia wnętrza dodane', when: 'wt' },
    { t: 'Usługa „strzyżenie brody" opisana', when: 'pon' },
  ];
  const [done, setDone] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDone(rows.length); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1; setDone(i);
      if (i >= rows.length) clearInterval(id);
    }, 450);
    return () => clearInterval(id);
  }, [inView]);
  return (
    <div className="demo" ref={ref}>
      <div className="demo-titlebar">
        <span>Wizytówka · ten tydzień</span>
        <span className="live">aktywna</span>
      </div>
      {rows.map((r, i) => (
        <div className={`check-row ${i < done ? 'done' : ''}`} key={i}>
          <span className="check-box">✓</span>
          <span>{r.t}</span>
          <span className="when">{r.when}</span>
        </div>
      ))}
    </div>
  );
}

/* ③ Competitor complaints → your advantage */
function InsightDemo() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [accepted, setAccepted] = React.useState(false);
  return (
    <div className="demo" ref={ref}>
      {accepted ? <button className="demo-reset" onClick={() => setAccepted(false)}>↺ od nowa</button> : null}
      <div className="demo-titlebar">
        <span>Wywiad · 3 warsztaty w okolicy</span>
        <span className="live">nowe wnioski</span>
      </div>
      <Reveal delay={0.05} className="quote-row">
        <span className="q-src">Auto-Max ★2</span>
        <span>„<mark>Nie da się dodzwonić</mark>, telefon milczy od rana…"</span>
      </Reveal>
      <Reveal delay={0.15} className="quote-row">
        <span className="q-src">Warsztat U Romka ★1</span>
        <span>„Trzy dni próbowałem się umówić. <mark>Nikt nie odbiera</mark>."</span>
      </Reveal>
      <Reveal delay={0.25} className="quote-row">
        <span className="q-src">MotoSerwis ★2</span>
        <span>„Dobra robota, ale <mark>umówienie wizyty to dramat</mark>."</span>
      </Reveal>
      <Reveal delay={0.4} className="insight-result">
        <div className="reply-tag">Twoja przewaga — gotowa propozycja</div>
        <p>Masz rezerwacje online — Twoja konkurencja nie odbiera telefonów. Przygotowaliśmy post i dopisek do usług: <strong>„Umówisz się w 30 sekund, bez dzwonienia"</strong>.</p>
        <div className="reply-actions">
          {accepted ? (
            <span className="published-note" style={{ color: 'var(--accent)' }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              Post trafił na Twoją wizytówkę.
            </span>
          ) : (
            <button className="btn-approve" onClick={() => setAccepted(true)}>Akceptuję post</button>
          )}
        </div>
      </Reveal>
    </div>
  );
}

/* ④ Fake listing detector */
function FakeDemo() {
  const [sent, setSent] = React.useState(false);
  return (
    <div className="demo">
      {sent ? <button className="demo-reset" onClick={() => setSent(false)}>↺ od nowa</button> : null}
      <div className="demo-titlebar">
        <span>Mapy · Twoja okolica</span>
        <span className="live">monitoring</span>
      </div>
      <div className="listing-row">
        <span className="listing-pin">📍</span>
        <div>
          <div className="listing-name">Salon Beauty Anna | <mark>Manicure Hybrydowy Paznokcie Mokotów Tanio</mark></div>
          <div className="listing-sub">Na szyldzie: „Salon Anna" — nazwa łamie zasady Google</div>
        </div>
        <span className={`flag-chip ${sent ? 'ok-chip' : ''}`}>{sent ? 'zgłoszone' : 'wykryto'}</span>
      </div>
      <div className="listing-row">
        <span className="listing-pin">📍</span>
        <div>
          <div className="listing-name">Salon Anna</div>
          <div className="listing-sub">Twoja wizytówka · pozycja {sent ? <strong style={{ color: 'var(--ok)' }}>#3 ↑</strong> : '#4'} w „manicure mokotów"</div>
        </div>
        <span className="flag-chip ok-chip">Ty</span>
      </div>
      <div className="reply-actions" style={{ marginTop: 16 }}>
        {sent ? (
          <span className="published-note">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            Zgłoszenie z dowodami wysłane do Google.
          </span>
        ) : (
          <React.Fragment>
            <button className="btn-approve" onClick={() => setSent(true)}>Wyślij zgłoszenie</button>
            <span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>dowody zebrane · 2 minuty</span>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

/* ⑤ AI assistants check */
function AIDemo() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <div className="demo" ref={ref}>
      <div className="demo-titlebar">
        <span>Nowe wyszukiwarki · ten miesiąc</span>
        <span className="live">10 zapytań</span>
      </div>
      <div className="ai-query">💬 „poleć dobrego barbera na Woli"</div>
      <div className="ai-bars">
        <div className="ai-bar-row">
          <span className="who">Konkurent X</span>
          <span className="ai-bar-track"><span className="ai-bar-fill" style={{ width: inView ? '60%' : 0 }}></span></span>
          <span className="n">6/10</span>
        </div>
        <div className="ai-bar-row">
          <span className="who">Konkurent Y</span>
          <span className="ai-bar-track"><span className="ai-bar-fill" style={{ width: inView ? '30%' : 0, transitionDelay: '0.15s' }}></span></span>
          <span className="n">3/10</span>
        </div>
        <div className="ai-bar-row">
          <span className="who" style={{ color: 'var(--accent)' }}>Twoja firma</span>
          <span className="ai-bar-track"><span className="ai-bar-fill you" style={{ width: inView ? '10%' : 0, transitionDelay: '0.3s' }}></span></span>
          <span className="n">1/10</span>
        </div>
      </div>
      <p className="ai-note">Dostajesz listę konkretów, które to zmieniają — z zapytaniami i odpowiedziami do wglądu. Nie zgadujemy.</p>
    </div>
  );
}

Object.assign(window, { ReviewDemo, ProfileDemo, InsightDemo, FakeDemo, AIDemo });
