# Breadboard Bay: notes for Claude

Chris's personal site: portfolio, projects, blog, résumé and bird photography. Jekyll,
live at breadboardbay.com (domain from Namecheap; `CNAME` file, `baseurl: ""`), published automatically from `main`.
Chris is an electronics technician in ocean research who also photographs birds.
The site should feel like him: professional but quirky, hand-made, a little playful.

## The idea: Breadboard Bay

Breadboard Bay is an imaginary bay where the sea life (and the machines) are built
out of solderless breadboards, the white prototyping boards with rows of holes that
electronics people plug parts and jumper wires into. It joins Chris's two worlds:
electronics and the ocean. Every new character or prop should feel like it belongs
there: a real animal or object whose body *is* a breadboard, or that interacts with
one.

### How the breadboard look works (keep it consistent)
- **Body = a rounded breadboard.** Creatures are a simple rounded shape (the fish is a
  rounded rectangle, the jelly a bell, the AUV a long hull) filled with a flat color,
  usually the red `#D9442B`; the osprey's chest is the pale `#E3ECEA`.
- **Holes:** small navy dots, radius 1.1 on a 4-unit grid, laid out in neat rows and
  columns like a real board. When a request says "match the holes", match this size
  and spacing.
- **Center channel:** a thin divider line between the two halves of the hole grid, like
  the gap down the middle of a real breadboard (thin navy or gray line, low opacity).
  It should span exactly the visible holes, no longer.
- **Parts straddle the channel** with their legs in the rows on either side (chips,
  resistors, capacitors), the way you'd really place them.
