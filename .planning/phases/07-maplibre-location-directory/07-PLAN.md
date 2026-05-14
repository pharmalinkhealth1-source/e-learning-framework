# Phase 7: MapLibre Location Directory — Plan

**Phase Goal:** Build an interactive, high-performance vector map directory at `/directory` that visualises pharmaceutical locations (pharmacies, clinics, distribution hubs) across Africa using MapLibre GL JS, sourced from the existing Sanity `directoryItem` schema and styled to the Clinical Luxury design system.

---

## Pre-requisites

| Dependency | Purpose | Install |
|---|---|---|
| `maplibre-gl` | WebGL vector map renderer (open-source, no token required) | `npm install maplibre-gl` |
| `react-map-gl` | React wrapper for MapLibre with declarative `<Map>`, `<Marker>`, `<Popup>` components | `npm install react-map-gl` |

**Tile source:** Free OpenStreetMap-based vector tiles from [MapTiler](https://www.maptiler.com/) or [Protomaps](https://protomaps.com/). No API key needed for development with OSM raster tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`).

---

## Wave 1: Schema Update & Map Foundation

### Plan 01: Update Sanity `directoryItem` Schema

```yaml
wave: 1
depends_on: []
files_modified:
  - src/sanity/schemaTypes/directoryItem.ts
autonomous: true
requirements_addressed: [REQ-DIR-01]
```

<objective>
Update the `directoryItem` schema categories from placeholder values (Fintech, E-commerce, SaaS) to pharmaceutical-relevant categories, and add fields for address, description, and contact information.
</objective>

<action>
1. Update `src/sanity/schemaTypes/directoryItem.ts`:
   - Change category options to: `Pharmacy`, `Clinic`, `Distribution Hub`, `Training Centre`, `Laboratory`.
   - Add fields: `description` (text), `address` (string), `city` (string), `country` (string), `phone` (string).
   - Keep existing fields: `name`, `location` (geopoint), `website`, `logo`.
</action>

<verification>
- [ ] Schema compiles without errors in Sanity Studio.
- [ ] New categories appear in the studio document editor.
</verification>

### Plan 02: Map Component & Directory Page Shell

```yaml
wave: 1
depends_on: [01]
files_modified:
  - src/app/directory/page.tsx
  - src/app/directory/Directory.module.css
  - src/components/map/LocationMap.tsx
autonomous: true
requirements_addressed: [REQ-DIR-01]
```

<objective>
Create the `/directory` route with the Clinical Luxury design shell and a fullbleed interactive MapLibre map component.
</objective>

<action>
1. Install dependencies: `npm install maplibre-gl react-map-gl`.
2. Create `src/components/map/LocationMap.tsx`:
   - Client component (`"use client"`) wrapping `react-map-gl` with MapLibre.
   - Import `maplibre-gl/dist/maplibre-gl.css`.
   - Centre on Africa (lat: 5, lng: 20, zoom: 3).
   - Use a dark or muted map style to match the Clinical Luxury aesthetic.
   - Accept `locations` prop (array of `{ id, name, category, lat, lng }`).
3. Create `src/app/directory/Directory.module.css`:
   - Grid lines and radial glow consistent with other pages.
   - Split layout: sidebar list (40%) + map (60%) on desktop, stacked on mobile.
   - Sidebar with search input and category filter pills.
4. Create `src/app/directory/page.tsx`:
   - Server component fetching `directoryItem` documents from Sanity.
   - Render `<Navbar>`, hero section, `<LocationMap>`, sidebar, `<Footer>`.
   - Pass location data to the map component.
5. Add `/directory` to the Navbar routes array.
</action>

<verification>
- [ ] Map renders centered on Africa with OSM tiles.
- [ ] Page matches Clinical Luxury design (grid lines, hero, typography).
- [ ] Sidebar and map are responsive (stacked on mobile).
</verification>

---

## Wave 2: Interactive Features

### Plan 03: Markers, Popups & Category Filtering

```yaml
wave: 2
depends_on: [02]
files_modified:
  - src/components/map/LocationMap.tsx
  - src/components/map/LocationMarker.tsx
  - src/components/map/LocationPopup.tsx
  - src/app/directory/page.tsx
autonomous: true
requirements_addressed: [REQ-DIR-01]
```

<objective>
Render custom markers on the map for each directory item, with popups on click showing details, and implement sidebar category filtering that syncs with the map.
</objective>

<action>
1. Create `src/components/map/LocationMarker.tsx`:
   - Custom SVG marker styled per category (colour-coded pills).
   - Pulsing animation for active/selected markers.
2. Create `src/components/map/LocationPopup.tsx`:
   - Styled popup card with name, category badge, address, and "View Details" link.
   - Clinical Luxury border radius, shadow, and typography.
3. Update `src/components/map/LocationMap.tsx`:
   - Render `<Marker>` and `<Popup>` for each location.
   - Handle click events to fly the camera to the selected location.
   - Sync selected marker state with sidebar highlight.
4. Update `src/app/directory/page.tsx`:
   - Add category filter pills (client-side filtering via state).
   - Add search input that filters by name/city.
   - Highlight the active sidebar item when a marker is clicked.
</action>

<verification>
- [ ] Clicking a marker opens a styled popup and flies the camera.
- [ ] Category filter pills correctly filter both the sidebar list and map markers.
- [ ] Search input filters locations in real-time.
</verification>

---

## Wave 3: Seed Data & Polish

### Plan 04: Seed Locations & Static Fallback

```yaml
wave: 3
depends_on: [03]
files_modified:
  - src/app/directory/page.tsx
  - src/components/map/LocationMap.tsx
autonomous: true
requirements_addressed: [REQ-DIR-01]
```

<objective>
Seed the map with representative pharmaceutical locations across Nigeria, Kenya, Ethiopia, and Ghana for demonstration purposes, and add framer-motion entrance animations.
</objective>

<action>
1. Create a static `SEED_LOCATIONS` array in the directory page with ~12 representative locations:
   - Lagos, Abuja, Ibadan (Nigeria)
   - Nairobi, Mombasa, Kisumu (Kenya)
   - Addis Ababa, Dire Dawa (Ethiopia)
   - Accra, Kumasi (Ghana)
   - Each with realistic name, category, coordinates, address, and description.
2. Use `SEED_LOCATIONS` as fallback when no Sanity data is available.
3. Add `framer-motion` entrance animations to the hero, sidebar, and map container.
4. Add `next/dynamic` import for the map component with `ssr: false` (MapLibre requires `window`).
</action>

<verification>
- [ ] Map shows ~12 seed markers across 4 countries on first load.
- [ ] Clicking through the seed data demonstrates popups and camera fly-to.
- [ ] Production build passes (`npx next build`).
- [ ] No SSR hydration errors from MapLibre.
</verification>

---

## Canonical References

| File | Purpose |
|---|---|
| `src/sanity/schemaTypes/directoryItem.ts` | Sanity schema with geopoint field |
| `src/app/blog/Blog.module.css` | Grid lines + radial glow reference |
| `src/app/community/page.module.css` | Recent Clinical Luxury implementation |
| `src/components/stripe/Navbar.tsx` | Nav route array (line 96) |
