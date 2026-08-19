
/* Aero Internet v0.2.0 — independent feature layer */
(() => {
  const VERSION = "0.2.0";
  const $ = (s, r=document) => r.querySelector(s);

  function toast(message) {
    let stack = $(".aero-toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "aero-toast-stack";
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    el.className = "aero-toast";
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  // Keyboard command palette: Ctrl/Cmd + K
  function setupCommandPalette() {
    const overlay = document.createElement("div");
    overlay.className = "aero-command";
    overlay.innerHTML = `
      <div class="aero-command-card" role="dialog" aria-label="Aero command center">
        <input type="search" placeholder="Search Aero Internet…" autocomplete="off">
        <div class="aero-command-list"></div>
      </div>`;
    document.body.appendChild(overlay);

    const input = $("input", overlay);
    const list = $(".aero-command-list", overlay);

    const commands = [
      ["🏠 Home", () => location.hash = ""],
      ["🌐 Explore", () => location.hash = "explore"],
      ["🎵 Aero Radio", () => location.hash = "radio"],
      ["🖼️ Gallery", () => location.hash = "gallery"],
      ["🎮 Games", () => location.hash = "games"],
      ["✨ About Aero Internet", () => location.hash = "about"]
    ];

    function render(filter="") {
      list.innerHTML = "";
      commands
        .filter(([name]) => name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(([name, fn]) => {
          const b = document.createElement("button");
          b.className = "aero-command-item";
          b.textContent = name;
          b.onclick = () => { overlay.classList.remove("open"); fn(); };
          list.appendChild(b);
        });
    }

    input.addEventListener("input", () => render(input.value));
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });
    document.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        overlay.classList.add("open");
        input.value = "";
        render();
        setTimeout(() => input.focus(), 30);
      }
      if (e.key === "Escape") overlay.classList.remove("open");
    });
    window.aeroCommandPalette = () => {
      overlay.classList.add("open");
      render();
      input.focus();
    };
  }

  // Scroll progress
  function setupProgress() {
    const bar = document.createElement("div");
    bar.className = "aero-progress";
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + "%";
    };
    addEventListener("scroll", update, {passive:true});
    addEventListener("resize", update);
    update();
  }

  // Theme preference. Aero Night (dark navy sky) is the default look;
  // press "T" to switch to the original sunny Aero Day palette.
  function setThemeColor(mode) {
    let meta = $('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute("content", mode === "day" ? "#48bdf5" : "#0d1c42");
  }
  function setupThemeShortcut() {
    document.addEventListener("keydown", e => {
      if (e.key.toLowerCase() !== "t" || e.ctrlKey || e.metaKey || e.altKey) return;
      const root = document.documentElement;
      const current = root.dataset.aeroTheme || "night";
      root.dataset.aeroTheme = current === "night" ? "day" : "night";
      localStorage.setItem("aero-theme", root.dataset.aeroTheme);
      setThemeColor(root.dataset.aeroTheme);
      toast(root.dataset.aeroTheme === "night" ? "🌙 Aero Night enabled" : "☀️ Aero Day enabled");
    });
    const saved = localStorage.getItem("aero-theme");
    if (saved) document.documentElement.dataset.aeroTheme = saved;
    setThemeColor(document.documentElement.dataset.aeroTheme || "night");
  }

  // Lightweight offline cache hint. Does not interfere with an existing service worker.
  function setupVersion() {
    document.documentElement.dataset.aeroVersion = VERSION;
    window.AERO_VERSION = VERSION;
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupVersion();
    setupProgress();
    setupCommandPalette();
    setupThemeShortcut();
    setTimeout(() => toast(`✨ Aero Internet v${VERSION}`), 900);
  });
})();
