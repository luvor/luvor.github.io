# Overview

The site is built as a static PWA with a single main page and a separate Versions page. There is no bundler and no client-side framework. Every production file is served as-is.

# CSS Architecture

The main stylesheet is organized as 25 conceptual layers, ordered from global foundations to page-specific behavior:

1. Reset
2. Root design tokens
3. Base typography
4. Layout utilities
5. Skip-link and shared utility chrome
6. Scroll progress bar
7. Navigation
8. Hero section
9. Buttons
10. About section
11. Skills section
12. Experience section
13. Projects section
14. Tilt surfaces
15. Education section
16. Gallery section
17. Contact section
18. Lightbox
19. Custom cursor
20. Reveal and keyframe animations
21. Skeleton loading
22. Easter egg UI states (toast, pull-to-refresh, spin reveal)
23. Scrollbars
24. Accessibility and reduced-motion overrides
25. Responsive breakpoints

`/css/versions.css` is isolated so the Versions page does not inherit unrelated portfolio rules.

# JavaScript Modules

- `main.js`: drives scroll progress, active nav state, hero load sequencing, mobile nav, smooth scrolling, lightbox behavior, the desktop cursor loop, tilt motion, and magnetic button hover.
- `animations.js`: splits heading characters into spans, applies staged transition delays, and uses a single `IntersectionObserver` for reveals, photo entry, and stat counters.
- `particles.js`: owns the hero canvas particle system, visibility-aware RAF lifecycle, resize handling, and cached mouse glow rendering.
- `gestures.js`: mobile-only gesture layer for pull-to-refresh, gyroscope parallax, shake-to-contact, lightbox swipes, long-press reveal, and mobile navbar auto-hide.
- `versions.js`: fetches the latest GitHub commits, caches them in `sessionStorage` for five minutes, and renders the timeline or fallback state.

# Performance Decisions

- Scroll work is throttled through `requestAnimationFrame`.
- The custom cursor RAF loop stops once the cursor converges and restarts on the next pointer move.
- Hero particles stop scheduling frames while the document is hidden.
- Reduced-motion mode avoids long-running animation loops and renders static states where possible.
- Section offsets are cached and recalculated on resize/load instead of being measured on every scroll.
- The service worker precaches only the app shell and runtime-caches heavy images.

# Easter Eggs

- Pull-to-refresh toast on touch devices.
- Long-press spin reveal on the hero photo.
- Shake-to-contact shortcut.
- Gyroscope photo parallax on supported mobile devices.

# Deployment Surface

GitHub Pages publishes only:

- `index.html`
- `versions.html`
- `/css`
- `/js`
- `/assets`
- `favicon.svg`
- `manifest.webmanifest`
- `sw.js`

Tests, docs, workflow config, and repository metadata are excluded from the uploaded Pages artifact.
