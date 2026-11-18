# Kumbida design reference

A self-contained design package for building Kumbida with Claude Code in Orca (or any coding agent).

## Quick start
1. Unzip into your repo as `design/` (so you have `my-app/design/index.html`).
2. Move `design/CLAUDE.md` to the repo root (or merge it into your existing `CLAUDE.md`).
3. Commit, then open `design/index.html` in Orca's built-in browser to see everything.
4. Optional: generate PNG screenshots with real fonts (needs internet):
   ```
   npm i -D playwright && npx playwright install chromium
   node design/scripts/screenshots.mjs
   ```

In Orca you can also click any element on these pages: Orca sends its HTML, CSS and a screenshot to the agent, which is the fastest way to say "make this look like that".

## Contents
| Path | What it is |
|---|---|
| `index.html` | Visual overview of every screen and template. Start here. |
| `pages/` | Landing, booking, admin log-in, admin invite, admin dashboard, host Pay step, flow simulation. Working prototypes. |
| `templates/` | 31 invitation covers in 11 category folders (baby, kid, teen birthdays by girl/boy; debuts; weddings; anniversary; reunion). |
| `manifest.json` | List of pages and templates with names and categories. |
| `tokens.css` | Site colors, fonts, radii as CSS variables. |
| `Kumbida-design.md` | Full design doc (product, flows, website design §6.6, template library §9.1). |
| `CLAUDE.md` | Instructions for Claude Code. |
| `runtime/dc-lite.js` | Small script that makes the design files run in a normal browser. Reference only, not part of the app. |
| `scripts/screenshots.mjs` | Saves PNG screenshots of everything to `screenshots/`. |

Fonts load from Google Fonts, so open the pages with an internet connection to see the real typography.
