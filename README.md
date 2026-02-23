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
pdftotext -layout material/Tom_CV-6.pdf material/Tom_CV-6.txt
```

Then regenerate `publications-data.js` (existing command below), and finally regenerate the static HTML block:

```bash
python generate_publications_static.py
```

This keeps:
- dynamic search/filter behavior (JavaScript)
- static publication content in page source (better indexing by crawlers)

Regenerate when CV is updated:

```bash
cd personal_website
pdftotext -layout material/Tom_CV-6.pdf material/Tom_CV-6.txt
python - <<'PY'
from pathlib import Path
import json,re
base=Path('.')
text=(base/'material'/'Tom_CV-6.txt').read_text(encoding='utf-8',errors='ignore')
pubs=[]; section='peer'; active=None
def norm(s): return s.replace('\x0c','').strip()
def detect(s,c):
  if re.match(r'^Manuscripts in review',s,re.I): return 'review'
  if re.match(r'^Peer-reviewed articles',s,re.I): return 'peer'
  if re.match(r'^Other publications',s,re.I): return 'other'
  return c
def push():
  global active
  if not active: return
  t=re.sub(r'\s+',' ',active['body'])
  t=re.sub(r'\s+([.,;:])',r'\1',t)
  t=re.sub(r'Contributions:\s.*$','',t,flags=re.I).strip()
  if t: pubs.append({'number':active['number'],'section':active['section'],'citation':t})
for raw in text.splitlines():
  line=norm(raw)
  if not line: continue
  if re.match(r'^Conference\s*&\s*Workshop\s*Presentations',line,re.I): break
  if re.match(r'^Farrar:\s+February',line) or re.match(r'^\d+/24$',line): continue
  section=detect(line,section)
  m=re.match(r'^\s*\[(\d+)\]\s*(.*)$',line)
  if m:
    push(); active={'number':int(m.group(1)),'section':section,'body':m.group(2).strip()}; continue
  if not active: continue
  active['body']=active['body'][:-1]+line if active['body'].endswith('-') else active['body']+' '+line
push()
(base/'publications-data.js').write_text('window.CV_PUBLICATIONS = '+json.dumps(pubs,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Wrote',len(pubs),'entries to publications-data.js')
PY
```
