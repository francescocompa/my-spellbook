#!/usr/bin/env python3
"""Minimal static server for local dev/preview.

`python3 -m http.server` can't be used under the preview sandbox: its argparse
sets `--directory` default to `os.getcwd()`, and that call is blocked, so the
module crashes before serving. Serving a fixed absolute directory as a library
avoids getcwd() entirely. Root is this file's own folder; port defaults to 8000.
"""
import http.server
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        # dev server: never let the browser cache. Without this, app.js/styles.css get
        # heuristically cached (SimpleHTTP sends only Last-Modified) and edits appear
        # to do nothing — the old "hard-reload after editing" gotcha.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class Server(socketserver.TCPServer):
    allow_reuse_address = True


with Server(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Serving {ROOT} at http://127.0.0.1:{PORT}/src/index.html")
    httpd.serve_forever()
