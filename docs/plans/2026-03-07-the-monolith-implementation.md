# The Monolith: Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete teardown and rebuild of luvor.github.io portfolio with "Dark Architect" aesthetic — typography-driven, cyan/violet palette, zero dependencies, Lighthouse 100.

**Architecture:** Vanilla HTML/CSS/JS, single-page, PWA. CSS organized by layer (tokens > layout > components > motion > responsive). JS in 4 IIFE modules. GitHub Pages deploy.

**Tech Stack:** HTML5, CSS3 (custom properties, scroll-driven animations, clip-path), vanilla JS (IntersectionObserver, RAF, Canvas API), Playwright for testing.

**Design Reference:** `docs/plans/2026-03-07-the-monolith-redesign.md` — consult for full color values, spacing tokens, and section specifications.

---

## Phase 1: Foundation

### Task 1: Rewrite index.html with new structure

**Files:**
- Rewrite: `index.html`

**Step 1: Write the new HTML**

Complete rewrite. Key structural changes from current:
- Hero: NO split layout, NO photo. Just name + subtitle + CTAs centered.
- About: Asymmetric grid (text 60%, photo 40%). Photo wrapped in clip-path reveal container.
- Skills: 2x2 typographic grid with `<dl>` semantics, no cards, no icons.
- Experience: Full-width stacking cards with company watermark `<span>`.
- Projects: Alternating image/content layout (not bento grid).
- Gallery: Horizontal scroll container.
- Contact: Merged with footer. Email as focal point.
- Remove: ambient orbs, noise overlay, mobile tab bar, context FAB.
- Add: JSON-LD structured data in `<head>`.
- Add: `<div id="custom-cursor">` for desktop cursor dot.
- Keep: skip-link, scroll-progress, lightbox, nav (simplified).
- Update all `aria-hidden`, `role`, `aria-label` attributes.
- Gallery items: add `role="button"` and `tabindex="0"`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Islambek Chynybekov — Senior Frontend Engineer & AI Engineer</title>
  <meta name="description" content="...">
  <meta name="theme-color" content="#000000">
  <!-- Favicon, PWA, OG, Twitter tags (update OG image URL) -->
  <!-- Preconnect + Inter font (keep weights 200;400;500;600;700;900) -->
  <link rel="stylesheet" href="css/style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Islambek Chynybekov",
    "jobTitle": "Senior Frontend Engineer & AI Engineer",
    "url": "https://luvor.github.io",
    "sameAs": [
      "https://github.com/luvor",
      "https://www.linkedin.com/in/luvor"
    ]
  }
  </script>
</head>
```

Key section structures (abbreviated):

**Hero** — centered, no image:
```html
<section id="hero" class="hero">
  <canvas id="hero-canvas" aria-hidden="true"></canvas>
  <div class="hero-content">
    <div class="hero-badge"><span class="badge-dot"></span>Available for work</div>
    <h1 class="hero-name" aria-label="Islambek Chynybekov">
      <span class="char-stagger" data-text="ISLAMBEK">ISLAMBEK</span>
      <span class="char-stagger" data-text="CHYNYBEKOV">CHYNYBEKOV</span>
    </h1>
    <p class="hero-subtitle">Senior Frontend Engineer & AI Integrator<br>
      building <em>intelligent products</em> that matter.</p>
    <div class="hero-actions">
      <a href="#projects" class="btn btn-primary">View Work ...</a>
      <a href="#contact" class="btn btn-ghost">Get in Touch</a>
    </div>
    <div class="scroll-indicator" aria-hidden="true"><div class="scroll-line"></div></div>
  </div>
</section>
```

**Skills** — typographic grid:
```html
<section id="skills" class="section">
  <div class="container">
    <span class="section-label">Skills & Tools</span>
    <h2 class="section-title">Technologies I work with</h2>
    <div class="skills-grid">
      <div class="skill-group">
        <h3 class="skill-group-name">Frontend</h3>
        <hr class="skill-rule">
        <ul class="skill-list">
          <li>Vue 3 / Nuxt 3</li>
          <!-- ... -->
        </ul>
      </div>
      <!-- 3 more groups -->
    </div>
  </div>
