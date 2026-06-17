/* BestLocal — Tweaks panel (hero variant A/B/C, accent, motion) */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "A — Autopilot",
  "accent": "#22c08a",
  "motion": true
}/*EDITMODE-END*/;

const VARIANT_KEY = { "A — Autopilot": "A", "B — Wywiad konkurencyjny": "B", "C — Lęk / niewidzialność": "C" };

function applyTweaks(t) {
  const root = document.documentElement;
  const v = VARIANT_KEY[t.heroVariant] || "A";
  if (root.getAttribute("data-variant") !== v) {
    root.setAttribute("data-variant", v);
    document.querySelectorAll(".hero h1 .variant, .hero .hero-sub .variant").forEach((el) => {
      el.classList.remove("variant-swap");
      void el.offsetWidth;
      el.classList.add("variant-swap");
    });
    if (window.blTrack) window.blTrack("variant_view", { variant: v });
  }
  root.style.setProperty("--accent", t.accent);
  root.classList.toggle("no-motion", !t.motion);
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);
  return (
    <TweaksPanel>
      <TweakSection label="Test A/B/C (hero)" />
      <TweakSelect
        label="Wariant przekazu"
        value={t.heroVariant}
        options={["A — Autopilot", "B — Wywiad konkurencyjny", "C — Lęk / niewidzialność"]}
        onChange={(v) => setTweak("heroVariant", v)}
      />
      <TweakSection label="Wygląd" />
      <TweakColor
        label="Akcent"
        value={t.accent}
        options={["#22c08a", "#9ee65b", "#1f8a5b", "#5ad1b2"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSection label="Ruch" />
      <TweakToggle label="Animacje" value={t.motion} onChange={(v) => setTweak("motion", v)} />
    </TweaksPanel>
  );
}

(function mount() {
  const el = document.getElementById("tweaks-root");
  if (el) ReactDOM.createRoot(el).render(<TweaksApp />);
})();
