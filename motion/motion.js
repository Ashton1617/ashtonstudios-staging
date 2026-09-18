/* Ashton Studios Motion — interaction layer (vanilla, no deps)
   Mirrors ../app.js in shape (motion arming, reveals, band, ticker skew, the
   FormSubmit enquiry) and adds the two things this page owns: the pinned phone
   stage and the ads themselves. */
(() => {
  const doc = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = matchMedia("(max-width: 760px)").matches;

  if (reduceMotion) doc.classList.add("no-motion");
  if (reduceMotion || narrow) doc.classList.add("no-pin");

  const arm = () => doc.classList.add("motion-armed");
  if (!reduceMotion) {
    if (document.visibilityState === "visible") requestAnimationFrame(arm);
    else document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") arm();
    }, { once: true });
    setTimeout(arm, 2500);
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
    setTimeout(() => revealables.forEach((el) => el.classList.add("revealed")), 3200);
  } else {
    revealables.forEach((el) => el.classList.add("revealed"));
  }

  /* ---------- the pinned stage ----------
     One number, --p, drives everything: copy exit, the phones flattening from
     a fan into a row, captions rising, the progress hairline. The value is
     eased toward the scroll target each frame so a fast wheel flick still
     reads as the phones settling onto the desk rather than snapping. */
  const stage = document.querySelector(".stage");
  const sticky = document.querySelector(".stage-sticky");
  const bar = document.getElementById("stageBar");
  if (stage && sticky && !doc.classList.contains("no-pin")) {
    let start = 0, span = 1, target = 0, current = 0, raf = 0;

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      start = rect.top + scrollY;
      span = Math.max(1, stage.offsetHeight - innerHeight);
    };
    const frame = () => {
      current += (target - current) * 0.11;
      if (Math.abs(target - current) < 0.0015) current = target;
      sticky.style.setProperty("--p", current.toFixed(4));
      if (bar) bar.style.transform = `scaleX(${current.toFixed(4)})`;
      raf = current !== target ? requestAnimationFrame(frame) : 0;
    };
    const onScroll = () => {
      /* the phones finish moving at 78% of the section so the settled row
         holds for the last stretch before the page moves on */
      const raw = (scrollY - start) / (span * 0.78);
      target = Math.min(1, Math.max(0, raw));
      if (!raf) raf = requestAnimationFrame(frame);
    };

    measure();
    addEventListener("resize", () => { measure(); onScroll(); }, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- the ads ----------
     Play muted while on screen, pause off screen, never fetch more than the
     metadata until a phone is actually visible. A tap on a phone (or its
     sound button) unmutes that one and mutes the rest; tapping again mutes.
     Under reduced motion nothing autoplays: the first tap starts the ad with
     sound. */
  const ads = [...document.querySelectorAll("video.ad")];
  const setLoud = (video, loud) => {
    video.muted = !loud;
    const phone = video.closest(".phone");
    const btn = phone && phone.querySelector(".sound");
    phone && phone.classList.toggle("is-loud", loud);
    if (btn) {
      btn.setAttribute("aria-pressed", loud ? "true" : "false");
      btn.setAttribute("aria-label", `${loud ? "mute" : "unmute"} the ${video.dataset.name} ad`);
    }
  };
  const toggle = (video) => {
    /* the generic samples carry no voiceover: a tap just makes sure they play */
    if (video.hasAttribute("data-silent")) { if (video.paused) video.play().catch(() => {}); return; }
    const wantLoud = video.muted;
    for (const other of ads) if (other !== video) setLoud(other, false);
    setLoud(video, wantLoud);
    if (video.paused) video.play().catch(() => {});
  };
  for (const video of ads) {
    video.addEventListener("click", () => toggle(video));
    const btn = video.parentElement.querySelector(".sound");
    if (btn) btn.addEventListener("click", (e) => { e.stopPropagation(); toggle(video); });
    /* if a video fails to load, keep the poster — never a black frame */
    video.addEventListener("error", () => { video.removeAttribute("autoplay"); }, { once: true });
  }
  const inView = new Set();
  const playVisible = () => {
    if (document.visibilityState !== "visible") return;
    for (const v of inView) v.play().catch(() => {});
  };
  if ("IntersectionObserver" in window && !reduceMotion) {
    const vio = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const v = e.target;
        if (e.isIntersecting) {
          inView.add(v);
          if (v.preload !== "auto") v.preload = "auto";
        } else {
          inView.delete(v);
          if (!v.paused) v.pause();
        }
      }
      playVisible();
    }, { threshold: 0.35 });
    ads.forEach((v) => vio.observe(v));
  }
  /* a backgrounded tab pauses every ad; coming back resumes the ones on screen */
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") ads.forEach((v) => !v.paused && v.pause());
    else playVisible();
  });

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

  /* ---------- enquiry form ----------
     Same FormSubmit account as the main site. With JS: POST to the AJAX
     endpoint, no reload, inline confirmation. Without JS, or if the AJAX
     call fails: the form's own action posts to FormSubmit, which delivers
     the same email and returns the visitor to this page at #sent. */
  const ENDPOINT = "https://formsubmit.co/ajax/james@ashtonstudios.uk";
  const INBOX = "james@ashtonstudios.uk";
  const form = document.getElementById("enquiryForm");
  const status = document.getElementById("formStatus");
  const setStatus = (msg, state) => {
    if (!status) return;
    status.textContent = msg;
    if (state) status.dataset.state = state; else delete status.dataset.state;
  };

  if (location.hash === "#sent") {
    setStatus("got it — i'll come back to you with your preview soon.", "ok");
  }

  if (form) {
    const submit = form.querySelector("button[type=submit]");
    const showError = (input, on) => {
      const err = input.getAttribute("aria-describedby");
      const box = err && document.getElementById(err);
      input.setAttribute("aria-invalid", on ? "true" : "false");
      if (box) box.hidden = !on;
    };
    const validate = () => {
      let firstBad = null;
      for (const input of form.querySelectorAll("input[required]")) {
        const ok = input.value.trim() !== "" && input.checkValidity();
        showError(input, !ok);
        if (!ok && !firstBad) firstBad = input;
      }
      return firstBad;
    };
    form.addEventListener("input", (e) => {
      const el = e.target;
      if (el.hasAttribute("required") && el.getAttribute("aria-invalid") === "true") {
        if (el.value.trim() !== "" && el.checkValidity()) showError(el, false);
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (data._honey) return; // honeypot filled — drop it, tell the bot nothing

      const bad = validate();
      if (bad) {
        setStatus("check the highlighted fields and try again.", "err");
        bad.focus();
        return;
      }

      setStatus("sending…");
      submit.disabled = true;
      const subject = `motion enquiry — ${data.business}`;
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            business: data.business, name: data.name, email: data.email, phone: data.phone,
            website: data.website, what_you_do: data.what_you_do,
            subject, _subject: subject, _template: "table", _captcha: "false", _honey: "",
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus("got it — i'll cut your preview from your website and send it back soon.", "ok");
        submit.disabled = false;
      } catch {
        /* never strand the enquiry: hand it to FormSubmit's ordinary POST,
           which delivers the same email and returns the visitor to #sent */
        setStatus("sending the long way round…");
        form.submit();
      }
    });
  }
})();
