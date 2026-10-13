# Pip

A calm, friendly grocery shopping companion for people moving from inpatient to outpatient rehab after a traumatic brain injury.

This is the **first frontend prototype**: a clickable, single-phone-screen React app with mock data and no backend. It is meant for feedback sessions with our sponsor and with occupational therapists.

## What it does

- **Make a list** at home, then **pick a store** (Hannaford, West Lebanon or Hanover Co-op).
- **Trip plan** groups items by aisle and says which aisles you can skip.
- **Guided trip** shows one item at a time, as a simple list or a store map. "Can't find it" offers a nearby aisle, a help card to show a worker, or an out-of-stock report.
- **Add sign** lets shoppers photograph overhead aisle signs. Pip "reads" them (mocked) to build a shared store map, Waze style.
- **Me** holds settings: theme color, light/dark, text size, Pip's personality (Calm / Cheerful / Goofy), sounds, Pip tips, reduce motion, and directions style.

Design priorities: low cognitive load, one thing at a time, big text and tap targets, encouraging but never childish.

## Run it locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Check TypeScript types |

## Tech

React 18, TypeScript, Tailwind CSS 3, framer-motion, lucide-react, built with Vite.

## Project structure

```
App.tsx          Providers and prototype options
index.tsx        Entry point
pages/           One file per screen (trip/, lists/, sign/, me/)
components/      Reusable UI (ui/ holds buttons, cards, chips, sheets, toasts)
contexts/        Navigation, settings, trip, sign and toast state
data/            Mock content: catalog, stores, store maps, sign photos, copy
hooks/           Reusable hooks
utils/           Pure helpers
types/           Shared types
```

All data is mock data in `data/`. Nothing is saved between page reloads.

## Prototype options

`App` accepts two optional props for demos:

- `firstLaunch` (default `true`): show the splash and onboarding.
- `hasSavedLists` (default `true`): set to `false` to see the empty states.

## Notes

- Images (Pip icon, sample aisle sign photos) are hosted on a CDN, so you need an internet connection to see them.
- The store maps and sign reading are mocked. There is no computer vision or backend yet.
