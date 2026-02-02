## Why

UUIDs are difficult for users to type, especially on mobile devices. Replacing them with "Friendly Codes" (Adjective-PluralNoun-Number) improves the sharing and joining experience significantly, making the game more accessible and fun.

## What Changes

- **BREAKING**: Room IDs will change format from UUID (`a1b2...`) to Friendly Code (`happy-lions-42`).
- Implement a generator for friendly codes using curated word lists (~100 adjectives × ~100 nouns × 90 numbers = 900,000 combinations).
- Update the Room Creation flow to generate lowercase hyphenated codes.
- **Display Format**: Lobby header shows formatted room name: `Happy Lions [42]` (Title Case, Spaces, Number in Brackets).
- **Input Handling**: Room joining is case-insensitive and accepts multiple separator styles:
  - `Happy Lions 42` ✓
  - `Happy-Lions-42` ✓
  - `Happy__Lions--42` ✓
  - `happy lions 42` ✓
  - All normalized to canonical `happy-lions-42`
- URL remains lowercase: `/room/happy-lions-42`

## Capabilities

### Modified Capabilities
- `lobby-management`: 
  - Update "Room Creation" to generate friendly codes
  - Add "Room Display Format" requirement for lobby header
  - Add "Room Joining Normalization" requirement for input handling

## Impact

- New utility `lib/room-code.ts` with generator, formatter, and normalizer functions.
- Updates to `app/create/route.ts` for code generation.
- Updates to `app/page.tsx` for input normalization.
- Updates to `app/room/[id]/page.tsx` for formatted display.
