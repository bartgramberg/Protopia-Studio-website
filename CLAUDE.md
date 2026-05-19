# Project rules for Claude

## Git workflow

- **ALWAYS push to `dev` branch.** Never push to `main` unless the user explicitly asks ("push to main", "merge to main", etc.).
- **ALWAYS ask for explicit consent before pushing to `main`** — even if the change is small, even if it seems like a fix.
- The user's flow is: work on `dev` → preview → user reviews → user asks to merge to `main`.
- When unsure which branch to push to, default to `dev`.
- The Decap CMS (`public/admin/config.yml`) `backend.branch` controls where CMS edits go. Currently set to `main` — don't change without asking.

## Tech stack

- Astro 6 static site with content collections using `glob()` loader
- Tailwind CSS v3 + `@tailwindcss/typography` plugin
- Decap CMS with GitHub backend, i18n multiple_folders (nl default, en)
- Netlify deploys; CI uses **pnpm** (not npm) — always update `pnpm-lock.yaml` after adding deps

## Brand tokens

- green `#48735B` (`text-green` / `bg-green`)
- magenta `#D90D7D` (`text-magenta`)
- creme `#F2EFE9` (`bg-creme`)
- mid `#4A4A4A` (body text)
- border `#DEDAD4`

## Section pattern

Most sections follow: green eyebrow with bottom border ("Protopia X.") + large green h2 + optional intro paragraph + content. Maintain this pattern when adding new sections.
