// LocalExpert v3 — "Gaja" hero: deep green editorial, floating chips, pillar cards

function Hero3({ variant }) {
  const v = HERO_VARIANTS[variant] || HERO_VARIANTS.widocznosc;
  return (
    <section className="hero" id="top" data-screen-label="Hero">
      <div className="wrap">
        <div className="hero-grid" style={{ paddingTop: 'clamp(24px, 4vh, 56px)' }}>
          <div>
            <Reveal as="span" className="label">Wizytówka Google · opinie · konkurencja · AI</Reveal>
            <h1 className="display" key={variant} style={{ margin: '24px 0 20px' }}>
              <Words text={v.h1} accent={v.accent} startDelay={0.1} />
            </h1>
            <Reveal as="p" className="lead" delay={0.35} style={{ marginBottom: 30 }}>{v.sub}</Reveal>
            <Reveal delay={0.5} id="zapis">
              <SignupForm idPrefix="hero" />
            </Reveal>
          </div>
          <div className="hero-visual">
            <div className="float-chip" style={{ top: '-22px', right: '-14px' }} aria-hidden="true">
              <div>
                <span className="fc-big">#3 <span className="fc-up">↑</span></span>
                <span className="fc-sub">pozycja w Mapach · „manicure mokotów"</span>
              </div>
            </div>
            <div className="float-chip" style={{ bottom: '-18px', left: '-20px' }} aria-hidden="true">
              <div>
                <span className="fc-big">+12</span>
                <span className="fc-sub">nowych opinii w tym miesiącu</span>
              </div>
            </div>
            <Reveal scale={true} delay={0.45}>
              <ReviewDemo titlebar="Twój telefon · 1 nowe powiadomienie" />
            </Reveal>
          </div>
        </div>
        <div className="pillars">
          <Reveal as="a" href="#funkcje" className="pillar" delay={0.15}>
            <span className="p-ico">★</span>
            <span><span className="p-t">Opinie zaopiekowane</span><br></br><span className="p-s">odpowiedzi + zdobywanie nowych</span></span>
            <span className="p-arr">→</span>
          </Reveal>
          <Reveal as="a" href="#funkcje" className="pillar" delay={0.25}>
            <span className="p-ico">✓</span>
            <span><span className="p-t">Wizytówka zawsze żywa</span><br></br><span className="p-s">posty, godziny, zdjęcia, usługi</span></span>
            <span className="p-arr">→</span>
          </Reveal>
          <Reveal as="a" href="#funkcje" className="pillar" delay={0.35}>
            <span className="p-ico">◎</span>
            <span><span className="p-t">Wywiad konkurencyjny</span><br></br><span className="p-s">skargi, ceny i polecenia w AI</span></span>
            <span className="p-arr">→</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero3 });
