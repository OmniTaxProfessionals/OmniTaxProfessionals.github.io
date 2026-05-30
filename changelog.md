# Changelog — OmniTax Professionals Website

## 2026-05-30 — Clean directory URLs

- Moved all subpages from flat `*.html` files into `{page}/index.html` folders (`contact`, `dashboard`, `services`, `insights`, `careers`, `our-people`, `our-values`).
- Root `index.html` remains at site root (`/`).
- Updated all internal links to root-relative paths (e.g. `/contact/`, `/services/`) so Live Server and production serve clean URLs without `.html`.
- Updated asset, CSS, JS, fetch, and canonical/OG URLs to root-relative paths (`/assets/...`, `/css/...`, `/js/...`).
- Updated `assets/info/team.json` image paths to `/assets/...` for correct resolution from nested routes.
- Fixed home page nav active-link script to match directory-based pathnames.
