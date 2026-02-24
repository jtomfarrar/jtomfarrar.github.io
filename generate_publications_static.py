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
LINK_JS_FILE = BASE_DIR / "publications.js"
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


def load_link_maps() -> tuple[dict[int, str], list[tuple[str, str]]]:
    text = LINK_JS_FILE.read_text(encoding="utf-8")
    number_map: dict[int, str] = {}
    title_map: list[tuple[str, str]] = []

    number_block = re.search(r"DIRECT_LINKS_BY_NUMBER\s*=\s*\{(.*?)\};", text, re.S)
    if number_block:
        for n, url in re.findall(r'(\d+)\s*:\s*[\'"]([^\'"]+)[\'"]', number_block.group(1)):
            number_map[int(n)] = url

    for key, url in re.findall(r"key:\s*'([^']+)'\s*,\s*\n\s*url:\s*'([^']+)'", text):
        title_map.append((key.lower(), url))

    return number_map, title_map


def mapped_url(citation: str, title_map: list[tuple[str, str]]) -> str | None:
    lower = citation.lower()
    for key, url in title_map:
        if key in lower:
            return url
    return None


def scholar_search_url(citation: str) -> str:
    cleaned = re.sub(r"[†∗*]", "", citation)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    from urllib.parse import quote_plus

    return f"https://scholar.google.com/scholar?q={quote_plus(cleaned)}"


def render_item(pub: dict, number_map: dict[int, str], title_map: list[tuple[str, str]]) -> str:
    citation = pub.get("citation", "").strip()
    safe_citation = html.escape(citation)
    number = pub.get("number", "")
    url = (
        number_map.get(int(number))
        or extract_url(citation)
        or mapped_url(citation, title_map)
        or scholar_search_url(citation)
    )
    link_html = ""
    if url:
        safe_url = html.escape(url, quote=True)
        link_html = (
            f' <a class="inline-link" href="{safe_url}" target="_blank" rel="noopener">link</a>'
        )
    return f'      <article class="pub-item"><p class="pub-citation">[{number}] {safe_citation}{link_html}</p></article>'


def render_section(
    title: str, pubs: list[dict], group_key: str, number_map: dict[int, str], title_map: list[tuple[str, str]]
) -> str:
    lines = [
        f'  <section class="pub-year-group" data-group="{html.escape(group_key, quote=True)}">',
        f'    <h2 class="pub-year">{html.escape(title)}</h2>',
        '    <div class="pub-year-list">',
    ]
    lines.extend(render_item(pub, number_map, title_map) for pub in pubs)
    lines.extend(["    </div>", "  </section>"])
    return "\n".join(lines)


def build_static_markup(
    publications: list[dict], number_map: dict[int, str], title_map: list[tuple[str, str]]
) -> str:
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
        parts.append(render_section("Manuscripts in review", in_review, "review", number_map, title_map))
    for year in ordered_years:
        if year == "Undated":
            parts.append(render_section("Undated", groups[year], "Undated", number_map, title_map))
        else:
            parts.append(render_section(year, groups[year], year, number_map, title_map))
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
    number_map, title_map = load_link_maps()
    static_markup = build_static_markup(publications, number_map, title_map)
    update_publications_html(static_markup)
    print(f"Wrote static publication HTML for {len(publications)} entries.")


if __name__ == "__main__":
    main()
