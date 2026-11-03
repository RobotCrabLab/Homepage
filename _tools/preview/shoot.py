"""Preview the site without Ruby: build it with build.py, serve it locally and take
screenshots on a phone, a computer and a phone in dark mode.

Setup (once per machine):
  pip install python-liquid pyyaml markdown playwright --break-system-packages
  cd _tools/preview && npm i @fontsource-variable/fraunces @fontsource-variable/work-sans
Usage (from the repo root):
  python3 _tools/preview/shoot.py OUT_DIR [/Homepage/ /Homepage/projects/ ...]
"""
import glob, os, shutil, subprocess, sys, tempfile, threading, http.server, functools
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
out = os.path.abspath(sys.argv[1]); os.makedirs(out, exist_ok=True)
pages = sys.argv[2:] or ["/Homepage/"]

site = tempfile.mkdtemp()
subprocess.run([sys.executable, os.path.join(HERE, "build.py"), REPO, site], check=True, capture_output=True)
# The live site loads Fraunces and Work Sans from Google Fonts; serve local copies instead
fonts = os.path.join(site, "_f"); os.makedirs(fonts, exist_ok=True)
for f in glob.glob(os.path.join(HERE, "node_modules/@fontsource-variable/*/files/*latin-wght-normal.woff2")) + \
         glob.glob(os.path.join(HERE, "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2")):
    shutil.copy(f, fonts)
FACES = ('@font-face{font-family:"Fraunces";src:url(/_f/fraunces-latin-full-normal.woff2)}'
         '@font-face{font-family:"Work Sans";src:url(/_f/work-sans-latin-wght-normal.woff2)}')

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=site))
port = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()

modes = [("phone", 390, 844, "light"), ("computer", 1280, 900, "light"), ("phone-dark", 390, 844, "dark")]
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, w, h, scheme in modes:
        ctx = b.new_context(viewport={"width": w, "height": h}, color_scheme=scheme, device_scale_factor=2)
        ctx.route("**/fonts.googleapis.com/**", lambda r: r.fulfill(body="", content_type="text/css"))
        pg = ctx.new_page()
        for path in pages:
            pg.goto(f"http://127.0.0.1:{port}{path}")
            pg.add_style_tag(content=FACES)
            pg.wait_for_timeout(1200)
            slug = path.strip("/").replace("/", "_") or "root"
            pg.screenshot(path=os.path.join(out, f"{slug}-{name}.png"), full_page=(name == "computer"))
        ctx.close()
    b.close()
shutil.rmtree(site)
print("screenshots in", out)