</section>
```

**Experience** — full-width cards with watermark:
```html
<div class="experience-card">
  <span class="experience-watermark" aria-hidden="true">HALYK</span>
  <div class="experience-content">
    <span class="experience-date">Jan 2024 — Present</span>
    <h3 class="experience-role">Team Lead Frontend</h3>
    <p class="experience-company">Halyk Finservice</p>
    <p class="experience-desc">...</p>
    <div class="experience-tags"><span>Vue 3</span>...</div>
  </div>
</div>
```

**Gallery** — horizontal scroll:
```html
<div class="gallery-scroll">
  <div class="gallery-item" role="button" tabindex="0" aria-label="Adventure mode">
    <img src="..." alt="..." loading="lazy">
    <span class="gallery-caption">Adventure mode</span>
  </div>
  <!-- ... -->
</div>
```

**Contact** — merged with footer:
```html
<section id="contact" class="section contact">
  <div class="container">
    <h2 class="section-title">Let's build something<br><span class="gradient-text">amazing together</span></h2>
    <a href="mailto:formalibus@gmail.com" class="contact-email">formalibus@gmail.com</a>
    <div class="contact-links">
      <a href="...">LinkedIn <span>&rarr;</span></a>
      <a href="...">GitHub <span>&rarr;</span></a>
    </div>
    <p class="copyright">&copy; 2026 Islambek Chynybekov</p>
  </div>
</section>
```

**Step 2: Verify HTML loads without errors**

Run: `npx serve . -p 3000 -s &` then open in browser.
Expected: Page loads, all content visible (unstyled).

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite HTML structure for Monolith redesign"
```

---

### Task 2: CSS Design Tokens + Reset + Typography

**Files:**
- Rewrite: `css/style.css` (start fresh, build layer by layer)

**Step 1: Write CSS layers 1-3 (Reset, Tokens, Typography)**

```css
/* Layer 1: Reset */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
/* ... standard reset ... */

/* Layer 2: Design Tokens */
:root {
  --color-bg: #000000;
  --color-bg-secondary: #0A0A0A;
  --color-text: #F5F5F7;
  --color-text-secondary: #A1A1AA;
  --color-text-tertiary: #52525B;
  --color-accent: #A78BFA;
  --color-cyan: #00FFE0;
  --color-gradient: linear-gradient(135deg, #00FFE0, #A78BFA);
  --color-gradient-text: linear-gradient(90deg, #00FFE0, #A78BFA);
  --color-surface: rgba(255,255,255,0.03);
  --color-border: rgba(255,255,255,0.06);
  --color-border-hover: rgba(255,255,255,0.12);
  /* ... all tokens from design doc ... */
}

/* Layer 3: Typography */
body { font-family: 'Inter', -apple-system, ...; font-size: var(--font-size-base); color: var(--color-text); background: var(--color-bg); }
.hero-name { font-size: clamp(4rem, 12vw, 12rem); font-weight: 900; letter-spacing: -0.06em; line-height: 0.9; }
.section-title { font-size: clamp(2rem, 5vw, 4rem); font-weight: 200; letter-spacing: -0.02em; line-height: 1.1; }
.section-label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-accent); }
.gradient-text { background: var(--color-gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
```

**Step 2: Verify tokens render correctly**

Run: refresh browser on localhost:3000.
Expected: Black background, white text, correct font sizes, gradient text works.

**Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add design tokens, reset, and typography system"
```

---

## Phase 2: Section Styles

### Task 3: Hero section CSS + page load animation

**Files:**
- Modify: `css/style.css` (append hero styles)

**Step 1: Write hero CSS**

Key elements:
- Full viewport centered layout (flexbox, not grid)
- `#hero-canvas` absolute positioned behind
- `.hero-name` massive centered text
- `.hero-badge` minimal pill, bottom-left or above title
- `.hero-actions` flex row centered
- `.scroll-indicator` thin animated line at bottom
- Page load sequence: `body.hero-load` hides elements, `body.hero-revealed` transitions them in with staggers
- `.char-stagger span` — each character as inline-block for animation

