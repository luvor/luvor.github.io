# The Monolith: Full Portfolio Redesign

**Date**: 2026-03-07
**Status**: Approved
**Approach**: Full teardown and rebuild from zero

## Vision

A portfolio that breathes craftsmanship. Dark architect aesthetic with creative unpredictability, executed with surgical precision. Every pixel earns its place. Typography is the primary visual element. Zero dependencies. Lighthouse 100/100/100/100.

References: Apple (precision, dramatic reveals), Solana (bold, futuristic), PostHog (personality), Obsidian (dark, deep), Groq (speed), Telegram (clean, smooth).

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#000000` | Primary background |
| `--color-bg-secondary` | `#0A0A0A` | Surface backgrounds |
| `--color-text` | `#F5F5F7` | Primary text |
| `--color-text-secondary` | `#A1A1AA` | Body text, descriptions |
| `--color-text-tertiary` | `#52525B` | Muted text, labels |
| `--color-accent` | `#A78BFA` | Buttons, links, dots, interactive |
| `--color-gradient-start` | `#00FFE0` | Gradient start (cyan) |
| `--color-gradient-end` | `#A78BFA` | Gradient end (violet) |
| `--color-gradient` | `linear-gradient(135deg, #00FFE0, #A78BFA)` | Dramatic moments |
| `--color-surface` | `rgba(255,255,255,0.03)` | Card backgrounds |
| `--color-border` | `rgba(255,255,255,0.06)` | Subtle borders |
| `--color-border-hover` | `rgba(255,255,255,0.12)` | Hover borders |

### Typography

Font: Inter (already loaded). The key is dramatic weight contrast.

| Role | Size | Weight | Tracking | Line Height |
|------|------|--------|----------|-------------|
| Hero name | `clamp(4rem, 12vw, 12rem)` | 900 | -0.06em | 0.9 |
| Section title | `clamp(2rem, 5vw, 4rem)` | 200 | -0.02em | 1.1 |
| Section label | `0.75rem` | 600 | 0.15em | 1 |
| Body | `clamp(1rem, 0.9rem + 0.5vw, 1.125rem)` | 400 | 0 | 1.7 |
| Small | `0.875rem` | 400 | 0 | 1.6 |
| Mono/label | `0.75rem` | 500 | 0.05em | 1 |

### Spacing

8px base grid. Section padding: `clamp(8rem, 15vh, 12rem)`.

| Token | Value |
|-------|-------|
| `--space-xs` | `0.5rem` (4px) |
| `--space-sm` | `1rem` (8px) |
| `--space-md` | `1.5rem` (12px) |
| `--space-lg` | `2rem` (16px) |
| `--space-xl` | `3rem` (24px) |
| `--space-2xl` | `5rem` (40px) |
| `--space-section` | `clamp(8rem, 15vh, 12rem)` |

### Border Radius

Minimal. Not everything is rounded.

| Token | Value |
|-------|-------|
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--radius-full` | `9999px` |

### Transitions

| Token | Value |
|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--duration-fast` | `0.15s` |
| `--duration-base` | `0.3s` |
| `--duration-slow` | `0.6s` |
| `--duration-reveal` | `0.8s` |

## Section Designs

### 1. Hero: "The Statement"

Full viewport. Name fills the screen. No photo. No split layout.

- Name: 12vw, weight 900, -0.06em tracking, centered
- Character-level stagger animation (30ms per char)
- Subtitle: blur-to-sharp reveal after name completes
- Particle canvas: refined (fewer particles, no connections, subtle floating dots)
- "Available for work" pill: bottom-left corner, minimal
- Scroll indicator: single thin animated line
- Hover on name: subtle cyan-to-violet gradient shift
- CTA buttons below subtitle: "View Work" (violet fill) + "Get in Touch" (ghost)

### 2. About: "The Reveal"

Photo appears here for the first time. Dramatic scroll-driven reveal.

- Grid: 60% text / 40% photo (asymmetric)
- Photo: clip-path circle animation expanding on scroll
- Stats below photo: flip-counter animation (airport departure board)
  - 5+ Years Experience | 30+ Projects Shipped | 2x Hackathon Winner
- Section title: weight 200 ("Building the bridge between AI & great UX")
- Tags: no borders, text only, subtle violet bg on hover
- About text: secondary color, generous line-height

### 3. Skills: "The Density"

Typographic grid. No cards. No icons.

- 2x2 grid layout
- Category name (weight 600) + thin horizontal rule + items below
- Items: secondary text, violet dot prefix
- Hover on category: highlights, others dim to 40% opacity (CSS transition)
- Items stagger-reveal on scroll (50ms per item)
- Dense, information-rich. The density is the statement.

### 4. Experience: "The Stack"

Full-width stacking cards. Company as massive watermark.

