# Overview

The site is a static PWA with two HTML entry points and no client-side framework. Source files live in the repository root, while the production artifact is generated into `_site` by `scripts/build-site.mjs`.

# CSS Architecture

`/css/style.css` is organized around runtime behavior instead of historical layers:

1. Global reset and tokens.
2. Shared typography and layout primitives.
3. Navigation and scroll chrome.
4. Two-zone hero with a six-work collage, switching to a scroll-snap rail on mobile.
5. Section-specific systems for about, skills, experience, projects, education, evidence, and contact.
6. Shared interaction surfaces such as buttons, cards, cursor, reveals, and scrollbars.
7. Responsive, reduced-motion, print, and standalone-mode overrides.

`/css/versions.css` remains isolated so the Versions page can evolve independently without pulling in the portfolio stylesheet.

# JavaScript Modules

- `main.js`: owns visibility-gated motion playback with a poster fallback, live reduced-motion handling, scroll progress, active section tracking, smooth anchor scrolling, mobile nav state, the idle-stopping cursor loop, lightbox behavior, tilt interaction, magnetic buttons, and mobile navbar auto-hide.
- `animations.js`: applies staggered transition delays to grid children and uses one `IntersectionObserver` for reveal classes.
- `particles.js`: renders the hero background, caches the mouse glow gradient, pauses RAF work while the tab is hidden, and renders a static frame for reduced-motion users.
- `versions.js`: fetches the latest GitHub commits, caches them in `sessionStorage` for five minutes, and renders either the timeline or an error fallback.

# Performance Decisions

- Hero particles stop scheduling animation frames when the document is hidden.
- Reduced-motion mode avoids long-running animation loops and forces static visible states.
- Scroll work is batched through `requestAnimationFrame`.
- Section offsets are cached and recalculated on resize instead of being measured on every scroll event.
- The custom cursor loop stops once the pointer converges and restarts only on the next mouse move.
- The homepage pairs six work previews with a complete nine-case grid. Every case uses a dark, padded media stage with contained imagery (16:10 desktop, 4:3 mobile); the Yasnoten live link stays inside its card.
- Manrope supplies both Latin and Cyrillic headings and body text.
- The build step minifies HTML, CSS, and JavaScript and copies only the files the runtime actually uses.
- The service worker precaches the shell and a small showcase image, and runtime-caches fonts, documents, and images. Video bypasses all service-worker caches.

# Deployment Surface

The deployed bundle contains only:

- `index.html`
- `versions.html`
- `/css/style.css`
- `/css/versions.css`
- `/js/main.js`
- `/js/animations.js`
- `/js/particles.js`
- `/js/versions.js`
- `/js/i18n.js`
- `privacy.html`, `privacy.ru.html`, `licenses.html`, and `use/index.html`
- `.well-known/apple-app-site-association`
- `favicon.svg`
- `manifest.webmanifest`
- `sw.js`
- required icons, the social preview image, dated showcase images, and an optional motion preview

Tests, docs, plans, workflow files, and local tooling stay in the repository but are intentionally excluded from `_site`.