**Step 2: Verify hero fills viewport with correct typography**

Expected: Name fills screen, centered, badge above, buttons below, scroll line at bottom.

**Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add hero section styles and load animation"
```

---

### Task 4: About section CSS with photo clip-path reveal

**Files:**
- Modify: `css/style.css` (append about styles)

**Step 1: Write about CSS**

Key elements:
- Asymmetric grid: `grid-template-columns: 1.2fr 0.8fr`
- Photo wrapper with `clip-path: circle(0% at 50% 50%)` initial state
- `.photo-revealed` class: `clip-path: circle(75% at 50% 50%)`
- Stats grid below photo with flip-counter styling
- Section title in weight 200
- Tags: no border, `padding: 4px 12px`, subtle violet bg on hover

**Step 2: Verify about layout and photo container**

Expected: Two-column layout, photo area visible (clip-path will be animated by JS later).

**Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add about section styles with clip-path photo reveal"
```

---

### Task 5: Skills, Education, Gallery, Contact CSS

**Files:**
- Modify: `css/style.css` (append remaining section styles)

**Step 1: Write skills CSS**

- 2x2 grid, `gap: 3rem`
- `.skill-group-name`: weight 600, secondary color
- `.skill-rule`: 1px solid `var(--color-border)`, margin bottom
- `.skill-list li`: flex with violet dot, secondary text color
- Hover: category highlights, others dim (`.skill-group:hover ~ .skill-group { opacity: 0.4 }` via CSS `:has()` or JS class)

**Step 2: Write education CSS**

- 3-column grid
- Cards: surface bg, subtle border, top gradient line (2px, `var(--color-gradient)`, `opacity: 0` default, `1` on hover)
- Hover: 4px lift, border glow

**Step 3: Write gallery CSS**

- `.gallery-scroll`: `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 1.5rem; padding: 0 calc((100vw - 1200px) / 2);`
- `.gallery-item`: `flex: 0 0 400px; scroll-snap-align: center; border-radius: var(--radius-lg); overflow: hidden; position: relative; cursor: pointer; aspect-ratio: 3/4;`
- Caption: absolute bottom, `transform: translateY(100%)`, transitions up on hover
- Hide scrollbar: `scrollbar-width: none; &::-webkit-scrollbar { display: none; }`

**Step 4: Write contact CSS**

- Centered, max-width 700px
- `.contact-email`: massive text `clamp(1.5rem, 4vw, 3rem)`, gradient, magnetic hover target
- `.contact-links a`: inline, minimal, with arrow
- `.copyright`: tertiary color, small, margin-top 4rem

**Step 5: Verify all sections render**

Expected: All sections visible with correct layouts.

**Step 6: Commit**

```bash
git add css/style.css
git commit -m "feat: add skills, education, gallery, and contact section styles"
```

---

### Task 6: Experience + Projects section CSS

**Files:**
- Modify: `css/style.css` (append)

**Step 1: Write experience CSS**

- `.experience-card`: full-width, position relative, padding 3rem, surface bg, left gradient border 2px
- `.experience-watermark`: position absolute, font-size 15vw, weight 900, opacity 0.04, top 50% transform translateY(-50%), pointer-events none, overflow hidden
- `.experience-date`: label style (0.75rem, weight 600, violet)
- `.experience-role`: weight 600, size lg
- Timeline progress line: thin fixed left gradient line
- CV download: flex row, space-between, surface bg, gradient border-top

**Step 2: Write projects CSS**

- Each project: full-width grid `grid-template-columns: 1fr 1fr`, gap 2rem
- Alternating: `.project-card:nth-child(even) .project-image { order: 2 }`
- Featured: larger image, extra top margin
- `.project-badge`: absolute, gradient bg, pill shape
- Image: border-radius, overflow hidden, subtle zoom on hover
- Content: flex column, justify center

