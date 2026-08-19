/* Aero Internet — "Aero Plus" feature pack (v0.3.0)
   Fully independent layer: injects its own DOM/UI at runtime,
   only lightly hooks into window.showPage / Aero.save / the command
   palette (via window.aeroRegisterCommand), so existing files stay untouched. */
(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LS = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  };

  /* ============================================================
     ACHIEVEMENTS
  ============================================================ */
  const ACHIEVEMENTS = [
    { id: "welcome",        icon: "👋", name: "Welcome",        desc: "Открыл Aero Internet впервые." },
    { id: "explorer",       icon: "🗺️", name: "Explorer",       desc: "Заглянул на каждую страницу сайта." },
    { id: "bubble-master",  icon: "🫧", name: "Bubble Master",  desc: "Набрал 20+ очков в Bubble Pop за раунд." },
    { id: "coin-collector", icon: "🪙", name: "Coin Collector", desc: "Накопил 10 Aero Coins." },
    { id: "night-owl",      icon: "🌙", name: "Night Owl",      desc: "Включил Aero Night." },
    { id: "early-bird",     icon: "☀️", name: "Early Bird",     desc: "Вернул Aero Day." },
    { id: "power-user",     icon: "⌨️", name: "Power User",     desc: "Открыл командную панель (⌘/Ctrl+K)." },
    { id: "guestbook",      icon: "📖", name: "Signed In",      desc: "Оставил запись в гостевой книге." },
    { id: "konami",         icon: "🎮", name: "Secret Finder",  desc: "Ввёл секретный код." },
    { id: "loyal",          icon: "🕰️", name: "Loyal Visitor",  desc: "Заходил на сайт 5+ раз." }
  ];
  const PAGES_TO_VISIT = ["home", "explore", "radio", "gallery", "games", "shop", "guestbook"];
  const visited = new Set(LS.get("aeroVisitedPages", []));

  function unlockedMap() { return LS.get("aeroAchievements", {}); }
  function unlock(id) {
    const data = unlockedMap();
    if (data[id]) return;
    data[id] = Date.now();
    LS.set("aeroAchievements", data);
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (a) { window.Aero?.toast?.(`${a.icon} Ачивка: ${a.name}`); }
    renderAchievements();
  }
  function renderAchievements() {
    const grid = $("#achievementsGrid");
    if (!grid) return;
    const data = unlockedMap();
    grid.innerHTML = ACHIEVEMENTS.map(a => {
      const done = !!data[a.id];
      return `<div class="ach-badge ${done ? "unlocked" : "locked"}" title="${a.desc}">
        <span class="ach-icon">${done ? a.icon : "🔒"}</span>
        <b>${a.name}</b><small>${done ? "открыто" : "заблокировано"}</small>
      </div>`;
    }).join("");
    const counter = $("#achCount");
    if (counter) counter.textContent = `${Object.keys(data).length} / ${ACHIEVEMENTS.length}`;
  }
  function trackVisit(page) {
    if (!page) return;
    visited.add(page);
    LS.set("aeroVisitedPages", [...visited]);
    if (PAGES_TO_VISIT.every(p => visited.has(p))) unlock("explorer");
  }

  // Hook page navigation (app.js defines a global `showPage`)
  const _showPage = window.showPage;
  if (typeof _showPage === "function") {
    window.showPage = function (name) { _showPage(name); trackVisit(name); };
  }

  // Hook Aero.save to watch coins / best score / visits
  if (window.Aero && typeof window.Aero.save === "function") {
    const _save = window.Aero.save.bind(window.Aero);
    window.Aero.save = function () {
      _save();
      const s = window.Aero.state;
      if (s.coins >= 10) unlock("coin-collector");
      if (s.best >= 20) unlock("bubble-master");
      if ((s.visits || 0) >= 5) unlock("loyal");
    };
  }

  // Command palette (Ctrl/Cmd+K) achievement
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") unlock("power-user");
  });

  // Theme toggle achievement (reads state set by v0.2.0-features.js's own "t" handler,
  // which always runs first since that script loads before this one)
  document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() !== "t" || e.ctrlKey || e.metaKey || e.altKey) return;
    const theme = document.documentElement.dataset.aeroTheme || "night";
    unlock(theme === "night" ? "night-owl" : "early-bird");
  });

  /* ============================================================
     NAV INJECTION (Guestbook page + links)
  ============================================================ */
  function injectNav() {
    const desktopShop = $('.desktop-nav button[data-page="shop"]');
    if (desktopShop && !$('.desktop-nav button[data-page="guestbook"]')) {
      desktopShop.insertAdjacentHTML("afterend", `<button data-page="guestbook">Guestbook</button>`);
    }
    const mobileShop = $('.mobile-menu button[data-page="shop"]');
    if (mobileShop && !$('.mobile-menu button[data-page="guestbook"]')) {
      mobileShop.insertAdjacentHTML("afterend", `<button data-page="guestbook">📖 Guestbook</button>`);
    }
  }

  function injectGuestbookPage() {
    const app = $("#app");
    if (!app || $("#page-guestbook")) return;
    app.insertAdjacentHTML("beforeend", `
      <section id="page-guestbook" class="page">
        <div class="page-title glass">
          <span class="eyebrow">AERO GUESTBOOK</span><h2>Sign the guestbook 📖</h2>
          <p>Старый добрый Y2K-гестбук. Записи хранятся только в этом браузере — 100% олдскул, 0% сервера.</p>
        </div>
        <div class="guestbook-form glass">
          <input id="gbName" maxlength="24" placeholder="Ваше имя">
          <textarea id="gbMessage" maxlength="180" rows="3" placeholder="Оставьте сообщение..."></textarea>
          <button id="gbSubmit" class="aero-button primary">Оставить запись ✍️</button>
        </div>
        <div id="guestbookList" class="guestbook-list"></div>
      </section>
    `);

    const AVATARS = ["🐬", "🌸", "🛸", "🍧", "🎧", "🌈", "🫧", "🦋", "🌙", "⭐"];
    function loadEntries() { return LS.get("aeroGuestbook", []); }
    function saveEntries(list) { LS.set("aeroGuestbook", list); }
    function renderGuestbook() {
      const list = $("#guestbookList");
      const entries = loadEntries();
      list.innerHTML = "";
      if (!entries.length) {
        list.innerHTML = `<div class="guestbook-empty glass">Пока тихо... Будь первым, кто оставит след 🐾</div>`;
        return;
      }
      entries.slice().reverse().forEach(entry => {
        const card = document.createElement("div");
        card.className = "guestbook-entry glass";
        const avatarSpan = document.createElement("span");
        avatarSpan.className = "gb-avatar";
        avatarSpan.textContent = AVATARS[Math.abs(entry.name.length + entry.ts) % AVATARS.length];
        const body = document.createElement("div");
        const b = document.createElement("b"); b.textContent = entry.name;
        const small = document.createElement("small"); small.textContent = new Date(entry.ts).toLocaleString();
        const p = document.createElement("p"); p.textContent = entry.message;
        body.append(b, small, p);
        card.append(avatarSpan, body);
        list.appendChild(card);
      });
    }
    $("#gbSubmit").addEventListener("click", () => {
      const name = $("#gbName").value.trim() || "Аноним";
      const message = $("#gbMessage").value.trim();
      if (!message) { window.Aero?.toast?.("Напиши что-нибудь для гестбука ✍️"); return; }
      const entries = loadEntries();
      entries.push({ name, message, ts: Date.now() });
      saveEntries(entries);
      $("#gbMessage").value = "";
      renderGuestbook();
      window.Aero?.toast?.("Запись сохранена ✨");
      unlock("guestbook");
    });
    renderGuestbook();
  }

  /* ============================================================
     ACHIEVEMENTS CARD INJECTION (on the Profile page)
  ============================================================ */
  function injectAchievementsCard() {
    const grid = $("#page-profile .profile-grid");
    if (!grid || $("#achievementsGrid")) return;
    grid.insertAdjacentHTML("afterend", `
      <div class="achievements-card glass">
        <div class="achievements-head"><h3>🏅 Ачивки</h3><span id="achCount">0 / ${ACHIEVEMENTS.length}</span></div>
        <div id="achievementsGrid" class="achievements-grid"></div>
      </div>
    `);
    renderAchievements();
  }

  /* ============================================================
     VISITOR ODOMETER (retro footer counter)
  ============================================================ */
  function injectOdometer() {
    const footer = $(".footer");
    if (!footer || $(".visitor-odometer")) return;
    const count = LS.get("aeroOdometer", 100000 + Math.floor(Math.random() * 4000)) + 1;
    LS.set("aeroOdometer", count);
    const digits = String(count).padStart(6, "0").split("").map(d => `<b>${d}</b>`).join("");
    footer.insertAdjacentHTML("beforeend", `<div class="visitor-odometer"><span>👁️ VISITORS</span><div class="odometer">${digits}</div></div>`);
  }

  /* ============================================================
     EXTRAS BUTTON + PANEL
  ============================================================ */
  function toggleTheme() { document.dispatchEvent(new KeyboardEvent("keydown", { key: "t" })); }

  function injectExtras() {
    const actions = $(".top-actions");
    if (!actions || $("#extrasButton")) return;
    const menuBtn = $("#menuButton");
    const btnHtml = `<button id="extrasButton" class="icon-button" aria-label="Aero Extras" title="Aero Extras">✨</button>`;
    if (menuBtn) menuBtn.insertAdjacentHTML("beforebegin", btnHtml);
    else actions.insertAdjacentHTML("beforeend", btnHtml);

    document.body.insertAdjacentHTML("beforeend", `
      <div id="extrasPanel" class="extras-panel glass">
        <h4>Aero Extras</h4>
        <button class="extras-item" id="extraTheme">🌙 Aero Night / Day <span class="es-state">переключить</span></button>
        <button class="extras-item" id="extraSound">🔊 Звуковые эффекты <span class="es-state" id="extraSoundState">выкл</span></button>
        <button class="extras-item" id="extraTrail">🫧 Пузырьки за курсором <span class="es-state" id="extraTrailState">выкл</span></button>
        <button class="extras-item" id="extraSurprise">🎉 Surprise me <span class="es-state">???</span></button>
        <button class="extras-item" id="extraGuestbook">📖 Guestbook <span class="es-state">→</span></button>
        <button class="extras-item" id="extraAchievements">🏅 Achievements <span class="es-state">→</span></button>
      </div>
    `);

    const panel = $("#extrasPanel");
    $("#extrasButton").addEventListener("click", e => { e.stopPropagation(); panel.classList.toggle("open"); });
    document.addEventListener("click", e => {
      if (panel.classList.contains("open") && !panel.contains(e.target) && e.target.id !== "extrasButton") panel.classList.remove("open");
    });
    $("#extraTheme").addEventListener("click", toggleTheme);
    $("#extraGuestbook").addEventListener("click", () => { window.showPage?.("guestbook"); panel.classList.remove("open"); });
    $("#extraAchievements").addEventListener("click", () => { window.showPage?.("profile"); panel.classList.remove("open"); setTimeout(() => $("#achievementsGrid")?.scrollIntoView({ behavior: "smooth", block: "center" }), 250); });
    $("#extraSound").addEventListener("click", () => { setSoundOn(!soundOn); });
    $("#extraTrail").addEventListener("click", () => { setTrailOn(!trailOn); });
    $("#extraSurprise").addEventListener("click", surpriseMe);

    window.aeroRegisterCommand?.("📖 Guestbook", () => (location.hash = "guestbook"));
    window.aeroRegisterCommand?.("🏅 Achievements", () => (location.hash = "profile"));
    window.aeroRegisterCommand?.("✨ Aero Extras", () => panel.classList.add("open"));
  }

  /* ============================================================
     SOUND EFFECTS (synthesized — no audio files needed)
  ============================================================ */
  let soundOn = LS.get("aeroSoundOn", false);
  let actx = null;
  function ensureCtx() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return actx; }
  function blip(freq = 760, dur = 0.09) {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.value = freq;
    o.connect(g); g.connect(ctx.destination);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.03);
  }
  function setSoundOn(v) {
    soundOn = v; LS.set("aeroSoundOn", v);
    const state = $("#extraSoundState"), item = $("#extraSound");
    if (state) state.textContent = v ? "вкл" : "выкл";
    item?.classList.toggle("is-on", v);
    if (v) blip(880);
  }
  document.addEventListener("click", e => {
    if (!soundOn) return;
    const el = e.target.closest("[data-page], .aero-button, .round-button, .icon-button, .zone, .track, .play-button, .extras-item");
    if (el) blip(680 + Math.random() * 260);
  });

  /* ============================================================
     CURSOR BUBBLE TRAIL
  ============================================================ */
  let trailOn = LS.get("aeroTrailOn", false);
  let lastTrail = 0;
  function spawnTrailBubble(x, y) {
    const b = document.createElement("div");
    const size = 10 + Math.random() * 14;
    b.className = "aero-trail-bubble";
    b.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;`;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 720);
  }
  function trailHandler(e) {
    if (!trailOn) return;
    const now = performance.now();
    if (now - lastTrail < 55) return;
    lastTrail = now;
    const point = e.touches ? e.touches[0] : e;
    if (!point) return;
    spawnTrailBubble(point.clientX, point.clientY);
  }
  document.addEventListener("pointermove", trailHandler, { passive: true });
  document.addEventListener("touchmove", trailHandler, { passive: true });
  function setTrailOn(v) {
    trailOn = v; LS.set("aeroTrailOn", v);
    const state = $("#extraTrailState"), item = $("#extraTrail");
    if (state) state.textContent = v ? "вкл" : "выкл";
    item?.classList.toggle("is-on", v);
  }

  /* ============================================================
     SURPRISE ME
  ============================================================ */
  const SURPRISES = [
    "🌈 Aero Internet работает на 60% облаков и 40% оптимизма.",
    "🫧 Где-то сейчас лопнул миллионный пузырь.",
    "☁️ Сегодняшняя погода: солнечно, с шансом глянцевых кнопок.",
    "🛰️ Aero-спутник передаёт привет из невесомости.",
    "🎧 Совет: включи Aero Radio и просто полистай сайт.",
    "💾 Легенды гласят: где-то ещё жив GeoCities."
  ];
  function spawnConfettiRain(count = 26) {
    const colors = ["rgba(255,255,255,.9)", "rgba(150,220,255,.7)", "rgba(255,180,230,.7)", "rgba(180,255,200,.7)"];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const b = document.createElement("div");
        const size = 14 + Math.random() * 22;
        b.className = "aero-confetti-bubble";
        b.style.cssText = `left:${Math.random() * 100}vw;width:${size}px;height:${size}px;background:${colors[i % colors.length]};animation-duration:${2.2 + Math.random() * 1.6}s;`;
        document.body.appendChild(b);
        setTimeout(() => b.remove(), 4200);
      }, i * 40);
    }
  }
  function surpriseMe() {
    spawnConfettiRain(16);
    window.Aero?.toast?.(SURPRISES[Math.floor(Math.random() * SURPRISES.length)]);
    $("#extrasPanel")?.classList.remove("open");
  }

  /* ============================================================
     IDLE SCREENSAVER
  ============================================================ */
  let lastActivity = Date.now();
  const IDLE_LIMIT = 150000; // 2.5 minutes
  ["mousemove", "keydown", "touchstart", "scroll", "click"].forEach(ev =>
    document.addEventListener(ev, () => { lastActivity = Date.now(); }, { passive: true })
  );
  function buildScreensaver() {
    if ($(".aero-screensaver")) return;
    const el = document.createElement("div");
    el.className = "aero-screensaver";
    el.innerHTML = `<div class="ss-logo">🫧</div><p>AERO INTERNET · нажми, чтобы вернуться</p>`;
    for (let i = 0; i < 14; i++) {
      const b = document.createElement("div");
      b.className = "ss-bubble";
      const size = 18 + Math.random() * 60;
      b.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-duration:${9 + Math.random() * 10}s;animation-delay:${-Math.random() * 10}s;`;
      el.appendChild(b);
    }
    el.addEventListener("click", closeScreensaver);
    document.body.appendChild(el);
  }
  function openScreensaver() { buildScreensaver(); requestAnimationFrame(() => $(".aero-screensaver")?.classList.add("open")); }
  function closeScreensaver() { $(".aero-screensaver")?.classList.remove("open"); lastActivity = Date.now(); }
  setInterval(() => {
    if (Date.now() - lastActivity > IDLE_LIMIT && !$(".aero-screensaver.open")) openScreensaver();
  }, 5000);

  /* ============================================================
     KONAMI CODE EASTER EGG
  ============================================================ */
  const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let konamiBuffer = [];
  document.addEventListener("keydown", e => {
    konamiBuffer.push(e.key.toLowerCase());
    konamiBuffer = konamiBuffer.slice(-KONAMI.length);
    if (konamiBuffer.join(",") === KONAMI.join(",")) {
      spawnConfettiRain(40);
      unlock("konami");
      const banner = document.createElement("div");
      banner.className = "aero-secret-banner";
      banner.textContent = "🎉 Секретный код Aero Internet найден!";
      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 3200);
    }
  });

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    injectNav();
    injectGuestbookPage();
    injectAchievementsCard();
    injectOdometer();
    injectExtras();
    setSoundOn(soundOn);
    setTrailOn(trailOn);
    unlock("welcome");
    trackVisit(location.hash.slice(1) || "home");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
