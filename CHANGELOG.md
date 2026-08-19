# Aero Internet v0.2.0

## New
- Command Center with Ctrl/Cmd + K.
- Scroll progress indicator.
- Aero Day/Night preference shortcut (`T`) stored locally.
- Version marker (`0.2.0`).
- Toast notifications.
- Dedicated feature CSS/JS layer so existing site logic is minimally disturbed.
- Responsive behavior for the new overlays and notifications.

## Monetization-ready foundation
- Feature layer is isolated, leaving clean places for future ad containers.
- No advertising network or tracking code is added yet.

## v0.2.1
- New default look: deep navy Aero Night sky (gradient background) instead of the plain light sky.
- Added a starfield + a soft drifting pink/blue aurora glow behind the glass panels.
- Sun reworked into a glowing "Aero Moon"; clouds, hills and water re-tinted for night.
- The existing `T` shortcut now actually works: it toggles between Aero Night (default) and the original Aero Day palette, with a matching browser theme-color swap.
- Glass panels get a touch more opacity so text stays crisp over the darker sky.

## v0.3.0 — "Aero Plus"
Big fun-pack update, added as a fully isolated feature layer (`css/aero-plus.css`, `js/aero-plus.js`) — existing files barely touched.

**New**
- 🏅 **Achievements system** — 10 unlockable badges (Explorer, Bubble Master, Night Owl, Secret Finder, etc.), shown as a shelf on the Profile page with live progress counter.
- 📖 **Guestbook** — a real Y2K-style guestbook page. Visitors sign with a name + message, saved locally per-browser. New nav link on desktop and mobile.
- 👁️ **Retro visitor odometer** — a rolling 6-digit counter in the footer, straight out of 1999.
- ✨ **Aero Extras panel** — new topbar button that opens a quick menu: toggle Aero Night/Day (works without a keyboard — important on mobile!), toggle sound effects, toggle cursor bubbles, "Surprise me", and quick links to the Guestbook and Achievements.
- 🔊 **Synthesized sound effects** (optional, off by default) — soft blips on buttons/nav/zones, generated with the Web Audio API, no audio files needed.
- 🫧 **Cursor bubble trail** (optional, off by default) — tiny bubbles follow your finger/cursor when enabled.
- 💤 **Idle screensaver** — after ~2.5 minutes of inactivity, a drifting-bubbles screensaver appears; tap/click to dismiss.
- 🎮 **Konami code easter egg** (↑↑↓↓←→←→ b a) — triggers a bubble-rain celebration and a hidden achievement.
- Command palette (Ctrl/Cmd+K) extended with Guestbook, Achievements, and Aero Extras entries.
