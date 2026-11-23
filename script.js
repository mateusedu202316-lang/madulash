(() => {
  const WHATSAPP = "5541998797859";
  const WA_MSG = "Oi, Madu! Vim pelo site e quero agendar meus cílios ✨";

  const TECH = [
    { name: "Volume Brasileiro", short: "Brasileiro", fan: 2, app: 100, m15: 65, m21: 75, desc: "Fios em Y que preenchem o olhar com leveza. Natural, como se fossem os seus cílios só que muito melhores." },
    { name: "Volume Egípcio", short: "Egípcio", fan: 3, app: 110, m15: 70, m21: 80, desc: "Fios em W com mais preenchimento e textura, sem perder a delicadeza. Destaque na medida pro dia a dia." },
    { name: "Volume Inglês", short: "Inglês", fan: 4, app: 120, m15: 80, m21: 90, desc: "Leques mais cheios pra um olhar intenso e bem desenhado. Volume visível com acabamento macio." },
    { name: "Volume Glamour", short: "Glamour", fan: 6, app: 130, m15: 85, m21: 100, desc: "Máximo preenchimento pra quem ama um olhar poderoso, com efeito de máscara de cílios o tempo todo." },
  ];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = matchMedia("(min-width: 901px)");
  const cursorOn = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const brl = v => `R$ ${v},00`;
  const waLink = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

  /* ---------- links de WhatsApp ---------- */
  const setWa = (a, msg = WA_MSG) => { a.href = waLink(msg); a.target = "_blank"; a.rel = "noopener"; };
  $$("[data-wa]").forEach(a => setWa(a));
  $$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));

  /* ---------- rolagem suave (Lenis) ---------- */
  const lenis = !reduced && window.Lenis ? new window.Lenis({ duration: 1.15, smoothWheel: true }) : null;
  const lockScroll = on => {
    document.body.classList.toggle("is-locked", on);
    if (lenis) on ? lenis.stop() : lenis.start();
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.5 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }));

  /* ---------- intro ---------- */
  const intro = $(".intro");
  if (reduced) {
    document.documentElement.style.setProperty("--hero-delay", "0s");
    intro.remove();
  } else {
    lenis?.stop();
    requestAnimationFrame(() => $(".intro__lash").classList.add("is-drawn"));
    setTimeout(() => {
      intro.classList.add("is-done");
      lenis?.start();
      setTimeout(() => intro.remove(), 1100);
    }, 1050);
  }

  /* ---------- título do hero letra por letra ---------- */
  $$("[data-split]").forEach(el => {
    el.innerHTML = [...el.textContent].map((c, i) => `<span class="ch" style="--i:${i}" aria-hidden="true">${c}</span>`).join("");
  });
  setTimeout(() => $(".hero__lash").classList.add("is-drawn"), reduced ? 0 : 1650);

  /* ---------- leques das técnicas (Y, W, 4D, 6D...) ---------- */
  const makeFan = n => {
    const spread = Math.min(16 * (n - 1), 78);
    let lines = "";
    for (let i = 0; i < n; i++) {
      const a = n === 1 ? 0 : -spread / 2 + (spread / (n - 1)) * i;
      const rad = (a * Math.PI) / 180;
      const len = 78 - Math.abs(a) * 0.25;
      const x = 50 + Math.sin(rad) * len, y = 92 - Math.cos(rad) * len;
      lines += `<line x1="50" y1="92" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" style="--r:${(a / 6).toFixed(1)}deg"/>`;
    }
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${lines}<circle cx="50" cy="92" r="6"/></svg>`;
  };
  $$("[data-fan]").forEach(box => (box.innerHTML = makeFan(+box.dataset.fan)));

  /* ---------- manifesto: separa em palavras ---------- */
  const scrubWords = [];
  $$("[data-scrub]").forEach(p => {
    const label = p.textContent;
    const frag = document.createDocumentFragment();
    p.childNodes.forEach(node => {
      const pink = node.nodeType === 1;
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(" "); return; }
        const w = document.createElement("span");
        w.className = pink ? "w w--pink" : "w";
        w.textContent = part;
        frag.append(w);
        scrubWords.push(w);
      });
    });
    p.replaceChildren(frag);
    p.setAttribute("aria-label", label);
  });
  const scrubEl = $("[data-scrub]");
  if (reduced) scrubWords.forEach(w => w.classList.add("is-lit"));

  /* ---------- reveal ao rolar ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.classList.contains("lash--draw") ? "is-drawn" : "is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal], .lash--draw:not(.hero__lash):not(.intro__lash)").forEach(el => io.observe(el));

  /* ---------- nav: menu mobile ---------- */
  const nav = $(".nav"), burger = $(".nav__burger"), menu = $(".menu");
  const setMenu = open => {
    menu.classList.toggle("is-open", open);
    nav.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.setAttribute("aria-hidden", !open);
    lockScroll(open);
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  $$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (menu.classList.contains("is-open")) setMenu(false);
    closeLightbox();
  });

  const navLinks = $$(".nav__links a");
  const secIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => secIO.observe(s));

  /* ---------- abas de valores ---------- */
  const tabs = $$(".tabs [role=tab]"), pill = $(".tabs__pill");
  const movePill = btn => { pill.style.width = btn.offsetWidth + "px"; pill.style.transform = `translateX(${btn.offsetLeft}px)`; };
  const selectTab = btn => {
    tabs.forEach(t => {
      const on = t === btn;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    movePill(btn);
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", e => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus(); selectTab(next);
    });
  });
  const syncPill = () => movePill($(".tabs [aria-selected=true]"));
  document.fonts?.ready.then(syncPill);
  addEventListener("resize", syncPill);
  syncPill();

  /* ---------- calculadora de manutenção ---------- */
  const calc = $(".calc");
  if (calc) {
    const chips = $$(".calc__chips button", calc), range = $(".calc__range", calc);
    const daysOut = $(".calc__days", calc), result = $(".calc__result", calc);
    const badge = $(".calc__badge", calc), priceEl = $(".calc__price", calc), tip = $(".calc__tip", calc), cta = $(".calc__cta", calc);
    let tech = 0, shown = 65, countRaf = 0;

    const countTo = to => {
      cancelAnimationFrame(countRaf);
      if (reduced) { shown = to; priceEl.textContent = brl(to); return; }
      const from = shown, start = performance.now();
      const step = now => {
        const p = clamp((now - start) / 450, 0, 1);
        shown = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        priceEl.textContent = brl(shown);
        if (p < 1) countRaf = requestAnimationFrame(step);
      };
      countRaf = requestAnimationFrame(step);
    };

    const update = () => {
      const d = +range.value, t = TECH[tech];
      daysOut.textContent = d === 1 ? "1 dia" : `${d} dias`;
      let zone, price;
      if (d <= 15) { zone = "best"; price = t.m15; badge.textContent = "Manutenção até 15 dias"; tip.textContent = "Você está no melhor preço! ✨"; }
      else if (d <= 21) { zone = "mid"; price = t.m21; badge.textContent = "Manutenção 16 a 21 dias"; tip.textContent = "Ainda dá tempo de fazer manutenção, corre!"; }
      else { zone = "new"; price = t.app; badge.textContent = "Aplicação nova"; tip.textContent = "Depois de 21 dias o valor é de aplicação nova."; }
      if (result.dataset.zone !== zone) {
        priceEl.classList.remove("is-bump"); void priceEl.offsetWidth; priceEl.classList.add("is-bump");
      }
      result.dataset.zone = zone;
      if (price !== shown) countTo(price);
      const what = zone === "new" ? `uma aplicação nova de ${t.name}` : `a manutenção do ${t.name} (aplicação há ${d} dias)`;
      setWa(cta, `Oi, Madu! Quero agendar ${what} ✨`);
    };
    chips.forEach(c => c.addEventListener("click", () => {
      tech = +c.dataset.tech;
      chips.forEach(x => x.setAttribute("aria-checked", x === c));
      update();
    }));
    range.addEventListener("input", update);
    update();
  }

  /* ---------- quiz: qual técnica é a sua? ---------- */
  const quiz = $(".quiz__card");
  if (quiz) {
    const QUESTIONS = [
      { q: "Que efeito você quer?", opts: [["Natural, quase imperceptível", 0], ["Marcado, mas delicado", 1], ["Bem cheio e intenso", 2], ["Uau! Volume máximo", 3]] },
      { q: "E a maquiagem no dia a dia?", opts: [["Quase nunca uso", -0.6], ["Uso às vezes", 0], ["Amo um make marcado", 0.6]] },
      { q: "Já fez extensão de cílios?", opts: [["Nunca, é minha primeira vez", -0.4], ["Já fiz e amei", 0.2]] },
    ];
    const stage = $(".quiz__stage", quiz), bar = $(".quiz__bar span", quiz), count = $(".quiz__count", quiz);
    let step = 0, score = 0;

    const swap = html => {
      const go = () => {
        stage.innerHTML = html;
        stage.classList.remove("quiz__anim-out");
        stage.classList.add("quiz__anim-in");
        stage.addEventListener("animationend", () => stage.classList.remove("quiz__anim-in"), { once: true });
        bindStage();
      };
      if (reduced || !stage.innerHTML) return go();
      stage.classList.add("quiz__anim-out");
      setTimeout(go, 280);
    };

    const renderQuestion = () => {
      const { q, opts } = QUESTIONS[step];
      count.innerHTML = `Pergunta <b>${step + 1}</b> de ${QUESTIONS.length}`;
      bar.style.width = `${(step / QUESTIONS.length) * 100}%`;
      swap(`<h3 class="quiz__q">${q}</h3><div class="quiz__opts">${opts.map(([label, v], i) =>
        `<button class="quiz__opt" data-v="${v}"><i>${"ABCD"[i]}</i>${label}</button>`).join("")}</div>`);
    };

    const burst = origin => {
      if (reduced) return;
      const r = quiz.getBoundingClientRect(), o = origin.getBoundingClientRect();
      const cx = o.left - r.left + o.width / 2, cy = o.top - r.top + o.height / 2;
      const colors = ["#FF4F9A", "#FFC7DE", "#141014"];
      for (let i = 0; i < 22; i++) {
        const s = document.createElement("span");
        s.className = "burst";
        s.style.cssText = `left:${cx}px;top:${cy}px;background:${colors[i % 3]}`;
        quiz.append(s);
        const ang = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 160;
        s.animate([
          { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) scale(.3)`, opacity: 0 },
        ], { duration: 900 + Math.random() * 400, easing: "cubic-bezier(.16,1,.3,1)" }).onfinish = () => s.remove();
      }
    };

    const renderResult = () => {
      const t = TECH[clamp(Math.round(score), 0, 3)];
      count.innerHTML = "Resultado";
      bar.style.width = "100%";
      swap(`<div class="quiz__result">
          <div class="tcard__fan">${makeFan(t.fan)}</div>
          <p class="note">a sua é...</p>
          <h3 class="quiz__name">${t.name}</h3>
          <p class="quiz__desc">${t.desc}</p>
          <p class="quiz__price">aplicação <strong>${brl(t.app)}</strong></p>
          <div class="quiz__actions">
            <a class="tag" href="${waLink(`Oi, Madu! Fiz o teste no site e deu ${t.name}. Quero agendar minha avaliação ✨`)}" target="_blank" rel="noopener">Quero essa!</a>
            <button class="quiz__redo">Refazer teste ↺</button>
          </div>
        </div>`);
      setTimeout(() => burst($(".quiz__name", quiz) || quiz), reduced ? 0 : 420);
    };

    function bindStage() {
      $$(".quiz__opt", stage).forEach(btn => btn.addEventListener("click", () => {
        btn.classList.add("is-picked");
        score += +btn.dataset.v;
        step++;
        setTimeout(() => (step < QUESTIONS.length ? renderQuestion() : renderResult()), reduced ? 0 : 220);
      }));
      $(".quiz__redo", stage)?.addEventListener("click", () => { step = 0; score = 0; renderQuestion(); });
      $$(".tag", stage).forEach(enableMagnet);
    }
    renderQuestion();
  }

  /* ---------- lightbox ---------- */
  const lb = $(".lightbox"), lbImg = $("img", lb);
  let lastFocus = null;
  function closeLightbox() {
    if (lb.hidden) return;
    lb.classList.remove("is-open");
    setTimeout(() => { lb.hidden = true; }, 300);
    lockScroll(false);
    lastFocus?.focus();
  }
  $$("[data-full]").forEach(btn => btn.addEventListener("click", () => {
    lastFocus = btn;
    lbImg.src = btn.dataset.full;
    lbImg.alt = btn.getAttribute("aria-label").replace("Ampliar foto: ", "");
    lb.hidden = false;
    lockScroll(true);
    requestAnimationFrame(() => lb.classList.add("is-open"));
    $(".lightbox__close").focus();
  }));
  lb.addEventListener("click", e => { if (e.target !== lbImg) closeLightbox(); });

  /* ---------- PC: cursor, botões magnéticos e cards 3D ---------- */
  const cursor = $(".cursor");
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 }, ring = { x: mouse.x, y: mouse.y };

  function enableMagnet(el) {
    if (!cursorOn || el.dataset.magnet !== undefined) return;
    el.dataset.magnet = "";
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(e.clientX - r.left - r.width / 2) * 0.28}px`);
      el.style.setProperty("--my", `${(e.clientY - r.top - r.height / 2) * 0.4}px`);
    });
    el.addEventListener("mouseleave", () => { el.style.setProperty("--mx", "0px"); el.style.setProperty("--my", "0px"); });
  }

  if (cursorOn) {
    document.documentElement.classList.add("has-cursor");
    const dot = $(".cursor__dot"), ringEl = $(".cursor__ring");
    addEventListener("mousemove", e => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      cursor.classList.remove("is-hidden");
    });
    document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("mouseover", e => {
      const view = e.target.closest("[data-cursor='ver']");
      cursor.classList.toggle("is-view", !!view);
      cursor.classList.toggle("is-link", !view && !!e.target.closest("a, button, input, label"));
    });
    cursor.ring = ringEl;

    $$(".tag, .fab, .link-arrow").forEach(enableMagnet);

    const tilt = (el, max, lift = 0) => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(${lift}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    };
    $$(".tcard:not(.tcard--cta)").forEach(c => tilt(c, 12, -10));
    tilt($(".hero__media"), 8);
  }

  /* ---------- técnicas: scroll horizontal fixado (PC) ---------- */
  const tech = $(".tech"), track = $(".tech__track"), viewport = $(".tech__viewport");
  let techDist = 0;
  const layoutTech = () => {
    if (desktop.matches && !reduced) {
      techDist = Math.max(0, track.scrollWidth - viewport.clientWidth);
      tech.style.height = innerHeight + techDist + "px";
    } else {
      techDist = 0;
      tech.style.height = "";
      track.style.transform = "";
    }
    lenis?.resize();
  };

  /* ---------- loop de animação ---------- */
  const progress = $(".progress span"), fab = $(".fab");
  const parallaxEls = $$("[data-parallax]").map(el => ({ el, s: +el.dataset.parallax }));
  const driftEls = $$("[data-drift]").map(el => ({ el, s: +el.dataset.drift }));
  const floatEls = $$("[data-float]").map((el, i) => ({ el, s: [0.18, -0.12, 0.26, -0.2, 0.14][i % 5] }));
  const marquees = $$("[data-marquee]").map(m => ({ track: $(".marquee__track", m), dir: +m.dataset.marquee, x: 0 }));

  let lastY = scrollY, velocity = 0, scrollDir = 1, finalVisible = false;
  new IntersectionObserver(([e]) => { finalVisible = e.isIntersecting; }, { threshold: 0.3 }).observe($("#contato"));

  const inView = r => r.bottom > -200 && r.top < innerHeight + 200;

  function frame(time) {
    lenis?.raf(time);
    const y = scrollY, vh = innerHeight;
    const dy = y - lastY;
    lastY = y;
    if (dy) scrollDir = dy > 0 ? 1 : -1;
    velocity += (Math.abs(dy) - velocity) * 0.15;

    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    nav.classList.toggle("is-solid", y > 30);
    if (!menu.classList.contains("is-open")) {
      if (dy > 2 && y > vh * 0.8) nav.classList.add("is-hidden");
      else if (dy < -2) nav.classList.remove("is-hidden");
    }
    fab.classList.toggle("is-visible", y > vh * 0.7 && !finalVisible);

    if (cursorOn && cursor.ring) {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      cursor.ring.style.transform = `translate3d(${ring.x.toFixed(1)}px, ${ring.y.toFixed(1)}px, 0)`;
    }

    if (!reduced) {
      parallaxEls.forEach(({ el, s }) => {
        const r = el.parentElement.getBoundingClientRect();
        if (!inView(r)) return;
        el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * s).toFixed(1)}px, 0)`;
      });
      driftEls.forEach(({ el, s }) => {
        const r = el.parentElement.getBoundingClientRect();
        if (!inView(r)) return;
        const base = el.classList.contains("final__bgword") ? " translateY(-50%)" : "";
        el.style.transform = `translate3d(${((r.top + r.height / 2 - vh / 2) * s).toFixed(1)}px, 0, 0)${base}`;
      });
      floatEls.forEach(({ el, s }) => {
        const r = el.parentElement.getBoundingClientRect();
        if (!inView(r)) return;
        el.style.transform = `translate3d(0, ${(r.top * s).toFixed(1)}px, 0)`;
      });
      marquees.forEach(m => {
        const half = m.track.scrollWidth / 2;
        m.x -= (0.6 + Math.min(velocity, 60) * 0.25) * m.dir * scrollDir;
        if (m.x <= -half) m.x += half;
        if (m.x > 0) m.x -= half;
        m.track.style.transform = `translate3d(${m.x.toFixed(1)}px, 0, 0)`;
      });
      if (scrubEl) {
        const r = scrubEl.getBoundingClientRect();
        if (inView(r)) {
          const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3), 0, 1);
          const lit = Math.round(p * scrubWords.length);
          scrubWords.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
        }
      }
      if (techDist) {
        const r = tech.getBoundingClientRect();
        const p = clamp(-r.top / techDist, 0, 1);
        track.style.transform = `translate3d(${(-p * techDist).toFixed(1)}px, 0, 0)`;
      }
    }
    requestAnimationFrame(frame);
  }

  layoutTech();
  document.fonts?.ready.then(layoutTech);
  addEventListener("load", layoutTech);
  addEventListener("resize", layoutTech);
  desktop.addEventListener("change", layoutTech);
  requestAnimationFrame(frame);
})();
