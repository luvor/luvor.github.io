# Project Overview

This repository is a static personal portfolio for Islambek Chynybekov. It is intentionally simple: plain HTML, CSS, and vanilla JavaScript served directly from GitHub Pages with a service worker for PWA support.

# Tech Stack

- HTML for structure and content.
- One main stylesheet at `/css/style.css`.
- Vanilla JavaScript modules in `/js` for animation, interaction, gestures, and the Versions page.
- Playwright for regression coverage.
- GitHub Actions for Pages deployment.

# File Structure

- `/index.html`: main portfolio page.
- `/versions.html`: GitHub-backed version history page.
- `/css/style.css`: primary portfolio styling and motion system.
- `/css/versions.css`: standalone styling for the Versions page.
- `/js/main.js`: navigation, scroll state, cursor, lightbox, and hover interactions.
- `/js/animations.js`: character splitting, reveal orchestration, and counters.
- `/js/particles.js`: hero canvas rendering.
- `/js/gestures.js`: mobile gestures and easter eggs.
- `/js/versions.js`: commit fetching, sessionStorage caching, and timeline rendering.
- `/sw.js`: precache and runtime caching.
- `/tests`: Playwright coverage for desktop, mobile, accessibility, interactions, and versions.

# Commands

- `npm test`: run the Playwright suite.
- `npm run test:ui`: open Playwright UI mode.
- `npm run serve`: serve the site locally on port `3000`.

# Conventions

- Keep the site dependency-light. Prefer native browser APIs over new packages.
- Preserve the dark visual language and existing design tokens unless the task explicitly changes them.
- Respect `prefers-reduced-motion` in both CSS and JavaScript.
- Add direct asset references instead of introducing a bundling step.
- Treat `/assets`, `/css`, `/js`, `index.html`, `versions.html`, `manifest.webmanifest`, and `sw.js` as the production surface shipped to Pages.

# Design Tokens

- Primary background: `#000000`
- Secondary background: `#0A0A0A`
- Primary text: `#F5F5F7`
- Secondary text: `#A1A1AA`
- Accent: `#A78BFA`
- Secondary accent: `#00FFE0`
- Surface: `rgba(255, 255, 255, 0.03)`
- Border: `rgba(255, 255, 255, 0.06)`
- Main easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
