"""Make the downloadable résumé PDF (assets/chris-resume.pdf) from the résumé page.

    python3 _tools/preview/resume_pdf.py

It builds the site with build.py, takes the words straight from the built /resume page (so the
PDF always says exactly what the page says), lays them out for US Letter paper in the site's
fonts and colors, and checks the result is no more than two pages. Run it again whenever
_data/resume.yml changes, and commit the new PDF.
"""
import os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(SITE, "assets", "chris-resume.pdf")
MAX_PAGES = 2

CSS = """
@font-face { font-family: Fraunces; src: url("FONTS/fraunces.woff2") format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Work Sans"; src: url("FONTS/work-sans.woff2") format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Work Sans"; src: url("FONTS/work-sans-italic.woff2") format("woff2"); font-weight: 100 900; font-style: italic; }
@page { size: Letter; margin: 0.45in 0.55in 0.45in; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { background: #fff; }   /* plain white paper */
body { margin: 0; font: 9.1pt/1.32 "Work Sans", sans-serif; color: #1d2b33; }
a { color: inherit; text-decoration: none; }
/* the name band across the top, like the boater ID's */
.top { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 2.2pt solid #14303F; padding-bottom: 5pt; margin-bottom: 7pt; }
.top h1 { font: 700 24pt/1 Fraunces, Georgia, serif; color: #14303F; margin: 0; letter-spacing: -0.01em; }
.top .site { font: 600 8.6pt/1 "Work Sans", sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: #D9442B; }
.top .site .at { font-size: 7pt; letter-spacing: 0.02em; text-transform: none; color: #5d6b72; }   /* "chris@" small and grey, like the dates */
.lede { margin: 0 0 9pt; font-size: 9.6pt; color: #33434b; }
h2 { font: 700 11.5pt/1 Fraunces, Georgia, serif; color: #14303F; margin: 9pt 0 5pt; padding-bottom: 3pt; border-bottom: 0.8pt solid #c9d3d6; break-after: avoid; }
h2::before { content: ""; display: inline-block; width: 6pt; height: 6pt; border-radius: 1.5pt; background: #D9442B; margin-right: 6pt; vertical-align: 0.5pt; }
ol, ul { margin: 0; padding: 0; list-style: none; }
.timeline > li { display: grid; grid-template-columns: 1.02in 1fr; column-gap: 10pt; margin-bottom: 6pt; }   /* a long job may run on to the next page */
.when { margin: 1.5pt 0 0; font-size: 8.3pt; font-weight: 600; color: #5d6b72; letter-spacing: 0.02em; }
.what h3 { break-after: avoid; margin: 0; font-size: 10pt; font-weight: 700; color: #14303F; line-height: 1.25; }
.where { break-after: avoid; margin: 0 0 2pt; font-size: 8.8pt; font-style: italic; color: #47565d; }
.what p { margin: 0 0 2pt; }
.what ul li { position: relative; padding-left: 9pt; margin-bottom: 1.2pt; break-inside: avoid; }
.what ul li:first-child { break-before: avoid; }   /* a job never ends a page with just its title */
.what ul li::before { content: ""; position: absolute; left: 0; top: 4.4pt; width: 3.2pt; height: 3.2pt; background: #14303F; border-radius: 0.6pt; }
.skills { margin: 0; }
.skills > div { display: grid; grid-template-columns: 1.02in 1fr; column-gap: 10pt; margin-bottom: 3.5pt; break-inside: avoid; }
.skills dt { font-weight: 700; color: #14303F; font-size: 8.8pt; }
.skills dd { margin: 0; }
.cert-issuer { display: block; font-weight: 500; font-style: italic; color: #5d6b72; font-size: 8pt; }
.pubs li { margin-bottom: 4pt; break-inside: avoid; }
.pubs p { margin: 0; }
.pub-note { font-size: 8.6pt; color: #5d6b72; }
"""


def main():
    with tempfile.TemporaryDirectory() as tmp:
        out_site = os.path.join(tmp, "site")
        subprocess.run([sys.executable, os.path.join(HERE, "build.py"), SITE, out_site], check=True, stdout=subprocess.DEVNULL)
        page = open(os.path.join(out_site, "resume.html"), encoding="utf-8").read()
        art = page[page.index("<article"):page.index("</article>") + len("</article>")]
        # The page's own header (the "Resume" heading, its buttons and links) is for the screen;
        # the PDF gets a name band instead, then the same summary and sections, word for word.
        lede = re.search(r'<p class="lede">.*?</p>', art, re.S).group(0)
        body = art[art.index("</header>") + len("</header>"):art.rindex("</article>")]
        fonts = "file://" + os.path.join(SITE, "assets", "fonts")
        html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Chris — Resume</title>
<style>{CSS.replace("FONTS", fonts)}</style></head><body>
<div class="top"><h1>Chris</h1><a class="site" href="mailto:chris@breadboardbay.com"><span class="at">chris@</span>breadboardbay.com</a></div>
{lede}{body}</body></html>"""
        src = os.path.join(tmp, "resume-print.html")
        open(src, "w", encoding="utf-8").write(html)

        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            b = p.chromium.launch()
            pg = b.new_page()
            pg.goto("file://" + src)
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(300)
            pg.pdf(path=OUT, format="Letter", print_background=True, prefer_css_page_size=True)
            b.close()

    pages = len(re.findall(rb"/Type\s*/Page[^s]", open(OUT, "rb").read()))
    print(f"{OUT}: {pages} page(s)")
    if pages > MAX_PAGES:
        sys.exit(f"The résumé runs to {pages} pages; tighten the layout in {__file__} to fit {MAX_PAGES}.")


if __name__ == "__main__":
    main()
