/* WellWith — shared interactions (navbar, reveal, fact strip, listen, partner, modals). */

function qs(sel, el) { return (el || document).querySelector(sel); }
function qsa(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

/* ---------- Cart ---------- */
/* The cart travels in the page URL so it works across this static site without browser storage. */
var CART_PARAM = "cart";

function getCart() {
  var cart = {};
  try {
    var raw = new URLSearchParams(window.location.search).get(CART_PARAM) || "";
    raw.split(",").forEach(function (entry) {
      var parts = entry.split("~"), slug = parts[0], qty = parseInt(parts[1], 10);
      if (slug && qty > 0) cart[slug] = qty;
    });
  } catch (e) {}
  return cart;
}
function cartValue(cart) {
  return Object.keys(cart).sort().map(function (slug) {
    return slug + "~" + cart[slug];
  }).join(",");
}
function withCartParam(href, cart) {
  if (!href || href.charAt(0) === "#" || /^(?:https?:|mailto:|tel:|javascript:)/i.test(href)) return href;
  var hash = "", hashAt = href.indexOf("#");
  if (hashAt !== -1) { hash = href.slice(hashAt); href = href.slice(0, hashAt); }
  var qAt = href.indexOf("?"), path = qAt === -1 ? href : href.slice(0, qAt);
  var params = new URLSearchParams(qAt === -1 ? "" : href.slice(qAt + 1));
  var value = cartValue(cart);
  if (value) params.set(CART_PARAM, value); else params.delete(CART_PARAM);
  var query = params.toString();
  return path + (query ? "?" + query : "") + hash;
}
function updateInternalCartLinks() {
  var cart = getCart();
  qsa('a[href]:not([target="_blank"])').forEach(function (a) {
    a.setAttribute("href", withCartParam(a.getAttribute("href"), cart));
  });
}
function saveCart(cart) {
  try {
    var url = new URL(window.location.href);
    var value = cartValue(cart);
    if (value) url.searchParams.set(CART_PARAM, value); else url.searchParams.delete(CART_PARAM);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  } catch (e) {}
  updateCartBadge();
  updateInternalCartLinks();
}
function cartCount() {
  var cart = getCart(), n = 0;
  for (var k in cart) { if (cart.hasOwnProperty(k)) n += cart[k]; }
  return n;
}
function cartItems() {
  if (typeof PRODUCTS === "undefined") return [];
  var cart = getCart(), out = [];
  PRODUCTS.forEach(function (p) {
    if (cart[p.slug]) out.push({ product: p, qty: cart[p.slug] });
  });
  return out;
}
function addToCart(slug, qty) {
  if (typeof PRODUCTS === "undefined") return;
  var p = PRODUCTS.find(function (x) { return x.slug === slug; });
  if (!p) return;
  var cart = getCart();
  cart[slug] = (cart[slug] || 0) + (qty || 1);
  saveCart(cart);
  showToast("✓ " + p.name + " added to cart");
}
function setQty(slug, qty) {
  var cart = getCart();
  if (qty <= 0) delete cart[slug];
  else cart[slug] = qty;
  saveCart(cart);
}
function removeFromCart(slug) {
  var cart = getCart();
  delete cart[slug];
  saveCart(cart);
}
function updateCartBadge() {
  var n = cartCount();
  qsa(".cart-count").forEach(function (el) {
    el.textContent = n;
    el.style.display = n > 0 ? "inline-flex" : "none";
  });
}
var toastTimer = null;
function showToast(msg) {
  var t = qs("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
}
function initCart() {
  updateCartBadge();
  updateInternalCartLinks();
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-add-cart]") : null;
    if (btn) addToCart(btn.getAttribute("data-add-cart"));
    var link = e.target.closest ? e.target.closest('a[href]:not([target="_blank"])') : null;
    if (link) link.setAttribute("href", withCartParam(link.getAttribute("href"), getCart()));
  });
}

