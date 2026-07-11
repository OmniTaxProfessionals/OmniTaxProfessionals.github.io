# OmniTax Professionals — Website

Static marketing site for [OmniTax Professionals](https://www.omnitaxprofessionals.com.au), deployed via GitHub Pages. Built with semantic HTML, CSS, and vanilla JavaScript — no build step required.

## Quick start

```bash
# Serve locally (Node.js)
npx serve .

# Or with Python
python -m http.server 8080
```

Open `http://localhost:3000` (serve) or `http://localhost:8080` (Python).

## Repository structure

```
├── index.html              # Home page
├── careers/                # Careers page
├── contact/                # Contact page
├── dashboard/              # Client login (Firebase — in progress)
├── insights/               # Tax news & insights (PDF feed)
├── our-people/             # Team directory
├── our-services/           # Services overview
├── our-values/             # Firm values
├── privacy/                # Privacy policy
├── terms/                  # Terms of use
│
├── assets/
│   ├── documents/
│   │   ├── insights/       # Published insight PDFs + manifest.json
│   │   ├── legal/          # Privacy policy & website disclaimer PDFs
│   │   └── team/           # Team profile PDFs
│   ├── icons/              # Logos, favicon, value icons
│   ├── images/
│   │   └── team/           # Team headshots & standing photos
│   └── info/               # Content data (team.json, copy text)
│
├── css/styles.css          # Global stylesheet
├── js/                     # Client-side modules
├── scripts/                # Admin CLI tools (Node.js)
├── docs/                   # Developer & admin documentation
├── .github/workflows/      # GitHub Actions for content updates
└── .staging/               # Temporary upload area for Actions
```

## Adding content

See [docs/admin-workflows.md](docs/admin-workflows.md) for step-by-step instructions on adding Insights PDFs and team members via GitHub Actions or local CLI.

## Developer notes

- **Changelog:** [changelog.md](changelog.md) — authoritative record of all changes.
- **Architecture:** [CLAUDE.md](CLAUDE.md) — brand palette, conventions, and page map.
- **Admin workflows:** [docs/admin-workflows.md](docs/admin-workflows.md)

## Tech stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Markup   | HTML5 (semantic, ARIA-labelled)     |
| Styles   | CSS3 — custom properties, Flex/Grid |
| Scripts  | Vanilla JS (ES6+), no frameworks    |
| Auth     | Firebase v10+ (planned)             |
| Hosting  | GitHub Pages                        |
