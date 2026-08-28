#!/usr/bin/env python3
"""Bump the version, then rebuild so every deliverable carries the new number.

    python3 bump.py            # 1.2.1 -> 1.2.2  (patch — day-to-day fixes and small batches)
    python3 bump.py --minor    # 1.2.1 -> 1.3.0  (a larger batch that ships features)
    python3 bump.py --major    # 1.2.1 -> 2.0.0  (an overhaul — Francesco's call, never taken alone)
    python3 bump.py --show     # print the current version and stop

MAJOR.MINOR.PATCH (D117, 2026-08-28): the major moves only for overhauls and massive
reworks and only when Francesco says so; the minor is for larger batches that ship
features; the patch is the ordinary once-per-commit counter. Nothing here decides a
major on its own, which is why --major exists as an explicit flag rather than a rule.
The pre-semver 1.x line is mapped, not rewritten — CHANGELOG.md carries the table.

VERSION is the single source of truth: build.py reads it and injects `__VERSION__` into
data.js, dist/index.html and docs/index.html; app.js renders it in the footer.
"""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(ROOT, "VERSION")

def read():
    with open(PATH, encoding="utf-8") as f:
        return f.read().strip()

def parse(v):
    parts = v.split(".")
    while len(parts) < 3:          # a legacy two-part number reads as X.Y.0
        parts.append("0")
    return [int(p) for p in parts[:3]]

def main():
    args = sys.argv[1:]
    cur = read()
    if "--show" in args:
        print(cur); return
    major, minor, patch = parse(cur)
    if "--major" in args:
        major, minor, patch = major + 1, 0, 0
    elif "--minor" in args:
        minor, patch = minor + 1, 0
    else:
        patch += 1
    new = f"{major}.{minor}.{patch}"
    with open(PATH, "w", encoding="utf-8") as f:
        f.write(new + "\n")
    print(f"{cur} -> {new}")
    # a version nothing was built with is a version that lies in the footer
    subprocess.run([sys.executable, os.path.join(ROOT, "build.py")], check=True)

if __name__ == "__main__":
    main()
