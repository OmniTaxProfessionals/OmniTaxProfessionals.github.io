# Changelog — OmniTax Professionals Website

## 2026-05-30 — Privacy Policy and Terms of Use

- Added `/privacy/` and `/terms/` legal pages with Australian Privacy Act (APPs) aligned privacy policy and website terms of use (no-advice disclaimer, IP, liability, Queensland governing law).
- Added `.legal-document` styles and `.visually-hidden` utility in `css/styles.css`.
- Updated footer links site-wide from `#` placeholders to `/privacy/` and `/terms/`.

## 2026-05-30 — Admin workflows for Insights PDFs and team members

- Added Node.js scripts (`scripts/add-insight.js`, `scripts/add-team-member.js`) to copy files and update `manifest.json` / `team.json`.
- Added GitHub Actions workflows (`.github/workflows/add-insight.yml`, `add-team-member.yml`) with manual trigger forms for browser-based publishing.
- Added `.staging/insight/` and `.staging/team/` folders for file uploads before running Actions (GitHub workflow forms do not support file attachments).
- Documented both GitHub Actions and local CLI usage in `docs/admin-workflows.md`.

## 2026-05-30 — Hero team photo mobile scaling fix

- Removed `min-height: 420px` and `object-fit: cover` from `.hero__image img` so the home page team photo scales proportionally and remains fully visible on all screen sizes.

## 2026-05-30 — Hide client portal from public navigation

- Removed "Client Portal" CTA buttons linking to `/dashboard/` from home, contact, and services pages.
- Dashboard remains reachable only via direct URL (`/dashboard/`); page already uses `noindex, nofollow`.

## 2026-05-30 — Clean directory URLs

- Moved all subpages from flat `*.html` files into `{page}/index.html` folders (`contact`, `dashboard`, `services`, `insights`, `careers`, `our-people`, `our-values`).
- Root `index.html` remains at site root (`/`).
- Updated all internal links to root-relative paths (e.g. `/contact/`, `/services/`) so Live Server and production serve clean URLs without `.html`.
- Updated asset, CSS, JS, fetch, and canonical/OG URLs to root-relative paths (`/assets/...`, `/css/...`, `/js/...`).
- Updated `assets/info/team.json` image paths to `/assets/...` for correct resolution from nested routes.
- Fixed home page nav active-link script to match directory-based pathnames.
