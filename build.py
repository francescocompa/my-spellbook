#!/usr/bin/env python3
"""Build My Spellbook.

- Writes data/data.js (a `window.__DATA__ = …` global) so the dev page at
  src/index.html works when served locally.
- Writes dist/index.html: a single self-contained file (CSS + data + JS all
  inlined) that runs offline by double-click and can be published as-is.

Run `python extract.py` first to (re)generate data/data.json from a 5etools
mirror; then `python build.py`.
"""
import hashlib, json, os, shutil, sys
ROOT = os.path.dirname(os.path.abspath(__file__))

def copy_icon(dest):
    """apple-touch-icon.png lives in src/ and is copied beside every build.

    The favicon is a data URI inside the HTML, but iOS ignores data: URIs for
    apple-touch-icon and Safari on the desktop falls back to it too, so this one
    has to be a real file next to index.html or the tag 404s.
    """
    src = os.path.join(ROOT, "src", "apple-touch-icon.png")
    if os.path.exists(src):
        shutil.copyfile(src, os.path.join(ROOT, dest, "apple-touch-icon.png"))

def copy_pwa_icons(dest):
    """The install icons. A manifest needs real files at real sizes — it cannot take
    the data: URI the favicon uses, and iOS/Android read these for the home screen."""
    out = os.path.join(ROOT, dest, "icons")
    os.makedirs(out, exist_ok=True)
    for n in ("icon-192.png", "icon-512.png", "icon-maskable-512.png"):
        src = os.path.join(ROOT, "src", "icons", n)
        if os.path.exists(src):
            shutil.copyfile(src, os.path.join(out, n))

