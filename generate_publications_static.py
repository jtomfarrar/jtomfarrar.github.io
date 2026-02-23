#!/usr/bin/env python3
"""Generate static publications HTML for crawler-friendly indexing.

Usage:
  cd personal_website
  python generate_publications_static.py
"""

from __future__ import annotations

import html
import json
import re
from collections import defaultdict
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "publications-data.js"
HTML_FILE = BASE_DIR / "publications.html"
START_MARKER = "<!-- STATIC_PUBS_START -->"
END_MARKER = "<!-- STATIC_PUBS_END -->"


def load_publications() -> list[dict]:
    raw = DATA_FILE.read_text(encoding="utf-8")
    prefix = "window.CV_PUBLICATIONS ="
    if prefix not in raw:
        raise RuntimeError(f"Could not find {prefix!r} in {DATA_FILE}")
    payload = raw.split(prefix, 1)[1].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def extract_year(citation: str) -> int:
    years = re.findall(r"(?:19|20)\d{2}", citation)
    return int(years[-1]) if years else 0


def extract_url(citation: str) -> str | None:
    doi_url = re.search(r"https?://(?:dx\.)?doi\.org/[A-Za-z0-9._;()/:%-]+", citation, re.I)
    if doi_url:
        return doi_url.group(0)

    doi_plain = re.search(r"(?:doi:\s*|DOI:\s*)(10\.\d{4,9}/[A-Za-z0-9._;()/:%-]+)", citation, re.I)
    if doi_plain:
        return f"https://doi.org/{doi_plain.group(1)}"

    doi_bare = re.search(r"\b(10\.\d{4,9}/[A-Za-z0-9._;()/:%-]+)\b", citation, re.I)
    if doi_bare:
        return f"https://doi.org/{doi_bare.group(1)}"

    generic_url = re.search(r"https?://[A-Za-z0-9./?_=#:%-]+", citation)
    if generic_url:
        return generic_url.group(0)

    return None


def render_item(pub: dict) -> str:
    citation = pub.get("citation", "").strip()
    safe_citation = html.escape(citation)
    number = pub.get("number", "")
    url = extract_url(citation)
    link_html = ""
    if url:
        safe_url = html.escape(url, quote=True)
        link_html = (
            f' <a class="inline-link" href="{safe_url}" target="_blank" rel="noopener">link</a>'
        )
    return f'      <article class="pub-item"><p class="pub-citation">[{number}] {safe_citation}{link_html}</p></article>'


def render_section(title: str, pubs: list[dict], group_key: str) -> str:
    lines = [
        f'  <section class="pub-year-group" data-group="{html.escape(group_key, quote=True)}">',
        f'    <h2 class="pub-year">{html.escape(title)}</h2>',
        '    <div class="pub-year-list">',
    ]
    lines.extend(render_item(pub) for pub in pubs)
    lines.extend(["    </div>", "  </section>"])
    return "\n".join(lines)


def build_static_markup(publications: list[dict]) -> str:
    items = [p for p in publications if p.get("section") != "other"]
    items.sort(key=lambda p: int(p.get("number", 0)))

    in_review = [
        p for p in items if p.get("section") == "review" or "submitted" in p.get("citation", "").lower()
    ]
    published = [p for p in items if p not in in_review]

    for pub in published:
        pub["year"] = extract_year(pub.get("citation", ""))

    groups: dict[str, list[dict]] = defaultdict(list)
    for pub in published:
        key = str(pub["year"]) if pub["year"] else "Undated"
        groups[key].append(pub)

    ordered_years = sorted(
        groups.keys(),
        key=lambda y: -1 if y == "Undated" else int(y),
        reverse=True,
    )

    parts: list[str] = []
    if in_review:
        parts.append(render_section("Manuscripts in review", in_review, "review"))
    for year in ordered_years:
        if year == "Undated":
            parts.append(render_section("Undated", groups[year], "Undated"))
        else:
            parts.append(render_section(year, groups[year], year))
    return "\n".join(parts)


def update_publications_html(static_markup: str) -> None:
    text = HTML_FILE.read_text(encoding="utf-8")
    if START_MARKER not in text or END_MARKER not in text:
        raise RuntimeError(
            f"Could not find markers {START_MARKER!r} and {END_MARKER!r} in {HTML_FILE}"
        )

    replacement = f"{START_MARKER}\n{static_markup}\n      {END_MARKER}"
    updated = re.sub(
        rf"{re.escape(START_MARKER)}.*?{re.escape(END_MARKER)}",
        replacement,
        text,
        flags=re.S,
    )
    HTML_FILE.write_text(updated, encoding="utf-8")


def main() -> None:
    publications = load_publications()
    static_markup = build_static_markup(publications)
    update_publications_html(static_markup)
    print(f"Wrote static publication HTML for {len(publications)} entries.")


if __name__ == "__main__":
    main()
