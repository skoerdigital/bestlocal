// LocalExpert LP — app assembly + Tweaks wiring

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "widocznosc",
  "accent": "#F04E23",
  "typePairing": "industrial"
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  '#F04E23': { ink: '#FFF3ED', soft: 'rgba(240, 78, 35, 0.1)', name: 'Pomarańcz TE' },
  '#C2562B': { ink: '#FFF4EC', soft: 'rgba(194, 86, 43, 0.12)', name: 'Miedź' },
  '#B7C94A': { ink: '#15261C', soft: 'rgba(183, 201, 74, 0.16)', name: 'Limonka' },
  '#7257E6': { ink: '#F4F0FF', soft: 'rgba(114, 87, 230, 0.12)', name: 'Heliotrop' },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  /* Watchdog: if entrance animations can't run (throttled iframe, odd browser),
     un-gate every reveal so content is never invisible. */
  React.useEffect(() => {
    const check = () => {
      const w = document.querySelector('.w');
      const animStalled = w && getComputedStyle(w).opacity === '0';
      const ioStalled = !document.querySelector('.rv.in'); // hero reveals should be in view at load
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
    const preset = ACCENT_PRESETS[t.accent] || ACCENT_PRESETS['#F04E23'];
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-ink', preset.ink);
    root.style.setProperty('--accent-soft', preset.soft);
    root.setAttribute('data-type', t.typePairing);
  }, [t.accent, t.typePairing]);

  return (
    <React.Fragment>
      <HeaderBar />
      <main>
        <Hero variant={t.heroVariant} />
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
          options={Object.keys(ACCENT_PRESETS)}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSelect
          label="Typografia"
          value={t.typePairing}
          options={[
            { value: 'industrial', label: 'Industrialna — Archivo + Manrope' },
            { value: 'groteska', label: 'Groteska — Bricolage + Manrope' },
            { value: 'editorial', label: 'Editorial — Spectral + Space Grotesk' },
          ]}
          onChange={(v) => setTweak('typePairing', v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