**Step 3: Verify experience watermarks and project alternating layout**

Expected: Company names visible as faint watermarks, projects alternate image side.

**Step 4: Commit**

```bash
git add css/style.css
git commit -m "feat: add experience and projects section styles"
```

---

### Task 7: Navigation + Lightbox + Cursor CSS

**Files:**
- Modify: `css/style.css` (append)

**Step 1: Write navigation CSS**

- Fixed, transparent, blurs on scroll (`.navbar.scrolled`)
- Logo: gradient text, weight 800
- Links: small, secondary color, violet underline on active
- CTA button: violet bg, pill
- Mobile: hamburger toggle, fullscreen overlay menu
- Nav auto-hide on mobile scroll down

**Step 2: Write lightbox CSS**

- Fixed overlay, blur backdrop, spring-animated image scale
- Prev/next/close buttons with glass bg
- Counter at bottom

**Step 3: Write custom cursor CSS**

- `#custom-cursor`: fixed, 8px circle, `var(--color-accent)`, `mix-blend-mode: difference`, `pointer-events: none`, `z-index: 9999`
- `.cursor-hover` state: scale up to 40px, border instead of fill
- Hidden on touch devices: `@media (pointer: coarse) { #custom-cursor { display: none; } }`

**Step 4: Commit**

```bash
git add css/style.css
git commit -m "feat: add navigation, lightbox, and cursor styles"
```

---

### Task 8: Animations + Responsive CSS

**Files:**
- Modify: `css/style.css` (append)

**Step 1: Write animation CSS**

- `.reveal`: opacity 0, translateY(30px), transition 0.8s ease-out
- `.reveal.visible`: opacity 1, translateY(0)
- `.char-stagger span`: opacity 0, translateY(100%), filter blur(4px) — revealed per-character by JS
- `.char-stagger.revealed span`: opacity 1, translateY(0), filter blur(0) — with transition-delay per child
- `.photo-reveal`: clip-path circle animation (CSS transition on class change)
- Scroll progress bar: fixed top, gradient bg
- `@keyframes` for: scroll-line, badge-dot-pulse
- `@media (prefers-reduced-motion: reduce)` — disable ALL animations, show everything immediately

**Step 2: Write responsive CSS**

Breakpoints: 1024px, 768px, 480px

At 1024px:
- About grid: 1fr
- Skills: 2x2 still
- Education: 2 columns

At 768px:
- Hero name: `clamp(3rem, 10vw, 6rem)`
- Skills: 1 column
- Projects: stack vertically (1fr)
- Education: 1 column
- Gallery items: `flex: 0 0 85vw`
- Nav: hamburger mode
- Hide custom cursor
- Contact email: smaller

At 480px:
- Tighter spacing
- Hero name: `clamp(2.5rem, 12vw, 4rem)`

**Step 3: Write utility CSS**

- `.container`: max-width 1200px, margin auto, padding horizontal
- Custom scrollbar: thin, violet thumb
- Selection color: violet bg
- Print styles

**Step 4: Verify responsive behavior at all breakpoints**

Expected: Layout adapts correctly at 1440, 1024, 768, 480px.

**Step 5: Commit**

```bash
git add css/style.css
git commit -m "feat: add animations, responsive breakpoints, and utilities"
```

---

## Phase 3: JavaScript

### Task 9: Rewrite particles.js — refined particle system

**Files:**
- Rewrite: `js/particles.js`

**Step 1: Write refined particle system**

Key changes from current:
- Fewer particles (60 desktop, 15 mobile)
- NO connections (lines between particles) — just floating dots
- Colors: cyan and violet only (`rgba(0, 255, 224, ` and `rgba(167, 139, 250, `)
- Smaller particles (1-3px)
- Slower movement, more ethereal
- Keep: mouse interaction, visibility check, DPR handling, spatial grid removed (no connections needed)
- Glow on larger particles: subtle `shadowBlur: 8`

**Step 2: Verify canvas renders particles**

Expected: Subtle floating cyan/violet dots in hero section.

