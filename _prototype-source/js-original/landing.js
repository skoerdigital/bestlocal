/* BestLocal — interactions & micro-animations
   Resilience rule: visible is the base state. This script adds html.js-anim
   to opt INTO entrance animations, then guarantees release via rect-check
   reveals + watchdog timeouts (no IntersectionObserver dependency). */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function motionOff() {
    return reduced || root.classList.contains("no-motion") || root.classList.contains("anim-frozen");
  }

  /* Opt INTO entrance animations. Base state (no class) is fully visible, so
     any context that ignores this script still shows everything. Two release
     guarantees keep content from ever getting stuck hidden:
       1. words-done timer forces the headline to its end state.
       2. rect-check reveals (below) run on a timer, not the anim timeline. */
  if (!reduced) {
    root.classList.add("js-anim");
    setTimeout(function () { root.classList.add("words-done"); }, 1700);

    /* Frozen-timeline guard: some embed/capture/export contexts pause the
       animation timeline, which would leave transition-based reveals stuck at
       their hidden start value forever. Detect it with a wall-clock probe
       (setTimeout fires even when the timeline is frozen) and fall back to the
       fully-visible anim-frozen state. Real browsers progress the probe and
       keep the full animation. */
    (function frozenGuard() {
      var p = document.createElement("div");
      p.style.cssText = "position:fixed;left:-99px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;transition:opacity .05s linear";
      document.body.appendChild(p);
      void p.offsetWidth;
      p.style.opacity = "1";
      setTimeout(function () {
        var op = parseFloat(getComputedStyle(p).opacity) || 0;
        p.remove();
        if (op < 0.5) root.classList.add("anim-frozen");
      }, 220);
    })();
  }

  /* ---------- tiny analytics stub (events from spec §6.8) ---------- */
  window.blTrack = function (name, props) {
    try { console.log("[analytics]", name, props || {}); } catch (e) {}
  };

  /* ---------- nav ---------- */
  var nav = document.querySelector(".nav");
  function onScrollNav() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- scroll reveals (rect-check, no IO) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var countEls = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var pricingEl = document.getElementById("cennik");
  var pricingSeen = false;
  var revealsArmed = false;

  function armReveals() {
    if (revealsArmed) return;
    revealsArmed = true;
    visibleCheck();
  }

  function visibleCheck() {
    if (!revealsArmed) return;
    var vh = window.innerHeight || 700;
    revealEls = revealEls.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > -20) { el.classList.add("in"); return false; }
      return true;
    });
    countEls = countEls.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) { countUp(el); return false; }
      return true;
    });
    if (pricingEl && !pricingSeen) {
      var pr = pricingEl.getBoundingClientRect();
      if (pr.top < vh * 0.7 && pr.bottom > 0) {
        pricingSeen = true;
        window.blTrack("scroll_pricing", {});
      }
    }
  }
  var scrollTick = false;
  window.addEventListener("scroll", function () {
    if (scrollTick) return;
    scrollTick = true;
    setTimeout(function () { scrollTick = false; visibleCheck(); }, 80);
  }, { passive: true });
  window.addEventListener("resize", visibleCheck);
  armReveals();
  var vcTimer = setInterval(function () {
    visibleCheck();
    if (revealsArmed && !revealEls.length && !countEls.length && pricingSeen) clearInterval(vcTimer);
  }, 600);

  /* ---------- hero parallax ---------- */
  var heroPhoto = document.querySelector(".hero-photo img");
  var floatCards = document.querySelectorAll(".float-card");
  function parallax() {
    if (motionOff()) return;
    var y = window.scrollY;
    if (y > 900) return;
    if (heroPhoto) heroPhoto.style.transform = "scale(1.06) translateY(" + y * 0.06 + "px)";
    floatCards.forEach(function (c, i) {
      c.style.translate = "0 " + y * (i ? -0.05 : -0.09) + "px";
    });
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(parallax); }, { passive: true });

  /* ---------- hero "Akceptuję" micro-interaction ---------- */
  var acc = document.querySelector(".fc-accept");
  if (acc) {
    acc.addEventListener("click", function () {
      if (acc.classList.contains("done")) return;
      acc.classList.add("done");
      acc.innerHTML = "Opublikowano <span aria-hidden=\"true\">✓</span>";
      window.blTrack("cta_click", { position: "hero_demo_accept" });
      setTimeout(function () {
        acc.classList.remove("done");
        acc.innerHTML = "Akceptuję";
      }, 2600);
    });
  }

  /* ---------- count-up stats (base state in HTML = final value) ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    /* animate only when entrance animations are confirmed working */
    if (motionOff() || !root.classList.contains("js-anim")) {
      el.textContent = target;
      return;
    }
    var dur = 1400;
    var t0 = null;
    /* guaranteed end state even if rAF freezes mid-flight */
    setTimeout(function () { el.textContent = target; }, dur + 250);
    function frame(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = "0";
    requestAnimationFrame(frame);
  }

  /* ---------- feature tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".feature-tab"));
  var mocks = Array.prototype.slice.call(document.querySelectorAll(".mock"));
  var fSection = document.querySelector(".features-section");
  var rotateTimer = null;
  var current = 0;

  function activate(i, fromUser) {
    current = i;
    tabs.forEach(function (t, j) {
      t.setAttribute("aria-selected", j === i ? "true" : "false");
      var bar = t.querySelector(".ft-progress i");
      if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
    });
    mocks.forEach(function (m, j) { m.classList.toggle("active", j === i); });
    if (fromUser) {
      window.blTrack("feature_tab", { index: i });
      restartRotate();
    }
  }
  function featuresInView() {
    if (!fSection) return false;
    var r = fSection.getBoundingClientRect();
    var vh = window.innerHeight || 700;
    return r.top < vh * 0.85 && r.bottom > vh * 0.15;
  }
  function restartRotate() {
    clearInterval(rotateTimer);
    if (motionOff()) return;
    rotateTimer = setInterval(function () {
      if (!featuresInView() || document.hidden) return;
      activate((current + 1) % tabs.length, false);
    }, 9000);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { activate(i, true); });
  });
  if (tabs.length) {
    activate(0, false);
    restartRotate();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item, i) {
    var btn = item.querySelector(".faq-q");
    btn.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) window.blTrack("faq_open", { q: i + 1 });
    });
  });

  /* ---------- magnetic buttons ---------- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn-accent, .btn-dark").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        if (motionOff()) return;
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = "translate(" + dx * 7 + "px," + dy * 6 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- signup forms ---------- */
  function bindForm(form, position) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = form.querySelector(".form-error");
      var email = form.querySelector("input[type=email]");
      var consent = form.querySelector("input[name=consent]");
      var hp = form.querySelector("input[name=website]");
      function fail(msg) {
        err.textContent = msg;
        err.classList.add("show");
        email.focus();
      }
      err.classList.remove("show");
      if (hp && hp.value) return; /* honeypot */
      var v = (email.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        return fail("Podaj poprawny adres e-mail — np. anna@twojafirma.pl");
      }
      if (consent && !consent.checked) {
        err.textContent = "Zaznacz zgodę, żebyśmy mogli do Ciebie napisać.";
        err.classList.add("show");
        return;
      }
      var industry = form.querySelector("select[name=industry]");
      var city = form.querySelector("input[name=city]");
      var variant = root.getAttribute("data-variant") || "A";
      var record = {
        email: v,
        industry: industry ? industry.value : "",
        city: city ? city.value.trim() : "",
        variant: variant,
        consent_at: new Date().toISOString()
      };
      try { localStorage.setItem("bestlocal_signup", JSON.stringify(record)); } catch (e2) {}
      window.blTrack("signup_submitted", { variant: variant, source: position });
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.innerHTML = "Zapisujemy\u2026";
      setTimeout(function () { window.location.href = "dziekujemy.html"; }, 650);
    });
  }
  bindForm(document.getElementById("hero-form"), "hero");
  bindForm(document.getElementById("cta-form"), "footer_cta");

  /* hero optional fields disclosure */
  document.querySelectorAll("[data-toggle-extra]").forEach(function (t) {
    t.addEventListener("click", function () {
      var target = document.getElementById(t.getAttribute("data-toggle-extra"));
      if (target) {
        target.hidden = !target.hidden;
        t.textContent = target.hidden ? "+ branża i miasto (opcjonalnie)" : "− ukryj dodatkowe pola";
      }
    });
  });

  /* ---------- variant view tracking ---------- */
  window.blTrack("variant_view", { variant: root.getAttribute("data-variant") || "A" });
})();
