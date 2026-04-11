# Personal Website (GitHub Pages)

This folder contains a static site for **J. Thomas Farrar**.

## Local preview

From this folder, run any static file server, for example:

```bash
cd personal_website
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a repository named `jtomfarrar.github.io` (recommended for a user site) or any repo name for a project site.
2. Upload the contents of this folder to the repository root.
3. In GitHub: `Settings` -> `Pages`.
4. Set Source to `Deploy from a branch`.
5. Select branch `main` and folder `/ (root)`.
6. Save and wait for the build to complete.

If using a **project site** (not `username.github.io`), update relative links if you later move files into subfolders.

## Files

- `index.html`: page structure and content
- `styles.css`: all styling and responsive behavior
- `script.js`: mobile menu and active nav behavior
- `material/`: local images and CV PDF assets

## Publications page data source

`publications.html` uses:
- `publications-data.js` (bundled publication data; works even when opening HTML directly)
- `material/Tom_CV-6.txt` as parser fallback
- static publication HTML generated into `publications.html` for search-engine crawling

### Quick future update workflow

After updating your CV PDF, run:

```bash
cd personal_website
python update_publications.py
```

Prerequisite: `pdftotext` must be installed and available on `PATH`.

This keeps:
- dynamic search/filter behavior (JavaScript)
- static publication content in page source (better indexing by crawlers)

`update_publications.py` runs the full workflow:

- `pdftotext -layout material/Tom_CV-6.pdf material/Tom_CV-6.txt`
- regeneration of `publications-data.js`
- regeneration of the static publication HTML inside `publications.html`

The wrapper also strips dated CV footer/page artifacts such as `Farrar: April 11, 2026 7/24` so they do not leak into publication citations.
