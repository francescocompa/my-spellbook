#!/usr/bin/env python3
"""Build My Spellbook.

- Writes data/data.js (a `window.__DATA__ = …` global) so the dev page at
  src/index.html works when served locally.
- Writes dist/index.html: a single self-contained file (CSS + data + JS all
  inlined) that runs offline by double-click and can be published as-is.

Run `python extract.py` first to (re)generate data/data.json from a 5etools
mirror; then `python build.py`.
"""
import json, os
ROOT = os.path.dirname(os.path.abspath(__file__))

def read(*p): return open(os.path.join(ROOT, *p), encoding="utf-8").read()

data_json = read("data", "data.json")
assert "</script" not in data_json.lower(), "data contains </script"

# 1. dev global for src/index.html
with open(os.path.join(ROOT, "data", "data.js"), "w", encoding="utf-8") as f:
    f.write("window.__DATA__=" + data_json + ";\n")

# 2. self-contained dist/index.html
html = read("src", "index.html")
css  = read("src", "styles.css")
appjs = read("src", "app.js")
extractjs = read("src", "extract.js")
html = html.replace('<link rel="stylesheet" href="styles.css">',
                    "<style>\n" + css + "\n</style>")
html = html.replace('<script src="extract.js"></script>',
                    "<script>\n" + extractjs + "\n</script>")
html = html.replace('<script src="app.js"></script>',
                    "<script>\n" + appjs + "\n</script>")

# 2a. dist/index.html — self-contained, WITH baked data (personal offline build)
dist = html.replace('<script src="../data/data.js"></script>',
                    "<script>window.__DATA__=" + data_json + ";</script>")
os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
with open(os.path.join(ROOT, "dist", "index.html"), "w", encoding="utf-8") as f:
    f.write(dist)

# 2b. docs/index.html — public GitHub Pages build. Ships the SRD 5.2 subset
# (CC-BY-4.0, safe to distribute); importing a 5etools export adds the rest.
srd_file = os.path.join(ROOT, "data", "data-srd.json")
srd_js = "window.__PUBLIC__=1;"
if os.path.exists(srd_file):
    srd_js += "window.__DATA__=" + read("data", "data-srd.json") + ";"
shell = html.replace('<script src="../data/data.js"></script>', "<script>" + srd_js + "</script>")
os.makedirs(os.path.join(ROOT, "docs"), exist_ok=True)
with open(os.path.join(ROOT, "docs", "index.html"), "w", encoding="utf-8") as f:
    f.write(shell)
with open(os.path.join(ROOT, "docs", ".nojekyll"), "w", encoding="utf-8") as f:
    f.write("")

print(f"data.js {len(data_json)//1024} KB · dist {len(dist)//1024} KB (with data) · docs {len(shell)//1024} KB (shell only)")