**Step 3: Commit**

```bash
git add js/particles.js
git commit -m "feat: rewrite particle system — fewer, subtler, cyan/violet"
```

---

### Task 10: Rewrite animations.js — reveals, counters, text staggers

**Files:**
- Rewrite: `js/animations.js`

**Step 1: Write new animation system**

Components:
1. **Reveal observer** — same IntersectionObserver pattern but simplified
2. **Character stagger** — split `.char-stagger` text into individual `<span>` elements, reveal with staggered delays (30ms per char)
3. **Flip counter** — for `.stat-number[data-count]`, animate with a slot-machine style (rapidly cycling numbers then settling)
4. **Stagger delays** — grid children get `transition-delay` based on index
5. **Photo reveal** — IntersectionObserver on `.photo-reveal` adds `.photo-revealed` class (CSS handles clip-path transition)
6. **Skills dim effect** — `.skills-grid` hover handler: when hovering a `.skill-group`, add `.dimmed` to siblings

```javascript
// Character stagger setup
function setupCharStagger() {
  document.querySelectorAll('.char-stagger').forEach((el) => {
    const text = el.textContent;
    el.innerHTML = '';
    el.setAttribute('aria-label', text);
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = `${i * 30}ms`;
      el.appendChild(span);
    });
  });
}

// Flip counter
function flipCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}
```

**Step 2: Verify character split renders correctly**

Expected: Hero name characters are individual spans, animate in on load.

**Step 3: Commit**

```bash
git add js/animations.js
git commit -m "feat: rewrite animations — char stagger, flip counter, reveals"
```

---

### Task 11: Rewrite main.js — nav, scroll, cursor, lightbox, interactions

**Files:**
- Rewrite: `js/main.js`

**Step 1: Write main.js**

Components (all in one IIFE, consistent const/let):

1. **Page load sequence** — `triggerHeroReveal()`: staggered opacity/transform on hero elements, then reveal `.char-stagger`
2. **Unified scroll handler** — RAF-throttled:
   - Navbar scroll class
   - Active nav link highlight
   - Scroll progress bar width
   - Timeline progress height (if kept)
3. **Mobile nav toggle** — hamburger open/close with body overflow lock
4. **Smooth scroll** — anchor links with nav offset
5. **Custom cursor** — 8px dot that follows mouse with lerp, scales up on hoverable elements, hidden on mobile
6. **Gallery lightbox** — open/close/navigate, keyboard (Escape, arrows), spring animation
7. **Magnetic buttons** — subtle translate on mousemove (desktop only)
8. **Tilt effect on project cards** — perspective rotateX/Y on mousemove (desktop only)
9. **Skeleton loading** — mark `.skeleton-wrap` as loaded when img completes
10. **Keyboard navigation** — Escape closes lightbox/nav

Key: `const hasFineCursor = matchMedia('(pointer: fine)').matches;` — gate all cursor/hover effects.

**Step 2: Verify navigation, scroll, and lightbox work**

Expected: Nav highlights on scroll, lightbox opens/closes, smooth scrolling works.

**Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: rewrite main.js — nav, cursor, scroll, lightbox"
```

---

### Task 12: Rewrite gestures.js — touch interactions

**Files:**
- Rewrite: `js/gestures.js`

**Step 1: Write gestures.js**

Keep the best parts, clean up:
1. **Haptic feedback** helper (navigator.vibrate)
2. **Toast notification** system
3. **Pull-to-refresh easter egg** (simplified)
4. **Gyroscope parallax** on hero image (iOS permission handled)
5. **Shake to contact** detection
6. **Lightbox swipe gestures** (horizontal swipe navigate, vertical dismiss, pinch zoom)
7. **Long press** hero photo easter egg
8. **Konami code** swipe pattern
9. **Timeline collapse** on mobile (tap to expand/collapse)
10. **Navbar auto-hide** on mobile scroll

Remove: carousel dots (gallery is now horizontal scroll natively), tab bar bounce (no tab bar), party mode orb effects (no orbs).

Consistent `const/let` throughout. No `var`.

**Step 2: Verify touch interactions on mobile viewport**

Expected: Swipe, tap-to-expand, and easter eggs work.

**Step 3: Commit**

```bash
git add js/gestures.js
git commit -m "feat: rewrite gestures — refined touch interactions"
```

---

## Phase 4: Polish & Infrastructure

### Task 13: Update favicon, manifest, service worker

**Files:**
- Rewrite: `favicon.svg`
- Modify: `manifest.webmanifest`
- Rewrite: `sw.js`

**Step 1: Update favicon with new palette**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00FFE0"/>
      <stop offset="100%" stop-color="#A78BFA"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#000"/>
  <text x="16" y="22" text-anchor="middle" font-family="Inter,-apple-system,sans-serif" font-weight="900" font-size="16" fill="url(#g)">IC</text>
</svg>
```

