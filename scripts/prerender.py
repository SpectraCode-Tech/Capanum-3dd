# Usage: npm run build && python3 scripts/prerender.py   (needs: pip install playwright && playwright install chromium)
# Renders every route to static HTML inside dist/ so search engines see real content, then writes sitemap.xml.
import json, os, subprocess, time, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); DIST = os.path.join(ROOT, "dist")
d = json.load(open(os.path.join(ROOT, "src/data.json")))
routes = ["/", "/about", "/services", "/contact", "/faq"] + ["/" + s["f"][:-5] for s in d["SVC"] + d["AUD"]]
import http.server, threading, functools
class SPA(http.server.SimpleHTTPRequestHandler):  # serves index.html for unknown paths, like the real host will
    def send_head(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path): self.path = "/index.html"
        return super().send_head()
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 4190), functools.partial(SPA, directory=DIST)); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    for r in routes:
        pg = b.new_page(viewport=dict(width=1280, height=800)); pg.goto("http://localhost:4190" + r); pg.wait_for_selector(".stage", timeout=15000); pg.wait_for_timeout(1800)
        pg.evaluate("document.querySelector('.loader')?.remove(); document.querySelector('.stage').innerHTML=''; document.body.className=''; document.body.removeAttribute('data-home')")
        html = "<!DOCTYPE html>" + pg.evaluate("document.documentElement.outerHTML")
        out = os.path.join(DIST, "index.html") if r == "/" else os.path.join(DIST, r[1:], "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True); open(out, "w").write(html); pg.close()
    b.close()
srv.shutdown()
base = "https://www.capanumassociates.com"
open(os.path.join(DIST, "sitemap.xml"), "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{base}{'' if r=='/' else r}{'/' if r=='/' else ''}</loc><priority>{'1.0' if r=='/' else '0.8'}</priority></url>\n" for r in routes) + "</urlset>\n")
print(len(routes), "routes prerendered")
