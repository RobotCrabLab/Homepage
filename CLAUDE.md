# Breadboard Bay: notes for Claude

- **Site:** Chris's personal Jekyll site, live at robotcrablab.github.io/Homepage and published from `main`. Never mention GitHub Pages on the site. Backup of the finished phone layout: branch `backup/mobile-layout-2026-11-02`.
- **Workflow:** preview every change with Playwright screenshots (phone, computer, dark mode), then push live unless Chris asks to review first. Keep edits minimal. "N px" means pixels on the preview he's looking at.
- **Art style:** simple one-line illustrations, thick navy `#14303F` outlines, flat colors. Show mockups before final art for anything new. Breadboard wiring must make electrical sense (wire ends in different column strips or across the center gap).
- **Tone:** professional but quirky.
- **Home page:** one portrait card with three scenes (`data-scene` 1–3 in `index.html`): 1 osprey on a branch (no caption), 2 "Electronics technician" (microscope + AUV), 3 "Marine scientist" (fish + jellyfish). Captions roll up going forward and down going back.
- **Phones:** the home page is a fixed full-screen card with no footer. Swipes/scrolls step through the scenes. A better phone nav menu is still to do.
- **Osprey:** `_includes/osprey.svg`. A script sizes it to fit between "I'm Chris." and the top of the head. The head nod is an SVG `animateTransform` and the wash and osprey sit on their own layers (`will-change`), both to keep Safari from drawing a box around the head.
- **Open ideas, not approved:** merging Blog + Projects into "Posts", replacing the placeholder email, removing the hello-world post, a résumé summary, a custom domain.