- Company name: 15vw, 8% opacity, absolute positioned behind content
- Card: full-width, left gradient border (cyan-to-violet, 2px)
- Cards enter by sliding up on scroll
- Timeline progress: thin gradient line on left edge of viewport
- Role title: weight 600, date in violet label style
- Tags: minimal pills
- CV download at end: "Want the full story?" + download button

### 5. Projects: "The Cinema"

Full-width showcases. Alternating image position.

- Each project: image on one side (alternating), content on other
- Featured project: extra height, "Featured" gradient badge
- Images: subtle zoom on scroll (scroll-driven CSS)
- Each project enters with a unique animation
- Tags: violet pills
- Links: text with arrow, arrow slides on hover
- Hackathon winner badge: gradient pill

### 6. Education: "The Foundation"

Three cards in a row. Clean, minimal.

- Top gradient border line (cyan-to-violet)
- Refined SVG icons
- Date in violet label style
- Hover: 4px lift + border glow
- No excessive decoration

### 7. Gallery: "The Drift"

Horizontal scroll with momentum. Not a grid.

- Horizontal scroll container with CSS `scroll-snap-type: x mandatory`
- Images: rounded corners (12px), subtle shadow
- Hover: caption slides up from bottom
- Lightbox: spring animation on open/close, swipe gestures
- Dot indicators for position
- Mobile: native horizontal swipe with snap

### 8. Contact: "The Close"

Minimal. Email is the focal point.

- Title: "Let's build something amazing together" — weight 200, large
- Email: massive gradient text (cyan-to-violet), magnetic hover effect
- Social links: minimal text "LinkedIn ->" "GitHub ->"
- Footer merged into this section
- Copyright at very bottom, tertiary color

## Eliminated Elements

- Glass card style (generic)
- Noise overlay (no value)
- Generic fade-in animations (replaced by section-specific reveals)
- Split hero with photo (replaced by typography-only hero)
- Ambient orbs (replaced by refined particle system)
- Mobile tab bar (replaced by minimal bottom nav)
- Apple tri-color palette (replaced by cyan/violet identity)
- Identical hover effects on everything

## New Elements

- Character-level text stagger animations
- Scroll-driven section transitions (CSS `animation-timeline: scroll()`)
- Horizontal scroll gallery with momentum
- Flip-counter stats
- Geometric clip-path photo reveal
- Custom cursor dot (desktop only, reacts to interactive elements)
- Cinematic page load sequence
- JSON-LD structured data for SEO
- Company watermark in experience section

## Technical Architecture

### Stack
- Zero dependencies: vanilla HTML, CSS, JS
- GitHub Pages deployment (existing workflow)
- PWA with improved caching strategy

### File Structure
```
index.html              -- Single HTML file, semantic markup
css/style.css           -- Organized: Reset > Tokens > Layout > Components > Motion > Responsive
js/main.js              -- Navigation, scroll handler, cursor, interactions
js/animations.js        -- IntersectionObserver reveals, counters, text staggers
js/particles.js         -- Refined particle canvas
js/gestures.js          -- Touch, gyroscope, easter eggs
sw.js                   -- Service worker
manifest.webmanifest    -- PWA manifest
favicon.svg             -- Updated with new palette
```

### CSS Organization (~1500 lines target)
1. Reset & base
2. Custom properties (tokens)
3. Typography
4. Layout utilities
5. Navigation
6. Hero
7. About
8. Skills
9. Experience
10. Projects
11. Education
12. Gallery
13. Contact/Footer
14. Lightbox
15. Animations & motion
16. Cursor & interactions
17. Accessibility (prefers-reduced-motion, focus states)
18. Responsive breakpoints

### JS Organization
- Consistent `const/let` (no `var`)
- IIFE pattern per file
- Passive event listeners everywhere
- RAF-throttled scroll handler
- IntersectionObserver for reveals
- ResizeObserver where needed
- `prefers-reduced-motion` respected in JS too

### Performance Targets
- FCP < 0.8s
- LCP < 1.2s
- CLS = 0
- Lighthouse: 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO
- All animations compositor-only (transform + opacity)
- Images: lazy loading, proper dimensions, modern formats where possible

### Accessibility
- WCAG 2.1 AA compliance
- Skip link
- Semantic HTML (nav, main, section, article, footer)
- ARIA labels on interactive elements
- Keyboard navigation with visible focus states
- prefers-reduced-motion: all animations disabled
- prefers-contrast: high contrast mode support
- Gallery items: role="button", keyboard accessible

### SEO
- JSON-LD Person schema
- Open Graph tags (updated)
- Twitter Card tags (updated)
- Semantic heading hierarchy
- Meta description

## Success Criteria

1. A visitor's first reaction is "wow" not "nice template"
2. The source code is as impressive as the design
3. Lighthouse 100 across all categories
4. Every animation runs at 60fps
5. The site loads in under 1 second
6. It feels unmistakably like Islambek's site, not a generic portfolio
