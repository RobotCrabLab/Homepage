# Breadboard Bay: notes for Claude

Chris's personal site: portfolio, projects, blog, résumé and bird photography. Jekyll,
live at robotcrablab.github.io/Homepage, published automatically from `main`.
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
  branch. Its head nods.
- `crab-walker.svg`: a breadboard crab that walks into the footer, blowing bubbles.
- `dock.svg`: a wooden working pier with rope, a cleat, a life ring and a ladder, at the water
  line behind the boater ID (computers only).
- `microscope.svg`: a gray rework microscope with a ring light over a green circuit
  board in a holder.
- `assets/images/scientist.svg`: Chris's character (brown hair and beard, brown work
  shirt, screwdriver and sample bottle in the pocket).
- `assets/images/breadboard-bay-sign.svg`: the logo, two wooden plank signs reading
  BREADBOARD / BAY. Also `kelp.html` (faint background kelp) and the watercolor washes.

## Visual style
- Simple one-line illustrations: thick navy `#14303F` outlines, flat colors, round
  joins, no gradients or shading inside the art. Chunky and friendly, not detailed.
- Palette (top of `assets/css/style.css`): ink `#14303F`, red `#D9442B`, page grey
  `#E5E7E9`; dark mode page `#0F2029` with light ink `#E3ECEA` and red `#FF6E52`.
  Osprey browns `#6B4A35`, branch `#A89A8C`, metal gray `#A7B2B8`, yellow `#F2B33D`.
- Fonts: Fraunces (display) and Work Sans (body).
- Light and dark mode both matter; check both. The theme button shows the current mode.
- **For new art, show a mockup (or a few options) before building the final version.**

## Home page (`index.html`)
- One portrait card with three scenes (`data-scene` 1–3). On computers it
  sits on a white breadboard "boater ID" card, always 1.6 times as wide as tall (its contents
  scale with it, sized in `--u`), and buttons on the card switch the scenes (PCB
  rework/wiring: scene 2; Water science: scene 3; Project lead: scene 1). Only the card, "Built by Chris" and the crab
  show on this page at those widths (no header, kelp or footer links), over a pastel bay
  (cream sky, a filled wave drifting back and forth 15% down the page, water deepening to
  the bottom) with the pier: its columns end under the wave and its ladder is in front of it. The page heading is hidden on
  computers, except for screen readers, and the page fits one screen with no scrolling.
  Under the buttons, a short summary of the chosen skill (from the résumé) changes with the scene.
  The photo is shorter on computers and the osprey's branch is snapped off there.
  A row across the card's bottom holds the links, each with an icon and no underline (logbook page and camera drawn larger): its Resume line links to the résumé, its Hobbies line links to Photography, replacing that header link on this page,
  its Blog line always links to the newest post, and its Projects line links to the
  project listed first on the Projects page (lowest `order`):
  1. Osprey on its branch in the background.
  2. The microscope slides in, the AUV cruises across.
  3. The fish and the jellyfish.
- No caption shows under the photo on any layout.
- **Phones (up to 40rem):** the same card, sheets, prints and page swaps as computers, but all water
  with no pier, waves, sky or footer, and the card at the top of the screen. The boater ID stands upright and fills
  the screen: photo at the left (no caption, about as tall as the summary) with the skill summary beside it, then the buttons, then the links. On phones (upright and sideways) the Resume and Photography
  icons are the links, with one short label each; upright they're each about half the card's width. Only
  the buttons switch scenes. Titles shrink so "An interesting" fits on one line. The old phone layout is on branch `backup/mobile-layout-2026-11-02`.
- **Sideways phones (over 40rem wide, under 500px tall):** all water with no pier, waves, sky or footer. The
  boater ID fills the screen in three columns: photo, name and summary, then buttons and links. Sheets fill the height.
- A script sizes the osprey to fit between "I'm Chris." and the top of the head.
- **Safari (Chris uses an iPhone):** the watercolor wash is an SVG with filters, and
  Safari redraws patches of it with a visible box. Animate with CSS transforms or SVG
  `animateTransform`, and keep animated art on its own layer (`will-change`) over the wash.

## Working with Chris
- Preview every change with screenshots (phone, computer, phone in dark mode), then
  push to `main` unless he asks to review first. Tell him what changed in a line or two.
- Preview tools: `_tools/preview/shoot.py` builds the site without Ruby and takes the
  screenshots (setup steps are at the top of the file).
- Keep edits minimal; change only what he asked. "N px" means pixels on the preview
  image he's looking at.
- Never mention GitHub Pages anywhere on the site.
- **Single page app:** `assets/js/spa.js` swaps the content of `<main>` instead of
  loading pages, so the bay never reloads, on phones too. Scripts inside `<main>` re-run on each swap, so they
  must find their elements fresh. Between pages the old one rises and fades out just under the
  water, then the new one slides up from the bottom.
- **Other pages on computers:** a logbook sheet (`.sheet`, in `_layouts/default.html`) in the same
  bay; the paper is near-white, set in the device's own font (San Francisco on Apple devices) on 24px ruled lines, and scrolls inside its edges, with holes, margin and rules scrolling along and 2.5 holes
  in view (phones, upright or sideways, have no holes or margin line). Its button says Home. Blog posts have no "Blog" line above the title. No scrollbar shows; a soft fade at the paper's bottom edge hints at more below. On phones the paper only moves up and down (no sideways scrolling; code wraps). Its wrappers are `display: contents` in print.
- **Photography on computers:** no paper. The words sit in the water (`.sheet-album`) and each photo
  is an instant film print, same height and uncropped, with its caption in the thick bottom strip.
- Open ideas, **not approved yet**: merging Blog + Projects into "Posts", replacing the
  placeholder email (`you@example.com`), removing the hello-world post, a résumé
  summary, a custom domain.
