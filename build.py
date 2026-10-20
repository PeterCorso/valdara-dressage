"""Render src/pages/*.html into the site root using src/layout.html.

Each page starts with a header comment:
    <!-- title: Page title | description: Meta description | nav: horses -->
Run:  python3 build.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
LAYOUT = (ROOT / "src" / "layout.html").read_text()
NAV_KEYS = ["home", "curriculum", "horses", "calendar", "lessons", "blog", "contact"]
CHEV = '<svg viewBox="0 0 9 14" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M1.5 1.5 7 7l-5.5 5.5"/></svg>'
ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>'

for page in sorted((ROOT / "src" / "pages").glob("*.html")):
    raw = page.read_text()
    head = re.match(r"\s*<!--(.*?)-->", raw, re.S)
    meta = dict(
        (k.strip(), v.strip())
        for k, v in (
            part.split(":", 1)
            for part in re.split(r"\s\|\s(?=(?:title|description|nav):)", head.group(1).strip())
        )
    )
    body = raw[head.end():].strip("\n")
    html = LAYOUT.replace("{{body}}", body)
    html = html.replace("{{title}}", meta["title"]).replace("{{description}}", meta["description"])
    html = html.replace("{{page}}", page.stem)
    for key in NAV_KEYS:
        html = html.replace("{{nav:%s}}" % key, ' aria-current="page"' if meta.get("nav") == key else "")
    html = html.replace("{{chev}}", CHEV).replace("{{arrow}}", ARROW)
    (ROOT / page.name).write_text(html)
    print("built", page.name)