MANIFEST = {
    "name": "My Spellbook",
    "short_name": "Spellbook",
    "description": "Plan a D&D 2024 character's spells: what you can take, at which "
                   "level, and from which source. Works offline.",
    "start_url": "./", "scope": "./", "display": "standalone",
    # one value has to serve both themes; the <meta name="theme-color"> pair in the
    # page is media-scoped and wins wherever it is honoured
    "background_color": "#f4f1ea", "theme_color": "#f4f1ea",
    "icons": [
        {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
        {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
        {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
    ],
}

PWA_HEAD = ('<link rel="manifest" href="manifest.webmanifest">\n'
            '<meta name="mobile-web-app-capable" content="yes">\n'
            '<meta name="apple-mobile-web-app-capable" content="yes">\n'
            '<meta name="apple-mobile-web-app-title" content="Spellbook">')

SW = """// My Spellbook — offline shell for the published build.
// Written by build.py; CACHE carries the build's own stamp, so a deploy retires every
// older cache the first time the new worker activates.
const CACHE = "spellbook-%s";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./apple-touch-icon.png",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // addAll is all-or-nothing: one 404 would sink the whole install and the app would
    // never gain an offline copy at all. Cache what is actually there instead.
    await Promise.allSettled(SHELL.map(u => cache.add(u)));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Stale-while-revalidate. The page comes from the cache instantly and works with no
// network at all; the copy fetched behind it lands in the cache for the NEXT load, so
// an update is always exactly one reload behind — the trade taken deliberately, since
// the alternative is a 1 MB blocking download every time the app opens. GitHub Pages
// sends ETags, so that background fetch is a 304 whenever nothing has changed.
// The imported 5etools digest is NOT here: it lives in IndexedDB (D93) and never
// touches the network.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return;   // not ours to cache
  e.respondWith((async () => {
    try {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req, {ignoreSearch: true});
      const net = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      return hit || await net || new Response("Offline", {status: 503, statusText: "Offline"});
    } catch (_) {
      return fetch(req);   // the cache layer is never the reason a page fails to load
    }
  })());
});
"""

def read(*p): return open(os.path.join(ROOT, *p), encoding="utf-8").read()

# The live version, shown in the app's footer. One file is the source of truth: bump.py
# writes it, build.py injects it, app.js renders it. MAJOR.MINOR, minor per commit — the
# major only ever moves on Francesco's say-so.
VERSION = read("VERSION").strip()

data_json = read("data", "data.json")
assert "</script" not in data_json.lower(), "data contains </script"

# every inline step is an exact-string replace — a marker that silently fails to match
# ships a page referencing files that don't exist beside it, so each must match exactly once
def sub_once(html, marker, replacement):
    assert html.count(marker) == 1, f"inline marker not found exactly once: {marker!r}"
    return html.replace(marker, replacement)

# 1. dev global for src/index.html
with open(os.path.join(ROOT, "data", "data.js"), "w", encoding="utf-8") as f:
    f.write("window.__VERSION__=" + json.dumps(VERSION) + ";\n")
    f.write("window.__DATA__=" + data_json + ";\n")

# 2. self-contained dist/index.html
html = read("src", "index.html")
css  = read("src", "styles.css")
appjs = read("src", "app.js")
extractjs = read("src", "extract.js")
for nm, txt in (("app.js", appjs), ("extract.js", extractjs), ("styles.css", css)):
    assert "</script" not in txt.lower(), f"{nm} contains </script"
# C3-03: styles.css is the one blob wrapped in <style>, not <script> — the </script guard
# above is irrelevant to how IT is inlined, and nothing checked the tag that actually closes
# it. A literal "</style" in a comment or a content: string would truncate the inlined sheet
# and leak the rest of it as raw page text in dist/index.html and docs/index.html.
assert "</style" not in css.lower(), "styles.css contains </style"
html = sub_once(html, '<link rel="stylesheet" href="styles.css">',
                "<style>\n" + css + "\n</style>")
html = sub_once(html, '<script src="extract.js"></script>',
                "<script>\n" + extractjs + "\n</script>")
html = sub_once(html, '<script src="app.js"></script>',
                "<script>\n" + appjs + "\n</script>")

# 2a. dist/index.html — self-contained, WITH baked data (personal offline build)
dist = sub_once(html, '<script src="../data/data.js"></script>',
                "<script>window.__VERSION__=" + json.dumps(VERSION)
                + ";window.__DATA__=" + data_json + ";</script>")
# no manifest and no worker: dist/ is opened by double-click over file://, where a
# service worker cannot register and an install prompt has no origin to attach to
dist = sub_once(dist, "<!--PWA-->", "")
os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
with open(os.path.join(ROOT, "dist", "index.html"), "w", encoding="utf-8") as f:
    f.write(dist)
copy_icon("dist")

# 2b. docs/index.html — public GitHub Pages build. Ships the SRD 5.2 subset
# (CC-BY-4.0, safe to distribute); importing a 5etools export adds the rest.
srd_file = os.path.join(ROOT, "data", "data-srd.json")
srd_js = "window.__PUBLIC__=1;window.__VERSION__=" + json.dumps(VERSION) + ";"
if os.path.exists(srd_file):
    srd_json = read("data", "data-srd.json")
    assert "</script" not in srd_json.lower(), "SRD data contains </script"
    srd_js += "window.__DATA__=" + srd_json + ";"
else:
    print("WARNING: data/data-srd.json is missing — the docs build will bake NO data",
          file=sys.stderr)
shell = sub_once(html, '<script src="../data/data.js"></script>', "<script>" + srd_js + "</script>")
shell = sub_once(shell, "<!--PWA-->", PWA_HEAD)
os.makedirs(os.path.join(ROOT, "docs"), exist_ok=True)
with open(os.path.join(ROOT, "docs", "index.html"), "w", encoding="utf-8") as f:
    f.write(shell)
with open(os.path.join(ROOT, "docs", ".nojekyll"), "w", encoding="utf-8") as f:
    f.write("")
copy_icon("docs")

# 2c. the install/offline layer — public build only. The stamp is the page's own hash,
# so redeploying an unchanged page does not churn every visitor's cache.
copy_pwa_icons("docs")
stamp = hashlib.sha1(shell.encode("utf-8")).hexdigest()[:12]
with open(os.path.join(ROOT, "docs", "manifest.webmanifest"), "w", encoding="utf-8") as f:
    json.dump(MANIFEST, f, indent=2, ensure_ascii=False)
with open(os.path.join(ROOT, "docs", "sw.js"), "w", encoding="utf-8") as f:
    f.write(SW % stamp)

print(f"v{VERSION} · data.js {len(data_json)//1024} KB · dist {len(dist)//1024} KB (with data) · "
      f"docs {len(shell)//1024} KB (SRD subset) · sw cache spellbook-{stamp}")
