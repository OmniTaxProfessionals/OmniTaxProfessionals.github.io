# Changelog — OmniTax Professionals Website

## 2026-06-20 — Configurable footer logo spacing

- Added `--footer-reg-logo-inset` in `css/styles.css` `:root` to control how close TPB and CAANZ logos sit under the brand copy (default `64px`).

## 2026-06-20 — Footer logos spaced apart; Changelog link removed from site

- TPB and CAANZ footer logos use `space-between` so they sit on opposite sides under the brand copy.
- Removed public footer links to `changelog.md` from `index.html` and `our-services/index.html` (repo-only document).

## 2026-06-20 — Legal pages: no PDF download; larger registration logos

- Removed "Download PDF" buttons from Privacy Policy and Terms of Use pages; inline viewer and cross-page links retained.
- Enlarged footer TPB and CAANZ logos (`height: 84px`, `max-width: 320px`, full opacity) and spaced them to opposite sides under the brand copy site-wide.

## 2026-06-20 — Legal PDFs, footer brand, crisp insight previews, "Big 4" quotes

- Privacy Policy and Terms of Use pages now display the original PDFs from `assets/website legislation/` via inline high-DPI PDF.js viewer (`js/legal-pdf.js`); download links included.
- Footer brand column shows gold "OmniTax Professionals" text instead of the logo; TPB and CAANZ registration badges replaced with `tpb.png` and `caanz.png` logos site-wide.
- Tax News & Insights card previews render at device-pixel-ratio-aware resolution for sharper thumbnails (no CSS upscaling blur).
- Standardised `"Big 4"` quoted styling in `team.json`, meta descriptions, footer copy, and remaining unquoted references.

## 2026-06-20 — Eyebrow dash symmetry; leadership on Our People

- Added matching right-side gold dash (`::after`) to `.hero__eyebrow` and `.tni-eyebrow` so eyebrow labels are flanked on both sides site-wide.
- Inserted the home page leadership block (Managing Directors photo and copy) on `our-people/index.html` above the team card grid; team intro (“Experience You Can Rely On”) precedes leadership; section backgrounds alternate white/off-white through to CTA; CTA scrolls to `#team-grid-heading`.

## 2026-06-20 — Our Services footer aligned with site standard

- Replaced broken footer markup on `our-services/index.html` (stray character, missing `footer__registrations` wrapper, obsolete Services column) with the three-column homepage footer layout.

## 2026-06-20 — Fixed navbar on scroll; footer logo-only brand

- Switched `.navbar` from `sticky` to `fixed` with `--navbar-height` offset on `body` and `scroll-padding-top` on `html` so the nav stays visible while scrolling and anchor links clear the bar.
- Hid `.footer__name` site-wide so footers show the logo only, matching the navbar brand treatment.

## 2026-06-19 — Our People card photo vertical crop offset

- `team.json` uses a `{ defaults, members }` shape with `defaults.cardPhotoOffsetY` to trim top headspace via `object-position`.
- Per-member `cardPhotoOffsetY` overrides the default when present (e.g. Kevin Qi uses `"0%"`; any value from `"0%"` to `"50%"` or pixels).
- `our-people/index.html` applies offset when rendering cards; `add-team-member.js` preserves the new JSON structure.

## 2026-06-19 — Insights card layout: title, date, half-page preview

- Reordered Tax News & Insights cards so title appears first, then date, then the PDF preview below.
- Preview area now clips to the top half of page 1 only (`aspect-ratio: 3/2`) with a subtle fade at the bottom edge.

## 2026-06-19 — PDF viewer larger default size on desktop

- Increased desktop main-page render width cap from 680px to 980px in `js/pdf-viewer.js`; fallback sizing now uses ~56% of viewport width before layout.
- Widened `.pdf-viewer__panel--active` and `.pdf-viewer__carousel` max widths so PDFs open at a substantially larger, readable size on computer screens without manual browser zoom.

## 2026-06-19 — Services navigation links updated to /our-services/

- Replaced all internal `/services/` hrefs with `/our-services/` across navbar, mobile nav, home CTAs, Our Values footer links, and Our Services canonical/OG URLs.

## 2026-06-19 — Hero section full-width layout

- Removed `max-width` constraint from `.hero__inner` so the hero text/photo grid spans the full viewport width (within section padding).
- Removed character-width caps on `.hero__title` and `.hero__subtitle` so copy uses the full text column.

## 2026-06-19 — Hero photo sizing, people card crop, values placeholder copy

- Enlarged home hero team photo by widening the photo grid column (`--hero-photo-column: 1.25fr`); constrained `.hero__inner` to site max-width.
- Our People card photos now anchor from the top (`object-position: top center`) so heads stay visible when cropped.
- Replaced golden-retriever placeholder copy on Our Values cards with lorem ipsum.

## 2026-06-19 — Footer Services navigation removed site-wide

- Removed the "Services footer navigation" column from all pages; updated `.footer__grid` to a three-column layout (brand, company, contact).

## 2026-06-19 — Navbar shows logo only (no company name text)

- Hid `.navbar__name` site-wide so the navigation bar displays only the company logo on every page.

## 2026-05-31 — Site favicon updated to dedicated favicon asset

- Replaced `<link rel="icon">` on all pages from `omnitaxicon.jpg` to `omnitaxfavicon.png`; navbar, footer, and OG logo references unchanged.

## 2026-05-31 — PDF viewer scroll fix (top of document clipped)

- Fixed tall PDF pages being clipped at the top when scrolling: removed `justify-content: center` from the scroll container and used safe `margin: auto` centering so short pages stay centred but long pages scroll from the top.

## 2026-05-31 — Futuristic PDF viewer with character-select page previews

- Redesigned shared PDF viewer (`js/pdf-viewer.js`, `css/styles.css`) with adjacent prev/next page previews on desktop (character-select layout), animated transitions, grid/scanline HUD styling, and progress bar.
- Mobile layout uses full-width active page plus a dock strip with peek thumbnails and arrow controls.
- Migrated Insights page from inline viewer to shared `PdfViewer` component; Our People viewer updated to same markup.

## 2026-05-31 — Complete TNI PDF manifest (excluding Budget Edition)

- Added manifest entries `report-003` through `report-013` in `assets/tnipdfs/manifest.json` for all fortnightly OTP Tax News PDFs; Budget Edition left for manual entry.

## 2026-05-30 — Insights grid sort by date (newest first)

- Tax Insights page now sorts manifest entries by `date` descending before rendering, so the most recent report appears top-left in the grid.

## 2026-05-30 — Home page leadership photo and site-wide explore section

- Added leadership section on home page featuring `/assets/images/owners.jpg` (three Managing Directors) with link to Our People.
- Replaced two-card “Who We Are” teasers with six-card “Explore OmniTax Professionals” grid covering Services, Our People, Our Values, Insights, Careers, and Contact.
- Added `.leadership`, `.about-grid`, `.about-commitments`, and `.teaser-cards--site` styles in `css/styles.css`.

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