**Step 2: Update manifest theme color**

Change `theme_color` to `#000000` (already correct). Update `name` and `short_name` if needed.

**Step 3: Update service worker**

- Bump `CACHE_NAME` to `ic-portfolio-v3`
- Update `PRECACHE_ASSETS` list to match new file set
- Keep same caching strategies (network-first for navigation, stale-while-revalidate for fonts, cache-first for static)

**Step 4: Commit**

```bash
git add favicon.svg manifest.webmanifest sw.js
git commit -m "feat: update favicon palette, bump service worker cache"
```

---

### Task 14: Update Inter font weights in HTML

**Files:**
- Modify: `index.html` (font link only)

**Step 1: Ensure Inter loads weight 200 (light)**

Current link loads: `wght@300;400;500;600;700;800;900`
Need to add 200: `wght@200;300;400;500;600;700;900`
(Remove 800, add 200 — we use 900 for black, 200 for light titles)

**Step 2: Verify weight 200 renders for section titles**

Expected: Section titles appear in thin weight.

**Step 3: Commit**

```bash
git add index.html
git commit -m "fix: add Inter weight 200 for light section titles"
```

---

## Phase 5: Testing & Verification

### Task 15: Rewrite test suite for new structure

**Files:**
- Rewrite: `tests/desktop.spec.js`
- Rewrite: `tests/mobile.spec.js`
- Rewrite: `tests/accessibility.spec.js`
- Rewrite: `tests/interactions.spec.js`

**Step 1: Write desktop tests**

```javascript
test('hero section is full viewport with centered name', async ({ page }) => {
  const heroName = page.locator('.hero-name');
  await expect(heroName).toBeVisible();
  const box = await heroName.boundingBox();
  // Name should be roughly centered
  const viewport = page.viewportSize();
  expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(100);
});

test('skills grid has 2x2 layout on desktop', async ({ page }) => {
  const grid = page.locator('.skills-grid');
  const cols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
  expect(cols.split(' ').length).toBe(2);
});

test('projects have alternating image layout', async ({ page }) => {
  // Verify project cards exist and have correct structure
  const cards = page.locator('.project-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(4);
});

test('gallery is horizontal scroll', async ({ page }) => {
  const gallery = page.locator('.gallery-scroll');
  const overflow = await gallery.evaluate(el => getComputedStyle(el).overflowX);
  expect(overflow).toBe('auto');
});

test('experience cards have watermark text', async ({ page }) => {
  const watermark = page.locator('.experience-watermark').first();
  await expect(watermark).toBeAttached();
  const opacity = await watermark.evaluate(el => getComputedStyle(el).opacity);
  expect(parseFloat(opacity)).toBeLessThan(0.1);
});
```

**Step 2: Write mobile tests**

Update for new structure:
- No mobile tab bar tests (removed)
- No FAB tests (removed)
- Keep: overflow, touch targets, hamburger, text readability, responsive layouts
- Add: gallery horizontal scroll on mobile, skills single column

**Step 3: Write accessibility tests**

Keep existing (they test HTML semantics which stay correct):
- Skip link, alt text, heading hierarchy, aria-hidden, external links rel
- Add: gallery items have role="button", JSON-LD exists

