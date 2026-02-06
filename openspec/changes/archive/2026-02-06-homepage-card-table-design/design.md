## Context

The current homepage (`app/page.tsx`) uses:
- Inter font (Next.js default)
- Tailwind slate palette on a dark background
- Standard centered card layout with gradient text logo
- No textures, animations, or atmospheric elements

We're implementing the "Card Table" aesthetic—a warm, inviting design that evokes sitting at a game table with friends. This is a visual-only change; no game logic or networking is affected.

**Reference mockup:** `design-proposals/02-card-table.jpg`

## Goals / Non-Goals

**Goals:**
- Create a distinctive, memorable first impression
- Evoke warmth and playfulness through visual design
- Maintain excellent performance (fast load, smooth animations)
- Ensure accessibility (contrast, focus states, reduced motion support)
- Establish reusable design tokens for future pages

**Non-Goals:**
- Redesigning the game room UI (separate change)
- Adding new functionality to the homepage
- Creating a full component library
- Supporting multiple themes (dark/light toggle)

## Decisions

### 1. Logo: "WEB UN" + Card as "O"

**Choice:** Match the reference mockup style with a wild card:
- "WEB UN" in cream/tan color with subtle text shadow
- The "O" is replaced by a **tilted wild card** (multi-colored)
- Card is rotated ~15° clockwise, positioned to the right of "N"
- Drop shadow on the card for depth

```
     WEB UN ╭───╮
           │ W │  ← Wild card, tilted, replaces "O"
           ╰───╯
```

**Implementation:** The card uses an extracted SVG from the UNO deck (`/cards/wild.svg`) positioned inline with the text using flexbox alignment.

### 2. Typography: Playfair Display + Nunito

**Choice:** 
- **Logo:** Playfair Display (serif) - matches the mockup's elegant cream lettering
- **UI/Body:** Nunito (rounded sans-serif) - friendly and readable for buttons and labels

**Implementation:**
```typescript
// app/layout.tsx
import { Playfair_Display, Nunito } from 'next/font/google'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-display'
})

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-body'
})
```

**Rationale:**
- Playfair Display matches the mockup's elegant, warm serif lettering
- Nunito provides friendly readability for interactive elements
- Both available via `next/font/google` with automatic optimization

### 3. Background: CSS Gradient + SVG Pattern (no image assets)

**Choice:** Combine a radial gradient with an inline SVG noise pattern for the felt texture.

```
┌─────────────────────────────────────────┐
│  Layer 3: Vignette (radial gradient)    │
├─────────────────────────────────────────┤
│  Layer 2: Noise texture (SVG filter)    │
├─────────────────────────────────────────┤
│  Layer 1: Base green gradient           │
│           #1a472a → #0d2818             │
└─────────────────────────────────────────┘
```

**Rationale:**
- Zero additional HTTP requests
- Infinitely scalable, no pixelation
- ~2KB inline vs 50-200KB for quality texture images
- CSS-only, no build pipeline changes

**Alternatives considered:**
- *Image texture*: Larger payload, caching complexity
- *Canvas-generated*: Runtime cost, complexity
- *Plain gradient*: Lacks tactile quality

### 4. Card Fan Decoration: 4-card spread below logo

**Choice:** Match the reference mockup - a fan of 4 overlapping UNO cards centered below the logo:

```
        ╭───╮ ╭───╮ ╭───╮ ╭───╮
        │+2 │ │ O │ │ ⟲ │ │ ⟲ │
        │RED│ │BLU│ │YLW│ │GRN│
        ╰───╯ ╰───╯ ╰───╯ ╰───╯
          ↖     ↑     ↑     ↗
         -20°  -7°   +7°  +20°  (desktop rotation)
         -15°   0°  +15°   -    (mobile: middle upright, green hidden)
```

**Cards shown (left to right):**
1. Red +2 (Draw Two)
2. Blue Skip
3. Yellow Reverse
4. Green Reverse (hidden on mobile)

**Classic UNO Card Design:**
- Colored card background (red/blue/yellow/green)
- Thin cream border around the entire card
- Inner cream layer with colored border
- Colored center with tilted white ellipse (-30° rotation)
- Symbol in card color on the white ellipse
- White corner pips on the colored background

