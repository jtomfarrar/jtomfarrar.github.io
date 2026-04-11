#!/usr/bin/env python3
"""Regenerate publication artifacts from the CV PDF.

Usage:
  cd personal_website
  python update_publications.py
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

import generate_publications_static


BASE_DIR = Path(__file__).resolve().parent
CV_PDF = BASE_DIR / "material" / "Tom_CV-6.pdf"
CV_TEXT = BASE_DIR / "material" / "Tom_CV-6.txt"
PUBLICATIONS_DATA = BASE_DIR / "publications-data.js"

FOOTER_INLINE_RE = re.compile(
    r"Farrar:\s+[A-Za-z]+\s+\d{1,2},\s+\d{4}\s+\d+/\d+",
    re.I,
)
PAGE_ONLY_RE = re.compile(r"^\d+/\d+$")


def normalize_line(line: str) -> str:
    line = line.replace("\x0c", " ")
    line = FOOTER_INLINE_RE.sub(" ", line)
    if PAGE_ONLY_RE.match(line.strip()):
        return ""
    return re.sub(r"\s+", " ", line).strip()


def detect_section(line: str, current: str) -> str:
    if re.match(r"^Manuscripts in review", line, re.I):
        return "review"
    if re.match(r"^Peer-reviewed articles", line, re.I):
        return "peer"
    if re.match(r"^Other publications", line, re.I):
        return "other"
    return current


def parse_cv_publications(text: str) -> list[dict]:
    pubs: list[dict] = []
    section = "peer"
    active: dict | None = None

    def push_active() -> None:
        nonlocal active
        if not active:
            return
        citation = re.sub(r"\s+", " ", active["body"])
        citation = re.sub(r"\s+([.,;:])", r"\1", citation)
        citation = re.sub(r"Contributions:\s.*$", "", citation, flags=re.I).strip()
        if citation:
            pubs.append(
                {
                    "number": active["number"],
                    "section": active["section"],
                    "citation": citation,
                }
            )
        active = None

    for raw in text.splitlines():
        line = normalize_line(raw)
        if not line:
            continue
        if re.match(r"^Conference\s*&\s*Workshop\s*Presentations", line, re.I):
            break

        section = detect_section(line, section)

        match = re.match(r"^\[(\d+)\]\s*(.*)$", line)
        if match:
            push_active()
            active = {
                "number": int(match.group(1)),
                "section": section,
                "body": match.group(2).strip(),
            }
            continue

        if not active:
            continue

        if active["body"].endswith("-"):
            active["body"] = f"{active['body'][:-1]}{line}"
        else:
            active["body"] = f"{active['body']} {line}"

    push_active()
    return pubs


def run_pdftotext() -> None:
    try:
        subprocess.run(
            ["pdftotext", "-layout", str(CV_PDF), str(CV_TEXT)],
            check=True,
            cwd=BASE_DIR,
        )
    except FileNotFoundError as exc:
        raise RuntimeError("pdftotext is required but was not found in PATH.") from exc
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(f"pdftotext failed with exit code {exc.returncode}.") from exc


def write_publications_data(publications: list[dict]) -> None:
    payload = "window.CV_PUBLICATIONS = " + json.dumps(publications, ensure_ascii=False, indent=2) + ";\n"
    PUBLICATIONS_DATA.write_text(payload, encoding="utf-8")


def main() -> int:
    if not CV_PDF.exists():
        print(f"Missing CV PDF: {CV_PDF}", file=sys.stderr)
        return 1

    run_pdftotext()
    text = CV_TEXT.read_text(encoding="utf-8", errors="ignore")
    publications = parse_cv_publications(text)
    write_publications_data(publications)
    generate_publications_static.main()
    print(f"Wrote {len(publications)} entries to {PUBLICATIONS_DATA.name}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
