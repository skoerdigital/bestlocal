// LocalExpert v3 — app assembly + Tweaks

const TWEAK_DEFAULTS_V3 = /*EDITMODE-BEGIN*/{
  "heroVariant": "widocznosc",
  "accent": "#2E9E58",
  "typePairing": "serif"
}/*EDITMODE-END*/;

const ACCENT_PRESETS_V3 = {
  '#2E9E58': { ink: '#F2FBF5', soft: 'rgba(46, 158, 88, 0.12)', name: 'Świeża zieleń' },
  '#C2562B': { ink: '#FFF4EC', soft: 'rgba(194, 86, 43, 0.12)', name: 'Miedź' },
  '#E2A33C': { ink: '#1A2A1E', soft: 'rgba(226, 163, 60, 0.16)', name: 'Ochra' },
  '#7257E6': { ink: '#F4F0FF', soft: 'rgba(114, 87, 230, 0.12)', name: 'Heliotrop' },
};

function AppV3() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_V3);

  /* Watchdog: never leave content invisible if animations can't run */
  React.useEffect(() => {
    const check = () => {
      const w = document.querySelector('.w');
      const animStalled = w && getComputedStyle(w).opacity === '0';
      const ioStalled = !document.querySelector('.rv.in');
      if (animStalled || ioStalled) {
        document.documentElement.classList.add('skip-anim');
        window.dispatchEvent(new Event('le-skip-anim'));
      }
    };
    const id = setTimeout(check, 1600);
    return () => clearTimeout(id);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    const preset = ACCENT_PRESETS_V3[t.accent] || ACCENT_PRESETS_V3['#2E9E58'];
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-ink', preset.ink);
    root.style.setProperty('--accent-soft', preset.soft);
    root.setAttribute('data-type', t.typePairing);
  }, [t.accent, t.typePairing]);

  return (
    <React.Fragment>
      <HeaderBar />
      <main>
        <Hero3 variant={t.heroVariant} />
        <Problem />
        <HowItWorks />
        <Features />
        <FullList />
        <Audience />
        <Compare />
        <Pricing />
        <Founder />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <TweaksPanel>
        <TweakSection label="Przekaz" />
        <TweakSelect
          label="Wariant hero"
          value={t.heroVariant}
          options={[
            { value: 'widocznosc', label: 'Widoczność — „Niech znajduje Ciebie"' },
            { value: 'autopilot', label: 'Autopilot — „Zadbana za Ciebie"' },
            { value: 'przewaga', label: 'Przewaga — „Wiedz o konkurencji więcej"' },
          ]}
          onChange={(v) => setTweak('heroVariant', v)}
        />
        <TweakSection label="Wygląd" />
        <TweakColor
          label="Akcent"
          value={t.accent}
          options={Object.keys(ACCENT_PRESETS_V3)}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSelect
          label="Typografia"
          value={t.typePairing}
          options={[
            { value: 'serif', label: 'Serif — Source Serif + Manrope' },
            { value: 'editorial', label: 'Editorial — Spectral + Space Grotesk' },
            { value: 'groteska', label: 'Groteska — Bricolage + Manrope' },
          ]}
          onChange={(v) => setTweak('typePairing', v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppV3 />);