- **Wiring must make electrical sense.** A jumper wire's two ends go into holes in
  *different* column strips, or across the center gap. Never both ends in the same
  strip (that's a short that does nothing). Fins and tentacles are often jumper wires
  plugged into holes.
- **Things that touch a board plug into its holes:** the osprey's talons are the same
  diameter as the holes and grip the fish by plugging into them, one row apart.

### The cast (all inline SVG in `_includes/` or `assets/images/`)
- `breadboard-fish.svg`: red breadboard fish with a jumper-wire fin. Swims across the
  home card right to left.
- `breadboard-auv.svg`: an AUV whose hull is one long breadboard, with a white nose
  cone, ducted thruster, parts on the channel, and a headlight beam in dark mode only.
- `mascot.svg`: the jellyfish mascot, a red breadboard bell with tentacles; two of them
  are jumper wires plugged into the bottom row. Swims up at about 40 degrees.
- `osprey.svg`: an osprey with a breadboard chest, gripping a breadboard fish on a dead
  branch. Drawn in layers: body, branch, fish, legs, fish holes, and the head (which nods;
  it's a separate drawing so it can turn without the rest being redrawn).
- `osprey-dive.svg`: the same osprey in flight (gliding, diving, carrying the fish) and its splash.
- `breadboard-drawing.svg`: a stylized engineering drawing of a half-size (400-point) breadboard (top view,
  front view, an enlarged detail of one five-hole strip, real dimensions in mm, a title block "Breadboard Bay,
  DWG NO. BBB-001, drawn: Chris"), in the "Welcome to Breadboard Bay" post. Uses the text color.
- `crab-walker.svg`: a breadboard crab that walks into the footer, blowing bubbles.
- `dock.svg`: a wooden working pier with rope, a cleat, a life ring and a ladder, at the water
  line behind the boater ID (computers only).
- `microscope.svg`: a gray rework microscope with a ring light over a green circuit
  board in a holder.
- `assets/images/scientist.svg`: Chris's character (brown hair and beard, brown work
  shirt, screwdriver and sample bottle in the pocket).
- `assets/images/breadboard-bay-sign.svg`: the logo, two wooden plank signs reading
  BREADBOARD / BAY (not shown anywhere on the site at the moment).
- `assets/images/share.png`: the link preview picture (1200 × 630, the character alone on a see-through
  background, cut off on one straight line across his shirt and sleeves, like the photo frame does), set for every page in `_config.yml`.
  Rebuild it from `scientist.svg` if the character changes.
- Behind the character in the home card's photo: one solid color, the bottom of the ocean gradient
  (`--sea-bottom`: `#9CC3CF` light, `#2C5062` dark).

## Visual style
- Simple one-line illustrations: thick navy `#14303F` outlines, flat colors, round
  joins, no gradients or shading inside the art. Chunky and friendly, not detailed.
- Palette (top of `assets/css/style.css`): ink `#14303F`, red `#D9442B`, page grey
  `#E5E7E9`; dark mode page `#0F2029` with light ink `#E3ECEA` and red `#FF6E52`.
  Osprey browns `#6B4A35`, branch `#A89A8C`, metal gray `#A7B2B8`, yellow `#F2B33D`.
- Fonts: Fraunces (display) and Work Sans (body), served from `assets/fonts/`.
- Light and dark mode both matter; check both. Dark mode follows the device's setting;
  there is no switch on the site.
- **For new art, show a mockup (or a few options) before building the final version.**

## Home page (`index.html`)
- One portrait card with three scenes (`data-scene` 1–3). On computers it
  sits on a white breadboard "boater ID" card, always 1.6 times as wide as tall (its contents
  scale with it, sized in `--u`), and the skills on the card switch the scenes (Electronics:
  scene 2; Science: scene 3; Leadership: scene 1). The card opens on Science and steps to the next
  skill every 10 seconds (in listed order). Picking a skill shows it for a full 10 seconds, then the rotation carries
  on from there. It waits only while someone is tabbing through the card with the keyboard, and doesn't rotate with
  reduced motion. Only the card, "Built by Chris" and the crab
  show on this page at those widths (the site has no header or footer links), over a pastel bay
  (cream sky, a filled wave drifting back and forth 15% down the page, water deepening to
  the bottom) with the pier: its columns end under the wave and its ladder is in front of it. The page heading is hidden on
  computers, except for screen readers, and the page fits one screen with no scrolling.
  On every layout the card is laid out like a printed ID: under the band, the photo and fields on plain white,
  each a small grey label over a bold capital value: BOATER NAME "CHRIS" with "No. BBB 001"; SKILLS: as three plain
  capital words (the chosen one dark with a red underline, the others grey); under them a short summary of the
  chosen skill (from the résumé), which changes with the scene; the links as fields with red values and no icons;
  and a SIGNATURE in a handwriting font (Mrs Saint Delafield, `assets/fonts/signature.woff2`). No background
  pattern, no ghost photo. On computers the photo is at the left with the fields beside it.
  The card's header is a navy band across its top edge (like a state-issued card), with "Breadboard Bay" in
  large white letters and "Boater ID" in yellow. A breadboard power rail (red + line, two rows of holes in groups
  of five, blue − line, + and − at both ends) runs under the band (not along the card's bottom), on every layout.
  The photo is shorter on computers and the osprey's branch is snapped off there.
  The labels read "Skills:", "Resume:", "Hobbies:", "Posts:" and the signature's "Signature:" (with colons);
  Skills, Resume, Hobbies and Posts are as dark as the name, the other labels grey.
  The link fields: Resume links to the résumé, Hobbies to Photography (both side by side), and Posts lists
  the four newest posts and projects, newest first, each its own link, with titles as written (not capitals). The three scenes:
  1. Osprey on its branch in the background. Each time this scene comes up, the osprey dives for its fish
     (`dive()` in site.js, about 6.2 seconds, none with reduced motion): the branch starts empty, the bird glides
     off left, dives behind him with talons out, splashes into the water and flies back to the branch carrying
     the fish. As it comes in to land it turns round to face left: the carrying drawing turns edge-on just as its talons touch the branch, and at that instant (while it's a thin line) the perched bird and its fish take over and finish the turn, leaning 16° forward, then tilt smoothly up into the perch (0.25 s each half of the turn, 0.7 s to tilt up). Only one drawing is ever on show, with no blending, and the bird's head, legs and wings stay fixed to its body. `osprey.svg` is in layers (body, branch, fish, legs, fish holes, nodding head) so the bird and fish can turn and tilt while the branch stays still. It lands exactly where it took off (fish on fish) so each dive ends the way it began. Its path is one smooth curve, and while flapping it rides a slow, gentle wave (about
     1.1 seconds per rise and fall). The flying bird is `_includes/osprey-dive.svg` (glide, dive and carry poses, drawn facing right,
     plus the splash), all behind the character.
  2. The microscope slides in, the AUV cruises across.
  3. The fish and the jellyfish. Each time this scene comes up (including when the page opens on it), a school
     of five small breadboard fish swims across the photo behind him, right to left in about 4.5 seconds, loosely spread out
     but drifting together, each wiggling and wagging its tail like the big fish (`school()` in site.js).
- No caption shows under the photo on any layout.
- **Phones (up to 40rem):** the same card, sheets, prints and page swaps as computers, but all water
  with no pier, waves, sky or footer, and the card at the top of the screen. The boater ID stands upright and fills
  the screen: the band and rail, then the photo upright (portrait, about 1.66 times as tall as wide on most phones)
  at the left with BOATER NAME, No., Resume, Hobbies and SKILLS beside it (the three skills stacked; on phones the
  chosen one has a thin red box around it instead of the underline), then the summary (a little larger) right under
  the photo, then Posts a little under it (the summary is always as tall as the longest one, so Posts never moves),
  with bigger titles spread evenly down the space (a little tighter, with a gap above the signature, which sits a little up from the card's bottom edge), listing as many posts as fit above the signature (the home page lists up to 12; `fitPosts()`
  in site.js hides the ones that don't fit; everywhere else shows the four newest). Only the skills switch scenes. Titles shrink so "An interesting" fits on one line. The old phone layout is on branch `backup/mobile-layout-2026-11-02`.
- **Sideways phones (over 40rem wide, under 500px tall):** all water with no pier, waves, sky or footer. The
  boater ID fills the screen in three columns: the photo; name, skills and summary; card number, links and
  signature. Sheets fill the height.
- A script sizes the osprey to fit between the top of the photo and the top of the head.
- Only the scene on show is animated. `data-scene` on the section fades the scenes;
  `data-live` lists the scenes still moving (the one on show, plus the one fading out),
  and the rest are paused so they cost nothing.
- **Safari (Chris uses an iPhone):** animate with CSS transforms on a whole element (not on a
  shape inside a drawing), and keep animated art on its own layer (`will-change`). The osprey's
  nod works this way. (The photo used to have a watercolor wash with SVG filters that Safari
  repainted in visible boxes; it's a solid color now.)

## Working with Chris
- Preview every change with screenshots (phone, computer, phone in dark mode), then
  push to `main` unless he asks to review first. Tell him what changed in a line or two.
- Preview tools: `_tools/preview/shoot.py` builds the site without Ruby and takes the
  screenshots (setup steps are at the top of the file).
- Keep edits minimal; change only what he asked. "N px" means pixels on the preview
  image he's looking at.
- Never mention GitHub Pages anywhere on the site.
- The stylesheet and `site.js` are linked with `?v=` and the build time, so each publish gets a fresh address
  and phones don't keep an old cached copy.
- **Where the code lives:** all styles are in `assets/css/style.css`, in numbered sections
  listed at its top (the bay, the card, the scenes, the paper, each page, phones, print).
  All scripts are in `assets/js/site.js`, in four sections: Home, Photos, Pages, Crab.
  Pages hold no scripts of their own. The home page, the shell around every page and the footer are
  `index.html`, `_layouts/default.html` and `_includes/footer.html`.
- **Single page app:** the Pages section of `site.js` swaps the content of `<main>` instead of
  loading pages, so the bay never reloads, on phones too. After each swap it calls `setUp()`,
  which runs the Home and Photos sections again for the new content, so anything a page
  needs set up belongs there. A page is fetched as soon as a pointer or finger lands on
  its link. Between pages the old one rises and fades out just under the
  water, then the new one slides up from the bottom.
- **Short addresses:** `/resume`, `/photography`, `/posts/` (the list) and `/posts/<name>`. Jekyll writes
  `resume.html` and so on, and the host serves them without `.html`. Old addresses (`/resume/`, `/blog/…`,
  `/projects/…`) aren't forwarded; they show the 404 page. Don't give a page a folder with the same name
  as a `.html` page (no `resume/` beside `resume.html`). The preview server serves addresses the same way.
- The site as it was before the November 2026 clean-up is on branch `backup/before-cleanup-2026-11-09`.
- **Other pages on computers:** a logbook sheet (`.sheet`, in `_layouts/default.html`) in the same
  bay; the paper is near-white, set in the device's own font (San Francisco on Apple devices) with no ruled lines, and scrolls inside its edges. A breadboard power rail runs down its left margin:
  its + and − stay at the top beside the header, and the holes scroll with the words (phones, upright or
  sideways, have no rail). Its Home button is a plain square-cornered key (no LED). On a single post or project, a matching "Posts" key beside it links back to the Posts list. On the résumé, section headings sit on a
  row of holes and the bullets are square holes (screen only). Blog posts have no "Blog" line above the title. No scrollbar shows; a soft fade at the paper's bottom edge hints at more below. On phones the paper only moves up and down (no sideways scrolling; code wraps). Its wrappers are `display: contents` in print.
- **Résumé PDF:** `assets/chris-resume.pdf`, behind the "Download PDF" button on the résumé page (`pdf:` in
  `_data/resume.yml`). It's made from the page itself by `_tools/preview/resume_pdf.py`, word for word, on two
  US Letter pages (a "Chris / breadboardbay.com" band at the top, then the summary and every section; no email,
  since it's still the placeholder). Rerun the script and commit the PDF whenever `_data/resume.yml` changes;
  it stops with an error if the résumé would run past two pages.
- **Photography on computers:** no paper. The words sit in the water (`.sheet-album`) and each photo
  is an instant film print, same height and uncropped, with its caption in the thick bottom strip.
- **Posts:** blog posts and projects are one category, "Posts". `/posts/` lists both, newest first
  (projects show their status). They're still two collections (`_posts/` and `_projects/`), but both live at
  `/posts/<name>`, with no trailing slash and no date folders. A project needs a `date:` to take its place in the list. Both are labelled
  "Ship's log" on the paper.
- Open ideas, **not approved yet**: replacing the
  placeholder email (`you@example.com`), a résumé
  summary.
