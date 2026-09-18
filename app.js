/* Ashton Studios — interaction layer (vanilla, no deps) */
(() => {
  const doc = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = matchMedia("(max-width: 760px)").matches;

  if (reduceMotion) doc.classList.add("no-motion");
  if (reduceMotion || narrow) doc.classList.add("no-pin");

  /* Arm motion only when the page is actually visible, with a failsafe:
     a hidden/backgrounded tab must never trap content in its pre-reveal state. */
  const arm = () => doc.classList.add("motion-armed");
  if (!reduceMotion) {
    if (document.visibilityState === "visible") requestAnimationFrame(arm);
    else document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") arm();
    }, { once: true });
    setTimeout(arm, 2500); // failsafe: reveal regardless
  }

  /* ---------- reveals ---------- */
  const revealables = [...document.querySelectorAll(".reveal, .display")];
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); }
      }
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    revealables.forEach((el) => io.observe(el));
    setTimeout(() => revealables.forEach((el) => el.classList.add("revealed")), 3200); // failsafe
  } else {
    revealables.forEach((el) => el.classList.add("revealed"));
  }

  /* ---------- pinned horizontal work scrub ---------- */
  const work = document.querySelector(".work");
  const track = document.getElementById("workTrack");
  const bar = document.getElementById("workBar");
  if (work && track && !doc.classList.contains("no-pin")) {
    let start = 0, span = 1, max = 0, target = 0, current = 0, raf = 0;

    const measure = () => {
      const rect = work.getBoundingClientRect();
      start = rect.top + scrollY;
      span = work.offsetHeight - innerHeight;
      max = Math.max(0, track.scrollWidth - innerWidth);
    };

    const cards = [...track.querySelectorAll(".work-card")];

    /* Depth pass: each card's distance from the centre of the viewport drives
       a CSS custom property, so cards scale and fade as they travel through.
       Read positions from the already-known scrub offset rather than calling
       getBoundingClientRect() per card per frame — same result, no layout
       thrash on a 60fps path. */
    const paintDepth = () => {
      const mid = innerWidth / 2;
      for (const card of cards) {
        const cardMid = card.offsetLeft + card.offsetWidth / 2 - current;
        const d = Math.min(1, Math.abs(cardMid - mid) / (innerWidth * 0.72));
        card.style.setProperty("--depth", d.toFixed(3));
      }
    };

    const frame = () => {
      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.4) current = target;
      track.style.transform = `translate3d(${-current}px, 0, 0)`;
      if (bar) bar.style.transform = `scaleX(${max ? current / max : 0})`;
      paintDepth();
      if (current !== target) raf = requestAnimationFrame(frame);
      else raf = 0;
    };

    const onScroll = () => {
      const p = Math.min(1, Math.max(0, (scrollY - start) / span));
      target = p * max;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    measure();
    addEventListener("resize", () => { measure(); onScroll(); paintDepth(); }, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    paintDepth();
  }

  /* ---------- scroll-linked band + ticker velocity skew ---------- */
  const band = document.getElementById("bandText");
  const ticker = document.querySelector(".ticker");
  if ((band || ticker) && !reduceMotion) {
    let lastY = scrollY, vel = 0, skew = 0, bandTop = 0, raf2 = 0;

    const measureBand = () => {
      if (!band) return;
      const r = band.parentElement.getBoundingClientRect();
      bandTop = r.top + scrollY;
    };

    const loop = () => {
      const y = scrollY;
      vel += (y - lastY - vel) * 0.12;
      lastY = y;

      if (ticker) {
        // wider skew ceiling: the ticker should visibly lean into a fast scroll
        skew += (Math.max(-14, Math.min(14, vel * -0.7)) - skew) * 0.1;
        ticker.style.transform = `skewX(${skew.toFixed(3)}deg) scaleY(${(1 + Math.abs(skew) * 0.006).toFixed(4)})`;
      }
      if (band) {
        const p = y + innerHeight - bandTop;
        if (p > -200) band.style.transform = `translate3d(${(-p * 0.55).toFixed(1)}px, 0, 0)`;
      }
      if (Math.abs(vel) > 0.05 || Math.abs(skew) > 0.05) raf2 = requestAnimationFrame(loop);
      else { raf2 = 0; if (ticker) ticker.style.transform = ""; }
    };

    measureBand();
    addEventListener("resize", measureBand, { passive: true });
    addEventListener("scroll", () => { if (!raf2) raf2 = requestAnimationFrame(loop); }, { passive: true });
  }

  /* Magnetic buttons REMOVED 30 Aug on Ashton's call — buttons that chase the
     cursor made the page feel unstable to him. The `data-magnet` attributes
     are left on the markup as inert hooks; buttons now express hover purely
     through their own CSS state, which stays where the user put their cursor. */

  /* ---------- enquiry form ----------
     Two delivery paths, chosen at runtime so the form is never a dead end:
     - ENDPOINT set  -> POST as JSON, no page reload, inline success state.
     - ENDPOINT null -> open the visitor's mail client with every answer
       pre-written into the body, so a submission still reaches Ashton on a
       static host with no account, no third party and no server.
     Set ENDPOINT to a form-backend URL (Formspree/Web3Forms/etc.) to upgrade
     the first path on; nothing else here needs to change. */
  // FormSubmit's AJAX endpoint (12 Sep 2026): free, keyless, no account — the first
  // submission sends a one-time activation email to the inbox, which Ashton clicks once.
  const ENDPOINT = "https://formsubmit.co/ajax/james@ashtonstudios.uk";
  const INBOX = "james@ashtonstudios.uk";

  const form = document.getElementById("enquiryForm");
  if (form) {
    const status = document.getElementById("formStatus");
    const submit = form.querySelector("button[type=submit]");

    const setStatus = (msg, state) => {
      if (!status) return;
      status.textContent = msg;
      if (state) status.dataset.state = state; else delete status.dataset.state;
    };

    const showError = (input, on) => {
      const err = input.getAttribute("aria-describedby");
      const box = err && document.getElementById(err);
      input.setAttribute("aria-invalid", on ? "true" : "false");
      if (box) box.hidden = !on;
    };

    const validate = () => {
      let firstBad = null;
      for (const input of form.querySelectorAll("input[required], textarea[required]")) {
        const ok = input.value.trim() !== "" && input.checkValidity();
        showError(input, !ok);
        if (!ok && !firstBad) firstBad = input;
      }
      return firstBad;
    };

    // Clear an error the moment the visitor fixes it — never make them submit to find out.
    form.addEventListener("input", (e) => {
      const el = e.target;
      if (el.hasAttribute("required") && el.getAttribute("aria-invalid") === "true") {
        if (el.value.trim() !== "" && el.checkValidity()) showError(el, false);
      }
    });

    const asText = (data) =>
      [
        `business: ${data.business || "—"}`,
        `name: ${data.name || "—"}`,
        `email: ${data.email || "—"}`,
        `phone: ${data.phone || "—"}`,
        `current website: ${data.website || "—"}`,
        "",
        data.message || "(no extra detail)",
      ].join("\n");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());
      if (data.company) return; // honeypot filled — silently drop, tell the bot nothing

      const bad = validate();
      if (bad) {
        setStatus("check the highlighted fields and try again.", "err");
        bad.focus();
        return;
      }

      // Inner pages (towns, services, work) set data-subject on the form so the
      // enquiry arrives labelled with where it came from — "preview request — hatfield".
      const subject = `${form.dataset.subject || "free mockup"} — ${data.business}`;
      setStatus("sending…");
      submit.disabled = true;

      if (ENDPOINT) {
        try {
          const res = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ ...data, subject, _subject: subject, _template: "table", _captcha: "false", _honey: data.company ?? "" }),
          });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          setStatus("got it — i'll come back to you with your mockup this week.", "ok");
        } catch {
          // Never strand the enquiry on a backend failure: fall through to mail.
          location.href = `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(asText(data))}`;
          setStatus(`couldn't send from the page — i've opened your email app instead. or write to ${INBOX}.`, "err");
        } finally {
          submit.disabled = false;
        }
        return;
      }

      location.href = `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(asText(data))}`;
      setStatus(`your email app should open with this filled in — press send and it's with me. if nothing opened, write to ${INBOX}.`, "ok");
      submit.disabled = false;
    });
  }

  /* ---------- hero canvas: pointer-reactive dot field ---------- */
  const canvas = document.getElementById("field");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0, dots = [], running = false, rafId = 0;
    const pointer = { x: -9999, y: -9999 };
    const GAP = 42, R = 240, ACCENT = "216,189,141", DIM = "151,145,138";

    const build = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP)
        for (let x = GAP / 2; x < w; x += GAP)
          dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.x - pointer.x, dy = d.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < R * R) {
          const dist = Math.sqrt(dist2) || 1;
          const force = (R - dist) / R;
          d.vx += (dx / dist) * force * 3.2;
          d.vy += (dy / dist) * force * 3.2;
        }
        d.vx += (d.hx - d.x) * 0.045;
        d.vy += (d.hy - d.y) * 0.045;
        d.vx *= 0.86; d.vy *= 0.86;
        d.x += d.vx; d.y += d.vy;

        const off = Math.min(1, Math.hypot(d.x - d.hx, d.y - d.hy) / 34);
        const size = 1 + off * 3.4;
        ctx.fillStyle = off > 0.06
          ? `rgba(${ACCENT},${0.22 + off * 0.78})`
          : `rgba(${DIM},0.26)`;
        ctx.fillRect(d.x - size / 2, d.y - size / 2, size, size);
      }
      rafId = running ? requestAnimationFrame(step) : 0;
    };

    const setRunning = (on) => {
      if (on === running) return;
      running = on;
      if (on && !rafId) rafId = requestAnimationFrame(step);
      if (!on && rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    };

    build();
    addEventListener("resize", build, { passive: true });
    addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    }, { passive: true });
    addEventListener("pointerleave", () => { pointer.x = pointer.y = -9999; }, { passive: true });

    /* run only while the hero is on screen AND the tab is visible */
    const hero = document.querySelector(".hero");
    let heroVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        heroVisible = e.isIntersecting;
        setRunning(heroVisible && document.visibilityState === "visible");
      }).observe(hero);
    }
    document.addEventListener("visibilitychange", () =>
      setRunning(heroVisible && document.visibilityState === "visible"));
    setRunning(document.visibilityState === "visible");
  }
})();
