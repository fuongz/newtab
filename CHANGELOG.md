# Changelog

## v1.0.0 — 2026-03-01

### What's new

- **Migrated to Bun** — switched from pnpm to Bun for faster installs and tooling
- **Upgraded all dependencies** — bumped all dev and runtime packages to their latest versions
- **Refactored storage composable** — replaced `useStorageLocal.ts` with a new `useWebExtensionStorage.ts` for cleaner, more robust extension storage handling
- **Replaced quote API with GitHub Gist** — quotes are now fetched from a self-hosted Gist, removing the external API dependency
- **Release automation** — added `bun run release` script to auto-bump version, build, pack, tag, and push in one command

---

## v0.0.6

### What's new

- Added `vue-select` and `@popperjs/core` for improved select input UI
- Added custom author font family support
- New settings menu with background color customization
- Added Roboto and Inter font families

### Bug fixes

- Fixed quote not loading when `chrome.storage` is null
- Removed unused `default_popup`

---

## v0.0.4

### What's new

- Added font family switcher in settings
- Added settings panel
- Disabled scroll layout
- Copyright info in footer

---

## v0.0.1 — Initial release

- Random quote on every new tab
