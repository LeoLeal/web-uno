## Why

The current homepage is functional but visually generic—using default Inter font, standard Tailwind slate colors, and a predictable centered card layout. It doesn't evoke the warmth and playfulness of an actual card game. A distinctive "Card Table" aesthetic will make Web UNO memorable, inviting, and immediately communicate "game night with friends" before users read a single word.

## What Changes

- **New visual identity**: Redesign homepage with green felt texture background, warm lighting, and card-inspired visual elements
- **Typography overhaul**: Replace Inter with a rounded, friendly font family (e.g., Quicksand, Nunito) that complements the cozy game-night vibe
- **Card-centric branding**: Incorporate UNO card shapes into the logo and decorative elements—the "O" in UNO becomes a card, scattered cards create atmosphere
- **Tactile UI elements**: Buttons and inputs styled with warm tones, subtle shadows, and rounded corners that feel like physical game pieces
- **Atmospheric depth**: Add vignette effects, soft shadows, and layered elements that create the feeling of sitting at a real card table
- **Motion polish**: Subtle animations on load and interaction to add life without being distracting

## Capabilities

### New Capabilities
- `homepage-design`: Visual design system for the homepage including layout, typography, color palette, textures, and component styling. Establishes the "Card Table" aesthetic as the foundation for the application's visual identity.

### Modified Capabilities
<!-- No existing spec-level requirements are changing - this is purely additive visual work -->

## Impact

- **Files affected**: 
  - `app/page.tsx` - Complete visual redesign
  - `app/layout.tsx` - Font configuration changes
  - `app/globals.css` - New CSS variables, textures, animations
- **New assets**: Background textures (felt pattern), possibly card graphics for decoration
- **Dependencies**: May add Google Font imports (Quicksand or similar)
- **Performance**: Background textures and animations should be optimized for fast load times
- **Accessibility**: Ensure sufficient color contrast on textured backgrounds, maintain focus states
