// Computers: moving between pages swaps the content inside <main> instead of loading a
// new page, so the bay, pier and crab carry on undisturbed. Every page is still a real
// page at a real address. Phones, and anything unexpected, just load pages normally.
(function () {
  var base = new URL('../../', document.currentScript.src).pathname;
  var wide = window.matchMedia('(min-width: 40.01rem)');
  var path = location.pathname;
  var swapped = false, latest = 0;

  // Scripts inside <main> restart after each swap, so remember the window listeners they
  // add and remove them when their page goes away. Header and footer scripts stay.
  var owned = [], addListener = window.addEventListener;
  window.addEventListener = function (type, fn, opts) {
    var s = document.currentScript;
    if (s && s.closest && s.closest('main')) owned.push([type, fn, opts]);
    return addListener.call(window, type, fn, opts);
  };

  // Between pages, the old one rises and fades out just under the water's surface, then
  // the new one slides up from the bottom of the screen. The styles for .page-moving keep
  // the page below the surface and stop the window scrolling while this happens.
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var root = document.documentElement;
  var leaving = null, arriving = null;

  function page() { return document.querySelector('main').firstElementChild; }
  function leave() {
    if (leaving) return leaving;
    if (arriving) arriving.finish();
    var el = page();
    if (calm.matches || !el || !el.animate) return Promise.resolve();
    root.classList.add('page-moving');
    var anim = el.animate([
      { transform: 'none', opacity: 1 },
      { transform: 'translateY(' + (-0.18 * window.innerHeight) + 'px)', opacity: 0 }
    ], { duration: 380, easing: 'ease-in', fill: 'forwards' });
    leaving = anim.finished.catch(function () {});
    return leaving;
  }
  function arrive() {
    leaving = null;
    var el = page();
    if (calm.matches || !el || !el.animate) { root.classList.remove('page-moving'); return; }
    root.classList.add('page-moving');
    var anim = el.animate([
      { transform: 'translateY(' + (window.innerHeight - el.getBoundingClientRect().top) + 'px)' },
      { transform: 'none' }
    ], { duration: 560, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
    arriving = anim;
    anim.finished.catch(function () {}).then(function () {
      if (arriving !== anim) return;
      arriving = null;
      root.classList.remove('page-moving');
    });
  }

  function sheet() { return document.querySelector('.sheet'); }
  function saveScroll() {
    var s = sheet();
    history.replaceState({ y: s ? s.scrollTop : 0 }, '', location.href);
  }
  function copyHead(doc, selector, attr) {
    var from = doc.querySelector(selector), to = document.querySelector(selector);
    if (from && to) to.setAttribute(attr, from.getAttribute(attr));
  }

  function show(doc, y) {
    var main = document.querySelector('main');
    owned.forEach(function (l) { window.removeEventListener(l[0], l[1], l[2]); });
    owned = [];
    document.title = doc.title;
    document.body.className = doc.body.className;
    copyHead(doc, 'meta[name="description"]', 'content');
    copyHead(doc, 'link[rel="canonical"]', 'href');
    main.replaceChildren.apply(main, Array.from(doc.querySelector('main').childNodes).map(function (n) {
      return document.importNode(n, true);
    }));
    // Scripts brought in this way don't run by themselves, so replace each with a fresh copy
    main.querySelectorAll('script').forEach(function (old) {
      var s = document.createElement('script');
      Array.from(old.attributes).forEach(function (a) { s.setAttribute(a.name, a.value); });
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
    window.scrollTo(0, 0);
    var s = sheet(), target = s || main;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    var hash = decodeURIComponent(location.hash.slice(1)), spot = hash && document.getElementById(hash);
    if (spot) spot.scrollIntoView({ block: 'center' });
    else if (s) s.scrollTop = y || 0;
    path = location.pathname;
    swapped = true;
  }

  function go(url, push, y) {
    var mine = ++latest;
    if (push) saveScroll();   // before the old page goes
    var gone = leave();
    fetch(url).then(function (res) {
      var type = res.headers.get('content-type') || '';
      if (!res.ok || type.indexOf('text/html') === -1) throw new Error('not a page');
      return res.text().then(function (html) { return { html: html, url: res.url }; });
    }).then(function (got) {
      return gone.then(function () { return got; });
    }).then(function (got) {
      if (mine !== latest) return;
      var doc = new DOMParser().parseFromString(got.html, 'text/html');
      if (!doc.querySelector('main') || doc.querySelector('meta[http-equiv="refresh" i]')) throw new Error('not a page');
      if (push) {
        history.pushState({ y: 0 }, '', got.url + new URL(url, location.href).hash);
      }
      show(doc, y);
      arrive();
    }).catch(function () {
      if (mine === latest) location.href = url;   // anything odd: load it the normal way
    });
  }

  document.addEventListener('click', function (e) {
    if (!wide.matches || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname.indexOf(base) !== 0) return;
    if (/\.[a-z0-9]+$/i.test(url.pathname) && !/\.html$/i.test(url.pathname)) return;   // the feed, photos and so on
    if (url.pathname === location.pathname && url.hash) return;                        // a spot on this same page
    e.preventDefault();
    go(url.href, true, 0);
  });

  addListener.call(window, 'popstate', function (e) {
    if (location.pathname === path) return;
    go(location.href, false, e.state && e.state.y);
  });

  // With no scrollbar to click, the arrow keys need the album in focus from the start
  document.addEventListener('DOMContentLoaded', function () {
    var album = wide.matches && document.querySelector('.sheet-album');
    if (!album) return;
    album.setAttribute('tabindex', '-1');
    album.focus({ preventScroll: true });
  });

  // Crossing into the phone layout after a swap: start fresh, so its menu and buttons work
  if (wide.addEventListener) wide.addEventListener('change', function () {
    if (swapped) location.reload();
  });
})();
