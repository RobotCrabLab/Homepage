// Breadboard Bay: everything the pages do beyond plain HTML and CSS.
//
//   1. Home      the boater ID's scenes, osprey, jelly and fish
//   2. Photos    the full-size photo viewer
//   3. Pages     moving between pages without reloading the bay
//   4. Crab      the crab that walks in under "Built by Chris"
//
// Sections 1 and 2 are set up again each time their page is shown (see setUp), because
// section 3 swaps the content of <main> instead of loading a new page.
(function () {
  'use strict';

  const root = document.documentElement;
  const main = document.querySelector('main');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const base = new URL('../../', document.currentScript.src).pathname;   // the site's folder, e.g. /Homepage/

  // Anything a page sets up outside its own elements adds a function here to undo it
  let cleanUp = [];

  function setUp() {
    cleanUp.forEach(function (undo) { undo(); });
    cleanUp = [];
    home();
    photos();
  }

  /* ------------------------------------------------------------
     1. Home
     ------------------------------------------------------------ */
  function home() {
    const section = main.querySelector('.scenes');
    if (!section) return;
    const card = section.querySelector('.portrait-card');

    // The skills pick the scene. data-scene fades the scenes in and out (style.css);
    // data-live lists the scenes still moving, so the two hidden ones can rest. The scene
    // being left stays live until it has faded away.
    const buttons = Array.from(section.querySelectorAll('.scene-button'));
    let resting;
    function pick(button) {
      const from = section.dataset.scene, to = button.dataset.go;
      if (to === from) return;
      section.dataset.scene = to;
      section.dataset.live = from + ' ' + to;
      clearTimeout(resting);
      resting = setTimeout(function () { section.dataset.live = to; }, 1100);
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
      if (to === '3') school();
      if (to === '1') dive(); else if (from === '1') settle();
    }

    // On its own, the card steps to the next skill every 10 seconds, in the order they're
    // listed (it opens on Science). Picking a skill shows it for a full 10 seconds
    // before the rotation carries on from there. It waits while someone is tabbing
    // through the card with the keyboard. With reduced motion it stays put.
    const STEP = 10000;
    const portrait = section.querySelector('.portrait');
    const rotating = !calm.matches;
    let held = false, stepping;
    function step() {
      const i = buttons.findIndex(function (b) { return b.dataset.go === section.dataset.scene; });
      pick(buttons[(i + 1) % buttons.length]);
    }
    function wait() {
      clearTimeout(stepping);
      if (rotating && !held) stepping = setTimeout(function () { step(); wait(); }, STEP);
    }
    function hold(on) { held = on; wait(); }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () { pick(button); wait(); });
    });
    portrait.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) hold(true); });
    portrait.addEventListener('focusout', function (e) { if (!portrait.contains(e.relatedTarget)) hold(false); });
    wait();
    cleanUp.push(function () { clearTimeout(resting); clearTimeout(stepping); });

    // Each time Science comes up, a loose school of five small fish swims across
    // the photo, right to left, then they're gone. The card opens on Science, so
    // they swim by just after the page arrives too. Each fish is a copy of the big fish
    // inside its own holder: the holder crosses the photo while the fish inside wiggles
    // and wags its tail, as the big ones do.
    let schooling = null;
    function school() {
      if (calm.matches || schooling) return;
      const model = card.querySelector('.card-fish-2 svg');
      const group = document.createElement('span');
      group.className = 'card-school';
      group.setAttribute('aria-hidden', 'true');
      card.insertBefore(group, card.querySelector('.portrait-me'));   // behind him
      const W = card.clientWidth, H = card.clientHeight;
      // The whole school drifts the same way up or down, so it moves as one
      const drift = (Math.random() * 2 - 1) * H * 0.05;
      // [height down the photo, size as a share of its width, how far behind the leader in ms]
      const fish = [[0.12, 0.14, 0], [0.30, 0.11, 450], [0.04, 0.10, 800], [0.42, 0.13, 600], [0.21, 0.12, 1150]];
      const swims = fish.map(function (f) {
        const holder = document.createElement('span');
        holder.className = 'school-fish';
        const one = model.cloneNode(true);
        one.style.animationDelay = (-Math.random()).toFixed(2) + 's';   // not all wiggling in step
        holder.appendChild(one);
        const w = W * f[1] * (0.9 + Math.random() * 0.2);
        holder.style.width = w.toFixed(1) + 'px';
        holder.style.top = (H * f[0] + (Math.random() * 2 - 1) * H * 0.03).toFixed(1) + 'px';
        group.appendChild(holder);
        const rise = drift + (Math.random() * 2 - 1) * H * 0.015;
        return holder.animate([
          { transform: 'translate(0, 0)' },
          { transform: 'translate(' + (-(W + w * 2)).toFixed(1) + 'px, ' + rise.toFixed(1) + 'px)' }
        ], { duration: 4500 + Math.random() * 300, delay: f[2] + Math.random() * 100, easing: 'cubic-bezier(.3,.1,.5,1)' }).finished;
      });
      schooling = group;
      Promise.all(swims).catch(function () {}).then(function () { group.remove(); schooling = null; });
    }
    if (section.dataset.scene === '3') {
      const first = setTimeout(school, 500);
      cleanUp.push(function () { clearTimeout(first); });
    }

    // The osprey perches in the open water above the character's head, as large as fits
    // there, with its branch running off the photo's right edge.
    const bird = card.querySelector('.card-osprey');
    const me = card.querySelector('.portrait-me');
    const BIRD_W = 136, ART_TOP = 1.5, ART_H = 120;   // the drawing's width, and where its art sits, in its own units
    const HEAD_TOP = 0.043;                           // his hair starts this far down his image
    function perch() {
      const c = card.getBoundingClientRect(), m = me.getBoundingClientRect();
      const gap = m.top - c.top + m.height * HEAD_TOP;
      if (gap <= 0) return;
      const scale = Math.min(gap * 0.86 / ART_H, c.width * 0.64 / BIRD_W);   // pixels per unit
      const w = BIRD_W * scale;
      bird.style.width = w.toFixed(1) + 'px';
      bird.style.top = ((gap - ART_H * scale) / 2 - ART_TOP * scale).toFixed(1) + 'px';   // centered in the gap
      bird.style.bottom = 'auto';
      bird.style.right = (-0.07 * w).toFixed(1) + 'px';   // the branch's broken stub sits just inside the frame
    }
    perch();

    // Each time Leadership comes up, the osprey dives for its fish. The branch starts
    // empty; the bird glides off to the left, dives behind him, splashes into the water,
    // and flies back up to the branch with the fish. Positions are shares of the photo.
    const flyer = card.querySelector('.card-dive');
    const splash = card.querySelector('.card-splash');
    function pose(name) {   // show one drawing of the flying bird (or none)
      flyer.querySelectorAll('svg').forEach(function (d) { d.classList.toggle('on', d.classList.contains('fly-' + name)); });
    }
    // ms: on the branch before it leaves, the trip there and back, each half of the turn round
    // as it lands, and tilting up into its perch
    const LEAVE = 500, FLIGHT = 5000, HALF = 250, STAND = 700, TIP = 16;   // TIP: how far it leans forward as it lands, in degrees
    let diving = [], trip = [];
    function settle() {   // back on the branch with the fish, once the scene has faded
      trip.forEach(clearTimeout);
      trip = [setTimeout(function () {
        diving.forEach(function (a) { a.cancel(); });
        bird.classList.remove('away', 'empty');
        pose('');
        splash.classList.remove('on');
      }, 700)];
    }
    function dive() {
      if (calm.matches) return;
      trip.forEach(clearTimeout);
      diving.forEach(function (a) { a.cancel(); });
      bird.classList.add('empty');
      bird.classList.remove('away');
      pose('');
      splash.classList.remove('on');
      const W = card.clientWidth, H = card.clientHeight;
      const c = card.getBoundingClientRect(), b = bird.getBoundingClientRect();
      const w = b.width;
      flyer.style.width = splash.style.width = w.toFixed(1) + 'px';
      const h = w * 126 / 136;
      // its spot on the branch: where the flying drawing's fish lands on the perched bird's fish,
      // so it takes off from, and lands back on, exactly where the perched bird is
      const home = [b.left - c.left - card.clientLeft + w * 0.02, b.bottom - c.top - card.clientTop - h];
      // it lands exactly where it took off, so each dive ends the way it began
      const land = home;
      // The spots it passes through: [when (share of the trip), x, y, turn in degrees]. A smooth
      // curve runs through them, and while it flaps the bird rides a gentle wave on top.
      const spots = [
        [0, home[0], home[1], 0],
        [0.10, home[0] - W * 0.10, home[1] - H * 0.05, -4],   // lifts off the branch
        [0.22, W * 0.20, H * 0.04, -6],                       // spots the fish
        [0.36, -W * 0.02, H * 0.30, -48],                     // folds its wings and dives
        [0.46, W * 0.02, H * 0.40, -48],                      // hits the water
        [0.56, 0, H * 0.42, -18],                             // comes up with the fish
        [0.72, W * 0.16, H * 0.16, -16],
        [0.88, W * 0.36, 0, -10],
        [0.96, land[0] + W * 0.02, land[1] - H * 0.03, 6],       // flares to land
        [1, land[0], land[1], 0]                                 // back on the branch
      ];
      function slope(k, n) {
        if (k === 0 || k === spots.length - 1) return 0;
        return (spots[k + 1][n] - spots[k - 1][n]) / (spots[k + 1][0] - spots[k - 1][0]);
      }
      function where(t) {
        let k = 0;
        while (k < spots.length - 2 && t > spots[k + 1][0]) k++;
        const a = spots[k], b = spots[k + 1], d = b[0] - a[0], u = (t - a[0]) / d;
        const h1 = 2 * u * u * u - 3 * u * u + 1, h2 = u * u * u - 2 * u * u + u, h3 = -2 * u * u * u + 3 * u * u, h4 = u * u * u - u * u;
        return [1, 2, 3].map(function (n) { return h1 * a[n] + h2 * d * slope(k, n) + h3 * b[n] + h4 * d * slope(k + 1, n); });
      }
      // How much it's flapping: none while it dives and swims up, easing in and out
      function flapping(t) {
        const ramp = function (x) { return Math.max(0, Math.min(1, x)); };
        return ramp((0.24 - t) / 0.06) * ramp(t / 0.06) + ramp((t - 0.56) / 0.06) * ramp((0.98 - t) / 0.06);
      }
      const BEAT = 1100;   // ms per rise and fall of the wave
      const path = [];
      for (let i = 0; i <= 100; i++) {
        const t = i / 100, p = where(t), f = flapping(t), phase = 2 * Math.PI * t * FLIGHT / BEAT;
        path.push({ transform: 'translate(' + p[0].toFixed(1) + 'px, ' + (p[1] + Math.sin(phase) * H * 0.022 * f).toFixed(1) + 'px) rotate(' + (p[2] + Math.cos(phase) * 3 * f).toFixed(1) + 'deg)' });
      }
      const fly = flyer.animate(path, { duration: FLIGHT, delay: LEAVE, fill: 'both' });
      splash.style.transform = 'translate(' + (-W * 0.04).toFixed(1) + 'px, ' + (H * 0.49).toFixed(1) + 'px)';
      const hit = LEAVE + FLIGHT * 0.44;
      const burst = splash.animate([
        { transform: splash.style.transform + ' scale(0.3, 0.1)', opacity: 1 },
        { transform: splash.style.transform + ' scale(1, 1)', opacity: 1, offset: 0.35 },
        { transform: splash.style.transform + ' scale(1.05, 0.9)', opacity: 0 }
      ], { duration: 1100, delay: hit, easing: 'ease-out', fill: 'both' });   // stays faded out once done
      diving = [fly, burst];
      function later(ms, f) { trip.push(setTimeout(f, ms)); }
      later(LEAVE, function () { bird.classList.add('away'); pose('glide'); });
      later(LEAVE + FLIGHT * 0.25, function () { pose('dive'); });
      later(hit, function () { splash.classList.add('on'); });
      later(LEAVE + FLIGHT * 0.46, function () { pose(''); });   // under the water
      later(LEAVE + FLIGHT * 0.56, function () { pose('carry'); });
      later(hit + 1100, function () { splash.classList.remove('on'); });
      // As it comes in to land it turns round to face left. The carrying drawing turns till it's
      // edge-on just as its talons touch the branch; at that instant, while it's a thin line, the
      // perched bird and its fish take over and finish the turn, already on the branch, leaning
      // a little forward; then the bird tilts smoothly up into its perch. Only one drawing is ever
      // on show, and the bird's head, legs and wings stay fixed to its body throughout.
      later(LEAVE + FLIGHT - HALF, function () {
        const turn = flyer.querySelector('.fly-carry').animate(
          [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }],
          { duration: HALF, easing: 'ease-in', fill: 'forwards' });
        diving.push(turn);
        later(HALF, function () {
          const a = HALF / (HALF + STAND);
          bird.querySelectorAll('.osprey-back, .osprey-front, .osprey-head-turn').forEach(function (layer) {
            diving.push(layer.animate([
              { transform: 'scaleX(0) rotate(' + TIP + 'deg)', easing: 'ease-out' },
              { transform: 'scaleX(1) rotate(' + TIP + 'deg)', offset: a, easing: 'ease-in-out' },
              { transform: 'scaleX(1) rotate(0deg)' }
            ], { duration: HALF + STAND, fill: 'backwards' }));
          });
          bird.querySelectorAll('.osprey-fish, .osprey-holes').forEach(function (layer) {
            diving.push(layer.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
              { duration: HALF, easing: 'ease-out', fill: 'backwards' }));
          });
          pose(''); turn.cancel();
          bird.classList.remove('away', 'empty');
        });
      });
    }
    if (section.dataset.scene === '1') dive();
    cleanUp.push(function () { trip.forEach(clearTimeout); diving.forEach(function (a) { a.cancel(); }); });

    // The row of holes under the summary lines up with the power rail's holes under the band:
    // the rail fits a whole number of groups of five across its width, so take its spacing,
    // then start and end the row on whole groups that fall inside the summary's column.
    const head = section.querySelector('.dive-head'), summary = section.querySelector('.dive-summary');
    function alignHoles() {
      const rail = getComputedStyle(head, '::after');
      const left = head.getBoundingClientRect().left + parseFloat(rail.left), width = parseFloat(rail.width);
      const step = width / Math.max(1, Math.round(width / (parseFloat(rail.height) / 1.4 * 2.4)));
      const col = summary.getBoundingClientRect();
      const first = left + Math.ceil((col.left - left) / step - 0.1) * step;   // a group may start a hair outside: its first hole is well inside
      const last = left + Math.floor((col.right - left) / step + 0.1) * step;
      summary.style.setProperty('--hole-t', step.toFixed(3) + 'px');
      summary.style.setProperty('--hole-l', (first - col.left).toFixed(3) + 'px');
      summary.style.setProperty('--hole-r', (col.right - last).toFixed(3) + 'px');
    }
    alignHoles();
    const holeWatch = new ResizeObserver(alignHoles);
    holeWatch.observe(section);
    cleanUp.push(function () { holeWatch.disconnect(); });

    // On upright phones Posts fills the space above the signature: list as many posts as
    // fit there, newest first, and hide the rest (style.css shows four everywhere else)
    const posts = section.querySelector('.dive-posts');
    function fitPosts() {
      const titles = posts.querySelectorAll('dd');
      titles.forEach(function (t) { t.hidden = false; });
      for (let i = titles.length - 1; i > 0 && posts.scrollHeight > posts.clientHeight + 1; i--) titles[i].hidden = true;
    }
    fitPosts();
    document.fonts.ready.then(fitPosts);
    const fitter = new ResizeObserver(fitPosts);
    fitter.observe(posts);
    cleanUp.push(function () { fitter.disconnect(); });

    const watcher = new ResizeObserver(perch);
    watcher.observe(card);
    cleanUp.push(function () { watcher.disconnect(); });

    if (calm.matches) return;   // the swimmers hold still (style.css gives them fixed spots)

    // Each trip, the jelly enters from a random side about a quarter of the way up the
    // photo and swims up and across at about 40 degrees, bell first.
    const jelly = card.querySelector('.card-jelly');
    const LEAN = 40;   // degrees from straight up
    function launch() {
      const W = card.clientWidth, H = card.clientHeight;
      const w = jelly.offsetWidth, h = jelly.offsetHeight;
      const fromLeft = Math.random() < 0.5;
      const top = H * (0.7 + Math.random() * 0.1) - h / 2;
      const dy = -(top + h * 1.6);                                    // until it's well past the top
      const dx = -dy * Math.tan(LEAN * Math.PI / 180) * (fromLeft ? 1 : -1);
      jelly.style.left = (fromLeft ? -w : W) + 'px';                  // just outside the edge
      jelly.style.top = top + 'px';
      jelly.style.setProperty('--dx', dx.toFixed(1) + 'px');
      jelly.style.setProperty('--dy', dy.toFixed(1) + 'px');
      jelly.style.setProperty('--tilt', (fromLeft ? LEAN : -LEAN) + 'deg');
    }
    launch();
    jelly.addEventListener('animationiteration', function (e) { if (e.target === jelly) launch(); });

    // The fish and the AUV cross the photo right to left, each starting somewhere along
    // its lap so they don't arrive together. At the start of every lap a fish picks a new
    // height within 10% of the photo above or below its usual one (data-top), and now and
    // then one fish at a time swims on a gentle 5 to 10 degree slant. The AUV keeps its lane.
    let slanted = null;
    card.querySelectorAll('.card-fish').forEach(function (fish) {
      const lapTime = parseFloat(getComputedStyle(fish).animationDuration) || 13;
      fish.style.animationDelay = (-Math.random() * lapTime).toFixed(2) + 's';
      if (!fish.dataset.top) return;
      const usual = parseFloat(fish.dataset.top);
      function lap() {
        const widthPct = fish.offsetWidth / card.offsetWidth * 100;
        const heightPct = fish.offsetHeight / card.offsetHeight * 100;
        if (slanted === fish) slanted = null;
        let angle = 0;
        if (!slanted && Math.random() < 0.5) {
          slanted = fish;
          angle = (5 + Math.random() * 5) * (Math.random() < 0.5 ? -1 : 1);   // negative swims upward
        }
        // how far it drifts up or down over the crossing, in photo widths and in photo heights
        const riseW = Math.tan(angle * Math.PI / 180) * (100 + widthPct);
        const riseH = riseW * card.offsetWidth / card.offsetHeight;
        fish.style.setProperty('--rise', riseW.toFixed(2) + 'cqw');
        fish.style.setProperty('--tilt', (-angle).toFixed(1) + 'deg');       // nose follows the path
        // keep the whole path inside the frame
        const lowest = Math.max(2, -riseH), highest = Math.min(100 - heightPct, 100 - heightPct - riseH);
        const top = usual + (Math.random() * 2 - 1) * 10;
        fish.style.top = Math.max(lowest, Math.min(highest, top)) + '%';
      }
      lap();
      fish.addEventListener('animationiteration', function (e) { if (e.target === fish) lap(); });
    });
  }

  /* ------------------------------------------------------------
     2. Photos
     ------------------------------------------------------------ */
  function photos() {
    const viewer = main.querySelector('.viewer');
    if (!viewer || !viewer.showModal) return;   // without it, a photo's link just opens the photo
    const img = viewer.querySelector('.viewer-img');
    const caption = viewer.querySelector('.viewer-caption');
    main.querySelectorAll('.shot-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const print = link.querySelector('img');
        // Show the small copy that's already on the page straight away, then swap in the
        // large one once it has arrived
        const large = new Image();
        large.onload = function () { if (img.dataset.want === link.href) img.src = link.href; };
        img.dataset.want = link.href;
        img.style.setProperty('--w', print.getAttribute('width') + 'px');   // the large copy's size and shape,
        img.style.setProperty('--r', print.style.getPropertyValue('--r'));   // so the swap doesn't change the frame
        img.src = print.currentSrc || print.src;
        img.alt = print.alt;
        large.src = link.href;
        caption.textContent = link.dataset.title + (link.dataset.note ? ', ' + link.dataset.note.toLowerCase() : '');
        viewer.showModal();
      });
    });
    viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
    viewer.addEventListener('close', function () { img.dataset.want = ''; img.removeAttribute('src'); });
  }

  /* ------------------------------------------------------------
     3. Pages
     Following a link swaps the content inside <main> instead of loading a new page, so
     the bay, pier and crab carry on undisturbed. Every page is still a real page at a real
     address, and anything unexpected just loads the page the ordinary way.
     ------------------------------------------------------------ */
  let path = location.pathname;
  let latest = 0;                // only the most recent click gets to show its page
  let leaving = null, arriving = null;
  const fetched = new Map();     // pages already fetched (or on their way), by address

  function sheet() { return main.querySelector('.sheet'); }

  // The address a link leads to, if it's another page of this site
  function pageLink(target) {
    const a = target.closest && target.closest('a[href]');
    if (!a || a.target || a.hasAttribute('download')) return null;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname.indexOf(base) !== 0) return null;
    if (/\.[a-z0-9]+$/i.test(url.pathname) && !/\.html$/i.test(url.pathname)) return null;   // the feed, photos and so on
    if (url.pathname === location.pathname && url.hash) return null;                          // a spot on this same page
    return url;
  }

  function fetchPage(url) {
    const key = url.origin + url.pathname + url.search;
    if (!fetched.has(key)) {
      fetched.set(key, fetch(key).then(function (res) {
        const type = res.headers.get('content-type') || '';
        if (!res.ok || type.indexOf('text/html') === -1) throw new Error('not a page');
        return res.text().then(function (html) { return { html: html, url: res.url }; });
      }).catch(function (err) { fetched.delete(key); throw err; }));
    }
    return fetched.get(key);
  }

  // Between pages, the old one rises and fades out just under the water's surface, then
  // the new one slides up from the bottom of the screen. While that happens, .page-moving
  // (style.css) keeps the page below the surface and stops the window scrolling.
  function leave() {
    if (leaving) return leaving;
    if (arriving) arriving.finish();
    const el = main.firstElementChild;
    if (calm.matches || !el) return Promise.resolve();
    root.classList.add('page-moving');
    leaving = el.animate([
      { transform: 'none', opacity: 1 },
      { transform: 'translateY(' + (-0.18 * window.innerHeight) + 'px)', opacity: 0 }
    ], { duration: 380, easing: 'ease-in', fill: 'forwards' }).finished.catch(function () {});
    return leaving;
  }
  function arrive() {
    leaving = null;
    const el = main.firstElementChild;
    if (calm.matches || !el) { root.classList.remove('page-moving'); return; }
    root.classList.add('page-moving');
    const anim = arriving = el.animate([
      { transform: 'translateY(' + (window.innerHeight - el.getBoundingClientRect().top) + 'px)' },
      { transform: 'none' }
    ], { duration: 560, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
    anim.finished.catch(function () {}).then(function () {
      if (arriving !== anim) return;
      arriving = null;
      root.classList.remove('page-moving');
    });
  }

  // With no scrollbar to click, the arrow keys need the paper in focus to scroll it
  function focusPage() {
    const target = sheet() || main;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  function copyHead(doc, selector, attr) {
    const from = doc.querySelector(selector), to = document.querySelector(selector);
    if (from && to) to.setAttribute(attr, from.getAttribute(attr));
  }

  function show(doc, y) {
    document.title = doc.title;
    document.body.className = doc.body.className;
    copyHead(doc, 'meta[name="description"]', 'content');
    copyHead(doc, 'link[rel="canonical"]', 'href');
    main.replaceChildren.apply(main, Array.from(doc.querySelector('main').childNodes).map(function (node) {
      return document.importNode(node, true);
    }));
    // A script written into a post doesn't run when it arrives this way, so swap each
    // for a fresh copy, which does
    main.querySelectorAll('script').forEach(function (old) {
      const fresh = document.createElement('script');
      Array.from(old.attributes).forEach(function (a) { fresh.setAttribute(a.name, a.value); });
      fresh.textContent = old.textContent;
      old.replaceWith(fresh);
    });
    setUp();
    window.scrollTo(0, 0);
    focusPage();
    const paper = sheet();
    const spot = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (spot) spot.scrollIntoView({ block: 'center' });
    else if (paper) paper.scrollTop = y || 0;
    path = location.pathname;
  }

  function go(url, push, y) {
    const mine = ++latest;
    if (push) {   // remember how far down the old page was, for the back button
      const paper = sheet();
      history.replaceState({ y: paper ? paper.scrollTop : 0 }, '', location.href);
    }
    const gone = leave();
    fetchPage(url).then(function (got) {
      return gone.then(function () { return got; });
    }).then(function (got) {
      if (mine !== latest) return;
      const doc = new DOMParser().parseFromString(got.html, 'text/html');
      if (!doc.querySelector('main') || doc.querySelector('meta[http-equiv="refresh" i]')) throw new Error('not a page');
      if (push) history.pushState({ y: 0 }, '', got.url + url.hash);
      show(doc, y);
      arrive();
    }).catch(function () {
      if (mine === latest) location.href = url.href;   // anything odd: load it the ordinary way
    });
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = pageLink(e.target);
    if (!url) return;
    e.preventDefault();
    go(url, true, 0);
  });

  // Start fetching a page as soon as a pointer or finger lands on its link (or the Tab
  // key reaches it), so it's usually here by the time the old page has floated away
  function warm(e) {
    const url = pageLink(e.target);
    if (url) fetchPage(url).catch(function () {});
  }
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('touchstart', warm, { passive: true });
  document.addEventListener('focusin', warm);

  window.addEventListener('popstate', function (e) {
    if (location.pathname === path) return;
    go(new URL(location.href), false, e.state && e.state.y);
  });

  /* ------------------------------------------------------------
     4. Crab
     It waits off the right edge and walks in when the footer comes into view, blowing
     bubbles on the way, then walks back out when the footer leaves.
     ------------------------------------------------------------ */
  function crabWalk() {
    const crab = document.querySelector('.crab-walker');
    const track = document.querySelector('.crab-track');
    if (!crab || !track || calm.matches) return;
    // Start off the right edge, then turn on the walking transition
    // (reading the style makes the browser take each step in before the next)
    crab.classList.add('crab-out');
    getComputedStyle(crab).transform;
    crab.classList.add('crab-ready');
    getComputedStyle(crab).transform;
    let inView = false;

    // Each bubble is dropped on the track at the crab's current spot, so it rises
    // straight up instead of travelling sideways with the crab
    const NS = 'http://www.w3.org/2000/svg';
    function bubble(size, at) {
      const c = crab.getBoundingClientRect(), t = track.getBoundingClientRect();
      const left = at != null ? at : c.left - t.left + c.width * (0.3 + Math.random() * 0.4);
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'crab-bubble');
      svg.setAttribute('viewBox', '0 0 12 12');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.width = svg.style.height = size + 'px';
      svg.style.left = (left - size / 2) + 'px';
      svg.style.top = (c.top - t.top - size) + 'px';
      svg.innerHTML = '<circle cx="6" cy="6" r="5"/>' + (size > 10 ? '<path d="M3.6 4.8 a2.6 2.6 0 0 1 2.2 -1.8"/>' : '');
      svg.addEventListener('animationend', function () { svg.remove(); });
      track.appendChild(svg);
      return left;
    }

    // Bubbles are tied to where the crab is on screen, not to a clock: a double "blub"
    // just after it walks on (the second rises from nearly the same spot half a second
    // later), then three more before it reaches the middle. Each entry is [crab's centre
    // as a fraction of the screen's width, bubble size]. The last three land somewhere
    // new on every walk, so it never looks canned.
    let frame = 0, follow = 0, settle = [];
    function jitter(mid, spread) { return mid + (Math.random() * 2 - 1) * spread; }
    function centre() {
      const c = crab.getBoundingClientRect();
      return (c.left + c.width / 2) / window.innerWidth;
    }
    function bubbles() {
      let next = 0;
      // If the crab turns back before it has walked all the way off, only the bubbles
      // still ahead of it are kept, so they don't all pop at once. If none are left, it
      // lets out a single bubble after a moment.
      const start = centre();
      const spots = [[0.93, 10, true],
        [jitter(0.775, 0.045), jitter(9, 2)],
        [jitter(0.665, 0.045), jitter(11, 2)],
        [jitter(0.555, 0.04), jitter(9, 2)]].filter(function (s) { return s[0] <= start - 0.05; });
      cancelAnimationFrame(frame);
      if (!spots.length) {
        follow = setTimeout(function () { if (inView) bubble(10); }, 300);
        return;
      }
      (function tick() {
        if (!inView || next >= spots.length) return;
        const x = centre();
        while (next < spots.length && x <= spots[next][0]) {
          const at = bubble(spots[next][1]);
          if (spots[next++][2]) follow = setTimeout(function () { if (inView) bubble(13, at + jitter(10, 4)); }, 500);
        }
        frame = requestAnimationFrame(tick);
      })();
    }

    function walk(toIn) {
      if (toIn === inView) return;
      inView = toIn;
      cancelAnimationFrame(frame); clearTimeout(follow);
      settle.forEach(clearTimeout); settle = [];
      if (toIn) bubbles();
      crab.classList.remove('crab-arrived');
      crab.classList.add('crab-moving');
      crab.classList.toggle('crab-out', !toIn);
    }
    crab.addEventListener('transitionend', function (e) {
      if (e.target !== crab || e.propertyName !== 'transform') return;
      crab.classList.remove('crab-moving');
      if (!inView) return;
      crab.classList.add('crab-arrived');
      // A little burst of bubbles once it settles at the end of its run
      [[150, 9], [450, 12], [700, 8], [1050, 11]].forEach(function (b) {
        settle.push(setTimeout(function () { if (inView) bubble(jitter(b[1], 1.5)); }, b[0] + jitter(0, 80)));
      });
    });
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.intersectionRatio >= 0.6) walk(true);
        else if (e.intersectionRatio < 0.35) walk(false);
      });
    }, { threshold: [0, 0.35, 0.6, 1] }).observe(track);
  }

  setUp();
  if (sheet()) focusPage();
  // The crab waits for the page to finish loading; browsers don't animate its walk before then
  if (document.readyState === 'complete') crabWalk();
  else window.addEventListener('load', crabWalk);
  // Arriving at a link to one spot on a page (say, one photo): bring it to the middle
  const spot = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (spot) requestAnimationFrame(function () { spot.scrollIntoView({ block: 'center', behavior: calm.matches ? 'auto' : 'smooth' }); });
})();
