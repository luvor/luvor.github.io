# Project Notes for AI Agents

- Static portfolio site without build step.
- Main runtime files:
  - `index.html`
  - `css/style.css`
  - `js/main.js`
  - `js/animations.js`
  - `js/gestures.js`
  - `js/particles.js`
- Existing test stack: Playwright (`npm test`).
- Local preview command: `npm run serve`.

## Runtime behavior expectations

- Smooth anchor navigation with active nav highlighting.
- Scroll progress bar and timeline progress update while scrolling.
- Mobile tab bar and context FAB stay synchronized with active section.
- Gallery lightbox supports open/close and arrow-key navigation.
- Hero particle canvas remains interactive and responsive.
