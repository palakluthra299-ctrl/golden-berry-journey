/* WellWith — shared interactions (navbar, reveal, fact strip, listen, partner, modals). */

function qs(sel, el) { return (el || document).querySelector(sel); }
function qsa(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

/* ---------- Cart ---------- */
var CART_KEY = "wellwith_cart_v1";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  updateCartBadge();
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
  afterCartChange();
}
function changeQty(slug, delta) {
  var cart = getCart();
  var q = (cart[slug] || 0) + delta;
  if (q <= 0) delete cart[slug];
  else cart[slug] = q;
  saveCart(cart);
  afterCartChange();
}
function afterCartChange() {
  refreshCartControls();
  if (typeof window !== "undefined" && typeof window.onCartChanged === "function") {
    window.onCartChanged();
  }
}
/* Inline card control: "Add to Cart" button, or qty stepper once added. */
function cartControlHTML(slug, extra) {
  var q = (getCart()[slug] || 0);
  var x = extra ? " " + extra : "";
  if (q <= 0) {
    return '<button class="btn btn-green' + x + '" data-add-cart="' + slug + '">Add to Cart</button>';
  }
  return '<span class="stepper-inline' + x + '">' +
    '<button data-cart-dec="' + slug + '" aria-label="Decrease quantity">−</button>' +
    '<span class="q">' + q + '</span>' +
    '<button data-cart-inc="' + slug + '" aria-label="Increase quantity">+</button>' +
    '<button class="sq-del" data-cart-del="' + slug + '" aria-label="Remove item">🗑️</button>' +
  '</span>';
}
function refreshCartControls() {
  qsa("[data-cart-control]").forEach(function (el) {
    el.innerHTML = cartControlHTML(el.getAttribute("data-cart-control"), el.getAttribute("data-cart-size") || "");
  });
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
  refreshCartControls();
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-add-cart],[data-cart-inc],[data-cart-dec],[data-cart-del]") : null;
    if (!t) return;
    if (t.hasAttribute("data-add-cart")) {
      addToCart(t.getAttribute("data-add-cart"));
    } else if (t.hasAttribute("data-cart-inc")) {
      changeQty(t.getAttribute("data-cart-inc"), 1);
    } else if (t.hasAttribute("data-cart-dec")) {
      changeQty(t.getAttribute("data-cart-dec"), -1);
    } else if (t.hasAttribute("data-cart-del")) {
      removeFromCart(t.getAttribute("data-cart-del"));
      showToast("Removed from cart");
      afterCartChange();
    }
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
      ? '<span class="cart-ctl" data-cart-control="' + slug + '" style="width:100%">' + cartControlHTML(slug) + '</span>'
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
          '<a class="btn btn-outline" href="product.html?slug=' + p.slug + '">View Details</a>' +
          '<span class="cart-ctl" data-cart-control="' + p.slug + '">' + cartControlHTML(p.slug) + '</span>' +
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