**Step 4: Write interaction tests**

Update for new structure:
- Lightbox still works
- Scroll progress updates
- Nav highlight updates
- Page load animation completes
- Character stagger animation fires
- Remove: clip-path section reveal test (no longer using clip-path on sections)

**Step 5: Run all tests**

Run: `npx playwright test`
Expected: All tests pass.

**Step 6: Commit**

```bash
git add tests/
git commit -m "feat: rewrite test suite for Monolith redesign"
```

---

### Task 16: Final verification and cleanup

**Files:**
- Possibly modify: any file with issues found

**Step 1: Run Playwright tests**

Run: `npx playwright test`
Expected: All pass.

**Step 2: Check for unused CSS / dead code**

Manually review or use browser DevTools Coverage tab.

**Step 3: Validate HTML**

Run: Check semantic structure, no orphaned tags.

**Step 4: Check accessibility**

- Tab through entire page — every interactive element must be reachable
- Screen reader test (VoiceOver): content reads correctly
- `prefers-reduced-motion`: verify all animations disabled

**Step 5: Performance check**

- Open Chrome DevTools > Lighthouse > run audit
- Target: 100/100/100/100
- Check: no layout shifts, all images lazy loaded, no render-blocking resources

**Step 6: Cross-browser quick check**

- Safari: backdrop-filter, -webkit-text-fill-color
- Firefox: scrollbar-width, clip-path
- Mobile Safari: safe-area-inset, viewport-fit

**Step 7: Final commit**

```bash
git add -A
git commit -m "chore: final polish and cleanup"
```

---

## Task Dependencies

```
Task 1 (HTML) ──┐
                 ├── Task 2 (Tokens) ──┐
                 │                      ├── Task 3 (Hero CSS)
                 │                      ├── Task 4 (About CSS)
                 │                      ├── Task 5 (Skills/Edu/Gallery/Contact CSS)
                 │                      ├── Task 6 (Experience/Projects CSS)
                 │                      ├── Task 7 (Nav/Lightbox/Cursor CSS)
                 │                      └── Task 8 (Animations/Responsive CSS)
                 │                              │
                 │          ┌───────────────────┘
                 │          │
                 ├── Task 9  (particles.js) ─── independent
                 ├── Task 10 (animations.js) ── depends on HTML + CSS
                 ├── Task 11 (main.js) ──────── depends on HTML + CSS
                 ├── Task 12 (gestures.js) ──── depends on HTML
                 ├── Task 13 (favicon/sw) ───── independent
                 └── Task 14 (font weights) ─── independent
                         │
                         └── Task 15 (Tests) ── depends on all above
                                 │
                                 └── Task 16 (Verification) ── depends on tests
```

**Parallelizable groups:**
- Tasks 3-8 can be done in sequence (CSS layers) or parallel (they append to same file)
- Tasks 9, 13, 14 are fully independent
- Task 10-12 depend on HTML structure but can be parallelized with each other

---

## Notes for the Implementing Agent

1. **Read the design doc first**: `docs/plans/2026-03-07-the-monolith-redesign.md` has exact color values, spacing tokens, and detailed section specs.
2. **The existing assets stay**: All images in `assets/portfolio/` and `assets/icons/` are kept.
3. **Zero dependencies**: No npm packages for the site itself. Playwright is dev-only.
4. **The hero photo moves to About**: It no longer appears in the hero section.
5. **No noise overlay, no ambient orbs, no mobile tab bar, no FAB**: These are deleted.
6. **The email IS the design in contact**: Make it the largest, most prominent element.
7. **Weight 200 vs 900**: This contrast IS the design language. Section titles are LIGHT (200), hero name is BLACK (900).
8. **Company watermarks**: These should be barely visible (4% opacity) but readable if you look for them.
9. **Gallery is horizontal**: Not a grid. Horizontal scroll with snap points.
10. **Every animation on compositor only**: Only `transform` and `opacity`. No `width`, `height`, `top`, `left`, `margin`, `padding` animations.