**Implementation:**
- Each card is a CSS-styled div with layered structure
- Cards overlap with negative margin
- Each card rotated and offset for fan effect
- Drop shadows for depth (matching mockup's soft shadows)
- Mobile: different rotations via CSS custom properties

**Rationale:**
- Pure CSS keeps bundle small
- Reusable card component for game UI later
- Animatable on page load (staggered fan-out effect)

### 5. Animation: CSS-only with `prefers-reduced-motion` respect

**Choice:** Use CSS `@keyframes` and transitions. No JavaScript animation libraries.

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Animations planned:**
| Element | Animation | Duration |
|---------|-----------|----------|
| Logo | Fade in + slight rise | 600ms |
| Cards (decorative) | Staggered fade + rotate in | 800ms |
| Action card | Fade in | 400ms, 200ms delay |
| Buttons | Scale on hover | 150ms |

**Rationale:**
- CSS animations are GPU-accelerated
- No bundle size impact
- Accessibility built-in via media query

### 6. Buttons: Copper/bronze pill-shaped

**Choice:** Match the reference mockup button style exactly:

```
    ╭─────────────────────╮
    │    Create Game      │  ← Copper/bronze gradient
    ╰─────────────────────╯     Cream text, rounded pill shape
                                Subtle inner highlight, outer shadow
```

**Button specifications:**
- **Shape:** Fully rounded ends (pill shape), `border-radius: 9999px`
- **Background:** Copper/bronze gradient (`#c4873a` → `#a66a2a`)
- **Border:** Subtle darker bronze outline (`#8b5a2b`)
- **Text:** Cream/off-white (`#f5e6c8`), medium weight
- **Shadow:** Warm yellowish glow (not dark shadow) - `rgba(196, 135, 58, 0.4)` with soft dark base
- **Hover:** Slightly lighter gradient, subtle lift effect, enhanced glow
- **Active:** Pressed-in effect (inset shadow)

**Layout adaptation:**
- The mockup shows side-by-side "Create Game" and "Join Room" buttons
- We need to accommodate the room code input for joining
- Revised layout:

```
┌────────────────────────────────────────┐
│                                        │
│  ╭────────────────────────────────╮   │
│  │        Create New Game         │   │  ← Primary action
│  ╰────────────────────────────────╯   │
│                                        │
│  ─────────── or join ───────────      │  ← Divider
│                                        │
│  ╭────────────────────────╮ ╭────╮   │
│  │  Enter room code...    │ │ → │   │  ← Input + submit
│  ╰────────────────────────╯ ╰────╯   │
│                                        │
└────────────────────────────────────────┘
```

- Input field styled with same copper border, cream text on dark felt
- Submit button uses same gradient as primary button

### 7. Color Palette: Warm earth tones with UNO accents

**CSS Variables:**
```css
:root {
  /* Table surface */
  --felt-dark: #0d2818;
  --felt-mid: #1a472a;
  --felt-light: #2d5a3d;
  
  /* Wood/warm accents */
  --wood-dark: #5c4033;
  --wood-light: #8b6914;
  
  /* Text */
  --cream: #f5e6c8;
  --cream-dark: #d4c4a8;
  
  /* Button gradient */
  --copper-light: #c4873a;
  --copper-dark: #a66a2a;
  --copper-border: #8b5a2b;
  
  /* UNO card colors */
  --uno-red: #ed1c24;
  --uno-blue: #0077c0;
  --uno-yellow: #ffcc00;
  --uno-green: #00a651;
  
  /* Card base */
  --card-white: #fff8f0;
}
```

### 8. Layout: Centered with card fan, no edge decorations

**Choice:** Follow the reference mockup's clean centered layout:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│              WEB UN[card]                        │  ← Logo with card as "O"
│                                                  │
│           [R][B][Y][G]                          │  ← 4-card fan
│                                                  │
│         ╭──────────────────╮                    │
│         │   Create Game    │                    │  ← Primary button
│         ╰──────────────────╯                    │
│                                                  │
│              or join                            │
│                                                  │
│         ╭─────────────╮ ╭──╮                    │
│         │  room code  │ │→ │                    │  ← Input + submit
│         ╰─────────────╯ ╰──╯                    │
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
│         (wood edge implied by vignette)          │
```

**Notes:**
- No floating cards at edges (keep it clean like the mockup)
- The card fan below the logo serves as the visual centerpiece
- Wood texture appears as a subtle vignette/gradient at viewport edges
- On mobile, layout stacks naturally; card fan may scale down

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| SVG noise filter may not render identically across browsers | Test on Chrome, Firefox, Safari; provide graceful fallback (plain gradient) |
| Decorative cards may clutter on small screens | Hide or minimize decorations below 640px breakpoint |
| Warm colors may have contrast issues | Validate with WebAIM contrast checker; ensure 4.5:1 for text |
| Animation could feel slow on low-end devices | Keep animations under 1s; use `will-change` sparingly |
| Font loading flash (FOUT) | Use `next/font` with `display: swap` and appropriate fallback |

## Resolved Questions

1. **Mobile card fan**: Reduce to 3 cards on mobile (< 640px), removing the green reverse card. Show: Red +2, Blue 0, Yellow Reverse.

2. **Touch hover states**: Yes - buttons will have a pronounced `:active` state with inset shadow and slight scale-down to provide tactile feedback on touch devices.

3. **Logo font**: Use Playfair Display to match the mockup's elegant serif-style lettering. Fall back to Georgia → serif if unavailable.
