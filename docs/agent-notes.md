# Agent Notes

- The site is intentionally kept as a zero-build static bundle: `index.html`, `css/`, and `js/`.
- Runtime-heavy effects are limited to the hero canvas, reveal observers, and lightweight pointer interactions.
- Prefer removing unused CSS/JS before adding new effects so the shipped bundle stays lean.
