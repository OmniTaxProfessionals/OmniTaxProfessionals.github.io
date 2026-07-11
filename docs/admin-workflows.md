# Admin Workflows — Adding Content to the Site

This site is a static GitHub Pages deployment. Content updates are committed to `main`; GitHub Pages redeploys automatically within a minute or two.

Two workflows in **Actions** let you add Insights PDFs and team members without editing JSON by hand. You can also run the same logic locally if you have the repo cloned.

---

## Prerequisites

- **Collaborator access** to the GitHub repo (only collaborators can run Actions workflows).
- Workflows must be on the default branch (`main`) before they appear in the Actions tab. **Push this commit first**, then continue below.

---

## Option A — GitHub Actions (browser only)

GitHub workflow forms cannot accept file uploads directly. Use the **staging folders** in the repo:

| Folder | Purpose |
|--------|---------|
| `.staging/insight/` | Drop a new Insights PDF here |
| `.staging/team/` | Drop card photo, standing photo, and optional profile PDF here |

### Add an Insight PDF

1. On GitHub, go to **`.staging/insight/`** → **Add file** → **Upload files** → upload your PDF → commit to `main`.
2. Open **Actions** → **Add Insight PDF** → **Run workflow**.
3. Fill in:
   - **Title** — shown on the Insights page
   - **Date** — `YYYY-MM-DD`
   - **pdf_filename** — exact filename you uploaded (e.g. `fortnightly-report-may-2026.pdf`)
4. Run the workflow. It will:
   - Copy the PDF to `assets/documents/insights/`
   - Append an entry to `assets/documents/insights/manifest.json` (auto id: `report-002`, `report-003`, …)
   - Remove the staged file and push to `main`

### Add a Team Member

1. Upload files to **`.staging/team/`** on GitHub:
   - Card/headshot photo (JPG recommended)
   - Standing photo (JPG recommended)
   - Profile PDF (optional)
2. Open **Actions** → **Add Team Member** → **Run workflow**.
3. Fill in:
   - **name** — full name (generates id slug, e.g. `Jane Smith` → `jane-smith`)
   - **title** — job title
   - **bio_preview** — short text for the people card
   - **bio** — full bio; separate paragraphs with a **blank line**
   - **card_photo_filename** / **standing_photo_filename** — exact staged filenames
   - **profile_pdf_filename** — optional staged PDF filename
4. Run the workflow. It will:
   - Save images as `/assets/images/team/{slug}.jpg` and `{slug}-standing.jpg`
   - Save PDF to `assets/documents/team/{slug}.pdf` if provided
   - Append to `assets/info/team.json`
   - Remove staged files and push to `main`

---

## Option B — Local CLI (repo cloned)

Requires [Node.js](https://nodejs.org/) 18+. From the repo root:

### Add an Insight PDF

```powershell
node scripts/add-insight.js `
  --title "Fortnightly Tax Report" `
  --date "2026-05-30" `
  --pdf "C:\path\to\report.pdf"

git add assets/documents/insights/
git commit -m "Add insight: Fortnightly Tax Report"
git push
```

### Add a Team Member

```powershell
node scripts/add-team-member.js `
  --name "Jane Smith" `
  --title "Director" `
  --bio-preview "Jane specialises in corporate tax advisory." `
  --bio "First paragraph of full bio.`n`nSecond paragraph.`n`n**Years of Experience**`n`n10+ years" `
  --card-photo "C:\path\to\headshot.jpg" `
  --standing-photo "C:\path\to\standing.jpg" `
  --profile-pdf "C:\path\to\profile.pdf"

git add assets/info/team.json assets/images/team/ assets/documents/team/
git commit -m "Add team member: Jane Smith"
git push
```

Omit `--profile-pdf` if there is no profile PDF.

---

## Bio formatting

The full bio supports plain paragraphs and markdown-style headings used on existing profiles:

```
First introductory paragraph.

Second paragraph with more detail.

**Years of Experience**

10+ years

**Formal Qualifications**

• Member, Chartered Accountants Australia and New Zealand
• Registered Tax Agent
```

Separate each block with a blank line. In the GitHub Actions form, paste the bio directly into the **bio** field.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Workflow not visible in Actions | Push these files to `main` first |
| "Staged PDF not found" | Upload the file to `.staging/insight/` and use the exact filename |
| "Team member already exists" | The name slug is taken; use a distinct name or edit `team.json` manually |
| "PDF already exists" | Rename your PDF or remove the duplicate from `assets/documents/insights/` |
| Site not updated after push | Wait 1–2 minutes; hard-refresh the browser (Ctrl+F5) |

---

## File reference

```
scripts/
  add-insight.js          # Updates manifest + copies PDF
  add-team-member.js      # Updates team.json + copies images/PDF
  lib/utils.js            # Shared helpers

.github/workflows/
  add-insight.yml
  add-team-member.yml

.staging/
  insight/                # Temporary PDF staging for Actions
  team/                   # Temporary image/PDF staging for Actions

assets/
  documents/
    insights/             # Published Insights PDFs + manifest.json
    legal/                # Privacy policy & terms PDFs
    team/                 # Team profile PDFs
  images/
    team/                 # Team headshots and standing photos
  info/                   # Content data (team.json, copy text)
```
