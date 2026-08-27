#!/usr/bin/env python3
"""Bump the version, then rebuild so every deliverable carries the new number.

    python3 bump.py            # 1.4 -> 1.5   (the ordinary case, once per commit)
    python3 bump.py --major    # 1.4 -> 2.0   (Francesco's call, never taken alone)
    python3 bump.py --show     # print the current version and stop

MAJOR.MINOR, where MINOR is a plain counter — 1.9 is followed by 1.10, not 2.0. The
major moves only when Francesco says a release is a release; nothing here decides that
on its own, which is why --major exists as an explicit flag rather than a rule.

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
    major, _, minor = v.partition(".")
    return int(major), int(minor or 0)

def main():
    args = sys.argv[1:]
    cur = read()
    if "--show" in args:
        print(cur); return
    major, minor = parse(cur)
    if "--major" in args:
        major, minor = major + 1, 0
    else:
        minor += 1
    new = f"{major}.{minor}"
    with open(PATH, "w", encoding="utf-8") as f:
        f.write(new + "\n")
    print(f"{cur} -> {new}")
    # a version nothing was built with is a version that lies in the footer
    subprocess.run([sys.executable, os.path.join(ROOT, "build.py")], check=True)

if __name__ == "__main__":
    main()
