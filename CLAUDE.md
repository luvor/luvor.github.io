# Project Overview

This repository is a static portfolio and changelog site for Islambek Chynybekov. The main page is `index.html`, the commit-backed history page is `versions.html`, and the production artifact is generated into `_site`.

# Tech Stack

- Plain HTML for structure.
- Two standalone stylesheets: `/css/style.css` and `/css/versions.css`.
- Vanilla JavaScript modules in `/js` for page behavior, reveals, particles, and version history.
- Playwright for regression coverage.
- A Node-based build step that minifies HTML, CSS, and JavaScript into `_site`.
- GitHub Actions for GitHub Pages deployment.

# File Structure

- `/index.html`: main portfolio page.
- `/versions.html`: version history page backed by GitHub commits.
- `/css/style.css`: portfolio styling, layout, motion, and responsive rules.
- `/css/versions.css`: isolated styling for the Versions page.
- `/js/main.js`: navigation state, smooth scrolling, cursor behavior, lightbox, tilt, magnetic buttons, and mobile navbar behavior.
- `/js/animations.js`: reveal orchestration for titles, blocks, cards, and section surfaces.
- `/js/particles.js`: hero canvas particle rendering with visibility-aware RAF management.
- `/js/versions.js`: GitHub commit fetching, sessionStorage caching, and timeline rendering.
- `/scripts/build-site.mjs`: production build script that minifies and copies only shipped assets.
- `/sw.js`: app-shell precache and runtime caching.
- `/tests`: Playwright coverage for accessibility, layout, interactions, mobile behavior, and the Versions page.

# Commands

- `npm run build`: generate the production `_site` bundle.
- `npm test`: run the Playwright suite.
- `npm run test:ui`: open Playwright UI mode.
- `npm run serve`: serve the repository locally on port `3000`.

# Conventions

- Keep runtime code dependency-light and browser-native.
- Treat `_site` as the only deployable artifact; docs, tests, plans, and config must stay out of the shipped bundle.
- Keep implementation notes in Markdown files, not in production HTML/CSS/JS.
- Preserve `prefers-reduced-motion` behavior in both CSS and JavaScript.
- Keep on-page visuals evidence-driven. Prefer structured case-study surfaces over decorative lifestyle imagery.
- Preserve the current visual direction: dark atmosphere, strong typography, cyan-to-amber accents, and a split hero layout.

# Design Tokens

- Primary background: `#05070B`
- Secondary background: `#090D13`
- Primary text: `#EEF2F7`
- Secondary text: `#9BA6B5`
- Accent: `#8BF5D2`
- Warm accent: `#F3B87A`
- Surface: `rgba(15, 21, 29, 0.78)`
- Border: `rgba(255, 255, 255, 0.08)`
- Main easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