/* ---------- Navbar ---------- */
function initNavbar() {
  var btn = qs("#hamburger"), menu = qs("#mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", function () { menu.classList.toggle("open"); });
    qsa("a", menu).forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); });
    });
  }
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  var els = qsa(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (e) { e.classList.add("visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
  /* Safety: never leave content hidden — reveal everything after 2.5s no matter what. */
  setTimeout(function () {
    qsa(".reveal").forEach(function (e) { e.classList.add("visible"); });
  }, 2500);
}

/* ---------- Hero fact strip typewriter ---------- */
function initFactStrip() {
  var el = qs("#fact-strip");
  if (!el || typeof HERO_FACTS === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.innerHTML = "✦ " + HERO_FACTS[0];
    return;
  }
  var TYPE = 45, PAUSE = 2800, ERASE = 22;
  var index = 0, text = "", phase = "typing", timer = null;

  function render() { el.innerHTML = "✦ " + text + '<span class="cursor"></span>'; }
  function tick() {
    var fact = HERO_FACTS[index];
    if (phase === "typing") {
      if (text.length < fact.length) { text = fact.slice(0, text.length + 1); render(); timer = setTimeout(tick, TYPE); }
      else { phase = "paused"; timer = setTimeout(tick, PAUSE); }
    } else if (phase === "paused") { phase = "erasing"; tick(); }
    else {
      if (text.length > 0) { text = text.slice(0, -1); render(); timer = setTimeout(tick, ERASE); }
      else { index = (index + 1) % HERO_FACTS.length; phase = "typing"; timer = setTimeout(tick, 300); }
    }
  }
  tick();
}

/* ---------- Generic modal helpers ---------- */
var openModals = [];
function openModal(id) {
  var m = document.getElementById(id);
  if (!m) return;
  m.classList.add("open");
  document.body.style.overflow = "hidden";
  if (openModals.indexOf(id) === -1) openModals.push(id);
}
function closeModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.remove("open");
  stopAllAudio();
  openModals = openModals.filter(function (x) { return x !== id; });
  if (!openModals.length) document.body.style.overflow = "";
}
function stopAllAudio() {
  qsa("audio").forEach(function (a) { try { a.pause(); a.currentTime = 0; } catch (e) {} });
}
function initModalBackdrops() {
  qsa(".modal-backdrop").forEach(function (bd) {
    bd.addEventListener("click", function (e) {
      if (e.target === bd) closeModal(bd.id);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openModals.length) closeModal(openModals[openModals.length - 1]);
  });
}

/* ---------- Listen & Discover (home) ---------- */
function initListen() {
  var root = qs("#listen-root");
  if (!root || typeof LISTEN_PRODUCTS === "undefined") return;
  var index = 0;

  function render() {
    var p = LISTEN_PRODUCTS[index];
    root.innerHTML =
      '<div class="listen-card reveal visible">' +
        '<img class="product-img" src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
        '<h3 class="display">' + p.name + '</h3>' +
        '<p class="purpose">' + p.purpose + '</p>' +
        '<button class="btn btn-green" id="listen-open" style="margin-top:22px">🎧 &nbsp;Listen About This</button>' +
        '<div class="listen-nav">' +
          '<button class="nav-btn" id="listen-prev"' + (index === 0 ? " disabled" : "") + '>← Previous</button>' +
          '<span class="listen-count">' + (index + 1) + ' / ' + LISTEN_PRODUCTS.length + '</span>' +
          '<button class="nav-btn" id="listen-next"' + (index === LISTEN_PRODUCTS.length - 1 ? " disabled" : "") + '>Next →</button>' +
        '</div>' +
      '</div>';
    qs("#listen-prev", root).addEventListener("click", function () { if (index > 0) { index--; render(); } });
    qs("#listen-next", root).addEventListener("click", function () { if (index < LISTEN_PRODUCTS.length - 1) { index++; render(); } });
    qs("#listen-open", root).addEventListener("click", function () { openListenModal(p); });
  }

  function openListenModal(p) {
    var wrap = qs("#modal-slot");
    var slug = (p.url.split("slug=")[1] || "").split("&")[0];
    var addCartBtn = slug
      ? '<button class="btn btn-green" data-add-cart="' + slug + '" style="width:100%">Add to Cart</button>'
      : "";
    wrap.innerHTML =
      '<div class="modal-backdrop open" id="listen-modal">' +
        '<div class="modal" role="dialog" aria-modal="true">' +
          '<button class="modal-close" data-close="listen-modal" aria-label="Close">✕</button>' +
          '<img class="product-img" src="' + p.image + '" alt="' + p.name + '">' +
          '<h3 class="display">' + p.name + '</h3>' +
          '<p class="desc">' + p.description + '</p>' +
          '<div class="audio-box">' +
            '<div style="font-weight:600;font-size:14px">🎧 30-second audio</div>' +
            '<audio id="listen-audio" controls preload="metadata" src="' + p.audio + '"></audio>' +
            '<div class="audio-controls">' +
              '<button class="nav-btn" id="listen-replay">↺ Replay</button>' +
              '<a class="nav-btn" href="' + p.url + '">View product →</a>' +
            '</div>' +
          '</div>' +
          '<a class="btn btn-gold wa-order" target="_blank" rel="noopener" href="' + listenOrderLink(p.name) + '">Order on WhatsApp</a>' +
          '<div style="margin-top:10px">' + addCartBtn + '</div>' +
        '</div>' +
      '</div>';
    var bd = qs("#listen-modal");
    bd.addEventListener("click", function (e) { if (e.target === bd) closeListen(); });
    qs('[data-close="listen-modal"]').addEventListener("click", closeListen);
    qs("#listen-replay").addEventListener("click", function () {
      var a = qs("#listen-audio"); a.currentTime = 0; a.play();
    });
    openModals.push("listen-modal");
    document.body.style.overflow = "hidden";
    var a = qs("#listen-audio");
    a.play().catch(function () {});
  }

  function closeListen() {
    var bd = qs("#listen-modal");
    if (bd) bd.remove();
    stopAllAudio();
    openModals = openModals.filter(function (x) { return x !== "listen-modal"; });
    if (!openModals.length) document.body.style.overflow = "";
  }

  function listenOrderLink(name) {
    return waLink("Hello Palak Luthra, humne " + name + " ke baare mein suna hai and I want to order. Please share details.");
  }

  render();
}

/* ---------- Partner With Us (home) ---------- */
function initPartner() {
  var grid = qs("#partner-grid");
  if (!grid || typeof PARTNER_MODELS === "undefined") return;

  var whyHtml = '<div class="partner-why">' + WHY_WELLWITH.map(function (w) {
    return '<div class="why-row reveal"><span class="dot">●</span><div><strong>' + w.title +
      '</strong><p>' + w.text + '</p></div></div>';
  }).join("") + '</div>';

  grid.innerHTML = whyHtml +
    '<div class="partner-grid">' + PARTNER_MODELS.map(function (m, i) {
      return '<div class="partner-card reveal">' +
        '<div class="icon">' + m.icon + '</div>' +
        '<h3>' + m.name + '</h3>' +
        '<p class="tagline">' + m.tagline + '</p>' +
        '<ul>' + m.benefits.map(function (b) { return '<li>' + b + '</li>'; }).join("") + '</ul>' +
        '<button class="btn btn-outline" data-partner="' + i + '">🎧 Listen About This</button>' +
        '<a class="btn btn-gold" target="_blank" rel="noopener" style="margin-top:10px" href="' +
        waLink("Hello Palak Luthra, humne " + m.name + " ke baare mein suna hai and I want to know more. Please share details.") +
        '">Enquire on WhatsApp</a>' +
      '</div>';
    }).join("") + '</div>';

  qsa("[data-partner]", grid).forEach(function (btn) {
    btn.addEventListener("click", function () { openPartnerModal(PARTNER_MODELS[+btn.dataset.partner]); });
  });

  function openPartnerModal(m) {
    var wrap = qs("#modal-slot");
    wrap.innerHTML =
      '<div class="modal-backdrop open" id="partner-modal">' +
        '<div class="modal" role="dialog" aria-modal="true">' +
          '<button class="modal-close" data-close="partner-modal" aria-label="Close">✕</button>' +
          '<div style="font-size:52px">' + m.icon + '</div>' +
          '<h3 class="display">' + m.name + '</h3>' +
          '<p class="desc">' + m.message + '</p>' +
          '<div style="text-align:left;margin-top:18px">' +
            m.why.map(function (w) { return '<div class="why-row" style="margin-bottom:10px"><span class="dot">✓</span><div><p style="color:var(--text)">' + w + '</p></div></div>'; }).join("") +
          '</div>' +
          '<div class="audio-box">' +
            '<div style="font-weight:600;font-size:14px">🎧 Listen about ' + m.name + '</div>' +
            '<audio id="partner-audio" controls preload="metadata" src="' + m.audio + '"></audio>' +
          '</div>' +
          '<a class="btn btn-gold wa-order" target="_blank" rel="noopener" href="' +
          waLink("Hello Palak Luthra, humne " + m.name + " ke baare mein suna hai and I want to know more. Please share details.") +
          '">Enquire: ' + m.enquiry + '</a>' +
        '</div>' +
      '</div>';
    var bd = qs("#partner-modal");
    bd.addEventListener("click", function (e) { if (e.target === bd) closePartner(); });
    qs('[data-close="partner-modal"]').addEventListener("click", closePartner);
    openModals.push("partner-modal");
    document.body.style.overflow = "hidden";
    qs("#partner-audio").play().catch(function () {});
  }

  function closePartner() {
    var bd = qs("#partner-modal");
    if (bd) bd.remove();
    stopAllAudio();
    openModals = openModals.filter(function (x) { return x !== "partner-modal"; });
    if (!openModals.length) document.body.style.overflow = "";
  }
}

/* ---------- Product grids (home) ---------- */
function initProductGrids() {
  if (typeof PRODUCTS === "undefined") return;
  function card(p) {
    return '<article class="product-card reveal">' +
      '<div class="img-wrap"><span class="anim-icon">' + p.animationIcon + '</span>' +
      '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy"></div>' +
      '<div class="body">' +
        '<span class="cat">' + (p.category === "concentrate" ? "Liquid Concentrate" : "Premium Add-on") + '</span>' +
        '<h3>' + p.name + '</h3>' +
        '<p class="tagline">' + p.tagline + '</p>' +
        '<p class="desc">' + p.description + '</p>' +
        '<div class="row">' +
          '<a class="btn btn-outline" href="' + (PAGE_IN_ASSETS ? "product.html" : "assets/product.html") + '?slug=' + p.slug + '">View Details</a>' +
          '<button class="btn btn-green" data-add-cart="' + p.slug + '">Add to Cart</button>' +
        '</div>' +
        '<div class="row">' +
          '<a class="btn btn-gold" target="_blank" rel="noopener" href="' + productWaLink(p.name) + '">Order</a>' +
        '</div>' +
      '</div></article>';
  }
  var conc = qs("#grid-concentrates"), add = qs("#grid-addons");
  if (conc) conc.innerHTML = PRODUCTS.filter(function (p) { return p.category === "concentrate"; }).map(card).join("");
  if (add) add.innerHTML = PRODUCTS.filter(function (p) { return p.category === "addon"; }).map(card).join("");
  initReveal();
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", function () {
  initNavbar();
  initCart();
  initReveal();
  initFactStrip();
  initModalBackdrops();
  initListen();
  initPartner();
  initProductGrids();
});

/* ---------- Transparent Ladakhi farmer thank-you film (6-character rotation) ---------- */
(function () {
  var inAssets = typeof PAGE_IN_ASSETS !== "undefined" && PAGE_IN_ASSETS;
    var gratitude = document.createElement("div");
    gratitude.className = "gratitude-overlay";
    gratitude.id = "gratitude-overlay";
    gratitude.setAttribute("aria-hidden", "true");
    gratitude.setAttribute("role", "status");
    gratitude.setAttribute("aria-live", "polite");
    gratitude.setAttribute("aria-label", "Thank you. Continuing to WhatsApp.");
    var gratitudeAssetPrefix = inAssets ? "" : "assets/";
    gratitude.innerHTML =
      '<div class="gratitude-shade" aria-hidden="true"></div>' +
      '<div class="gratitude-scene" aria-hidden="true">' +
        '<div class="gratitude-character-stage"><video class="gratitude-video" muted playsinline preload="auto" aria-hidden="true" src="' + gratitudeAssetPrefix + 'videos/thankyou-farmer-1.webm"></video><span class="gratitude-ground-shadow"></span></div>' +
        '<div class="gratitude-copy"><p class="gratitude-thanks">Thank You!</p></div>' +
        '<audio id="gratitude-audio" preload="auto" src="' + gratitudeAssetPrefix + 'audio/thankyou-voice.mp3"></audio>' +
      '</div>';
    document.body.appendChild(gratitude);
  
    var gratitudeDestination = "";
    var gratitudeTimer = 0;
    var gratitudeAudio = qs("#gratitude-audio", gratitude);
    var gratitudeVideo = qs(".gratitude-video", gratitude);
    var gratitudeCharacterIndex = 0;
    var gratitudeFallbackLastIndex = -1;
    var gratitudeCharacterStorageKey = "wellwith_thankyou_char_idx";
    var gratitudeCharacters = [
      { video: "thankyou-farmer-1.webm", voice: "thankyou-voice.mp3" },
      { video: "thankyou-farmer-2.webm", voice: "thankyou-voice-aunty.mp3" },
      { video: "thankyou-farmer-3.webm", voice: "thankyou-voice-child.mp3" },
      { video: "thankyou-farmer-4.webm", voice: "thankyou-voice-aunty.mp3" },
      { video: "thankyou-farmer-5.webm", voice: "thankyou-voice.mp3" },
      { video: "thankyou-farmer-6.webm", voice: "thankyou-voice-child.mp3" }
    ];
  
    function randomGratitudeCharacterIndex() {
      var count = gratitudeCharacters.length;
      if (count <= 1) return 0;
      var nextIndex = Math.floor(Math.random() * (count - 1));
      if (nextIndex >= gratitudeFallbackLastIndex && gratitudeFallbackLastIndex >= 0) nextIndex += 1;
      gratitudeFallbackLastIndex = nextIndex;
      return nextIndex;
    }
  
    function selectNextGratitudeCharacter() {
      try {
        var storedIndex = parseInt(window.localStorage.getItem(gratitudeCharacterStorageKey), 10);
        gratitudeCharacterIndex = isFinite(storedIndex) && storedIndex >= 0 ? storedIndex % gratitudeCharacters.length : 0;
        window.localStorage.setItem(gratitudeCharacterStorageKey, String((gratitudeCharacterIndex + 1) % gratitudeCharacters.length));
      } catch (e) {
        gratitudeCharacterIndex = randomGratitudeCharacterIndex();
      }
      var character = gratitudeCharacters[gratitudeCharacterIndex];
      gratitudeVideo.src = gratitudeAssetPrefix + "videos/" + character.video;
      gratitudeAudio.src = gratitudeAssetPrefix + "audio/" + character.voice;
    }
  
    function redirectToWhatsApp() {
      if (!gratitudeDestination) return;
      window.location.href = gratitudeDestination;
    }
  
    function playCheckoutGratitude(destination) {
      if (gratitude.classList.contains("active")) return;
      gratitudeDestination = destination;
      selectNextGratitudeCharacter();
      gratitude.classList.add("active");
      gratitude.setAttribute("aria-hidden", "false");
      document.body.classList.add("gratitude-open");
  
      window.clearTimeout(gratitudeTimer);
      gratitudeTimer = window.setTimeout(redirectToWhatsApp, 4500);
  
      try {
        gratitudeVideo.pause();
        gratitudeVideo.currentTime = 0;
        gratitudeAudio.pause();
        gratitudeAudio.currentTime = 0;
        gratitudeAudio.volume = 1;
  
        gratitudeVideo.addEventListener("ended", function () {
          window.clearTimeout(gratitudeTimer);
          gratitudeTimer = window.setTimeout(redirectToWhatsApp, 650);
        }, { once: true });
  
        var film = gratitudeVideo.play();
        var voice = gratitudeAudio.play();
        if (film && film.catch) film.catch(function () {});
        if (voice && voice.catch) voice.catch(function () {});
      } catch (e) {}
    }
  
    window.startWellWithThankYou = playCheckoutGratitude;
})();
