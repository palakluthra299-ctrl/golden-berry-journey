/* WellWith, shared interactions (navbar, reveal, fact strip, listen, partner, modals). */

function qs(sel, el) { return (el || document).querySelector(sel); }
function qsa(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

/* ---------- Internal browser history ---------- */
/*
 * Full-screen views and overlays use real browser history entries. This keeps
 * Android/iOS back and desktop Back/Forward aligned with the visible UI while
 * leaving the URL unchanged.
 */
var WellWithHistory = (function () {
  var marker = "__wellwithNavigation";
  var routes = {};
  var applying = false;
  var started = false;

  function currentState() {
    var state = window.history.state;
    return state && state[marker] ? state : null;
  }
  function currentView() {
    var state = currentState();
    return state ? (state.wellwithView || "root") : "root";
  }
  function makeState(view, data) {
    var previous = window.history.state;
    var state = previous && typeof previous === "object" ? Object.assign({}, previous) : {};
    state[marker] = true;
    state.wellwithView = view || "root";
    state.wellwithData = data || {};
    return state;
  }
  function apply(state) {
    if (!started) return;
    var target = state && state[marker] ? (state.wellwithView || "root") : "root";
    var data = state && state[marker] ? (state.wellwithData || {}) : {};
    applying = true;
    Object.keys(routes).forEach(function (name) {
      if (name !== target && routes[name].hide) routes[name].hide(true);
    });
    if (target !== "root" && routes[target] && routes[target].show) routes[target].show(data, true);
    applying = false;
  }
  function init() {
    if (started) return;
    started = true;
    if (!currentState()) {
      window.history.replaceState(makeState("root", {}), "", window.location.href);
    }
    window.addEventListener("popstate", function (event) { apply(event.state); });
  }
  function register(name, show, hide) {
    routes[name] = { show: show, hide: hide };
    if (started && currentView() === name) apply(currentState());
  }
  function open(name, data) {
    if (!started || applying) return;
    var next = makeState(name, data || {});
    if (currentView() === name) window.history.replaceState(next, "", window.location.href);
    else window.history.pushState(next, "", window.location.href);
    apply(next);
  }
  function replace(name, data) {
    if (!started || applying) return;
    var next = makeState(name, data || {});
    window.history.replaceState(next, "", window.location.href);
    apply(next);
  }
  function close(name) {
    if (applying) return;
    if (currentView() === name) window.history.back();
    else if (routes[name] && routes[name].hide) routes[name].hide(true);
  }
  function preserveStateReplace(url) {
    window.history.replaceState(window.history.state, "", url);
  }

  return {
    init: init,
    register: register,
    open: open,
    replace: replace,
    close: close,
    currentView: currentView,
    preserveStateReplace: preserveStateReplace
  };
})();

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
    WellWithHistory.preserveStateReplace(url.pathname + url.search + url.hash);
  } catch (e) {}
  updateCartBadge();
  updateInternalCartLinks();
}
function cartCount() {
  var cart = getCart(), n = 0;
  for (var k in cart) { if (cart.hasOwnProperty(k)) n += cart[k]; }
  return n;
}
function cartTotal() {
  return cartItems().reduce(function (sum, item) {
    return sum + ((item.product.price || 0) * item.qty);
  }, 0);
}
function formatMoney(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
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
function updateFloatingCart(count) {
  qsa(".wa-float").forEach(function (el) {
    el.classList.toggle("is-cart-active", count > 0);
  });
}
function updateCartBadge() {
  var n = cartCount();
  qsa(".cart-count").forEach(function (el) {
    el.textContent = n;
    el.style.display = n > 0 ? "inline-flex" : "none";
  });
  updateFloatingCart(n);
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
  updateInternalCartLinks();
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-add-cart],[data-cart-inc],[data-cart-dec],[data-cart-del]") : null;
    if (t) {
      if (t.hasAttribute("data-add-cart")) {
        var sourceCard = t.closest ? t.closest(".quick-product-card,.product-card,.catalog-row") : null;
        var sourceImg = sourceCard ? qs("img", sourceCard) : null;
        addToCart(t.getAttribute("data-add-cart"));
        flyToCart(sourceImg || t);
      } else if (t.hasAttribute("data-cart-inc")) {
        changeQty(t.getAttribute("data-cart-inc"), 1);
      } else if (t.hasAttribute("data-cart-dec")) {
        changeQty(t.getAttribute("data-cart-dec"), -1);
      } else if (t.hasAttribute("data-cart-del")) {
        removeFromCart(t.getAttribute("data-cart-del"));
        showToast("Removed from cart");
        afterCartChange();
      }
    }
    var link = e.target.closest ? e.target.closest('a[href]:not([target="_blank"])') : null;
    if (link) link.setAttribute("href", withCartParam(link.getAttribute("href"), getCart()));
  });
}

/* ---------- Navbar ---------- */
function initNavbar() {
  var btn = qs("#hamburger"), menu = qs("#mobile-menu");
  if (btn && menu) {
    function setOpen(open, fromHistory) {
      if (!fromHistory) {
        if (open) WellWithHistory.open("mobile-menu", {});
        else WellWithHistory.close("mobile-menu");
        return;
      }
      menu.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      btn.textContent = open ? "✕" : "☰";
    }
    WellWithHistory.register("mobile-menu", function () { setOpen(true, true); }, function () { setOpen(false, true); });
    btn.addEventListener("click", function () { setOpen(!menu.classList.contains("open")); });
    qsa("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        if (WellWithHistory.currentView() === "mobile-menu") WellWithHistory.replace("root", {});
        else setOpen(false, true);
      });
    });
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("open") && !menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }
}

/* ---------- Premium visual polish ---------- */
function initVisualPolish() {
  document.documentElement.classList.add("motion-ready");

  var groups = [
    ".partner-grid", ".partner-why", ".review-grid", ".product-grid",
    ".cred-grid", ".flash-grid", ".juice-steps", ".trust-badges", ".cart-items"
  ];
  groups.forEach(function (selector) {
    qsa(selector).forEach(function (group) {
      Array.prototype.slice.call(group.children).forEach(function (item, i) {
        item.classList.add("reveal");
        item.style.setProperty("--reveal-delay", Math.min(i % 4, 3) * 85 + "ms");
      });
    });
  });

  qsa("#showcase .center, #partner .partner-heading, #reviews > .container > .center, .page-head > .center, .sf-wrap > .center, .expert-hero > *, .story-inner").forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", (i % 3) * 70 + "ms");
  });

  var heroItems = qsa(".hero-content > *");
  heroItems.forEach(function (el, i) {
    el.classList.add("hero-reveal");
    el.style.setProperty("--hero-delay", (90 + i * 95) + "ms");
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroItems.forEach(function (el) { el.classList.add("visible"); });
    });
  });

  var nav = qs(".navbar");
  if (nav) {
    function syncNav() { nav.classList.toggle("scrolled", window.scrollY > 18); }
    syncNav();
    window.addEventListener("scroll", syncNav, { passive: true });
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
  /* Safety: never leave content hidden, reveal everything after 2.5s no matter what. */
  setTimeout(function () {
    qsa(".reveal").forEach(function (e) { e.classList.add("visible"); });
  }, 2500);
}

/* ---------- Hero fact strip typewriter ---------- */
function initFactStrip() {
  var el = qs("#fact-strip");
  if (!el || typeof HERO_FACTS === "undefined") return;
  el.textContent = HERO_FACTS[0];
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
  var openers = qsa("[data-open-listen]");
  if ((!root && !openers.length) || typeof LISTEN_PRODUCTS === "undefined") return;
  var index = 0;

  function render() {
    if (!root) return;
    var p = LISTEN_PRODUCTS[index];
    root.innerHTML =
      '<div class="listen-card reveal visible">' +
        '<img class="product-img" src="' + p.image + '" alt="' + p.name + '" loading="lazy" decoding="async">' +
        '<h3 class="display">' + p.name + '</h3>' +
        '<p class="purpose">' + p.purpose + '</p>' +
        '<button class="btn btn-green" id="listen-open" style="margin-top:22px">Listen About This</button>' +
        '<div class="listen-nav">' +
          '<button class="nav-btn" id="listen-prev"' + (index === 0 ? " disabled" : "") + '>← Previous</button>' +
          '<span class="listen-count">' + (index + 1) + ' / ' + LISTEN_PRODUCTS.length + '</span>' +
          '<button class="nav-btn" id="listen-next"' + (index === LISTEN_PRODUCTS.length - 1 ? " disabled" : "") + '>Next →</button>' +
        '</div>' +
      '</div>';
    qs("#listen-prev", root).addEventListener("click", function () { if (index > 0) { index--; render(); } });
    qs("#listen-next", root).addEventListener("click", function () { if (index < LISTEN_PRODUCTS.length - 1) { index++; render(); } });
    qs("#listen-open", root).addEventListener("click", function () { openListenModal(index); });
  }

  function openListenModal(selectedIndex, fromHistory) {
    index = Math.max(0, Math.min(LISTEN_PRODUCTS.length - 1, Number(selectedIndex) || 0));
    if (!fromHistory) {
      WellWithHistory.open("listen", { index: index });
      return;
    }
    var p = LISTEN_PRODUCTS[index];
    var wrap = qs("#modal-slot");
    var slug = (p.url.split("slug=")[1] || "").split("&")[0];
    var addCartBtn = slug
      ? '<span class="cart-ctl" data-cart-control="' + slug + '" style="width:100%">' + cartControlHTML(slug) + '</span>'
      : "";
    wrap.innerHTML =
      '<div class="modal-backdrop experience-backdrop open" id="listen-modal">' +
        '<div class="modal experience-modal" role="dialog" aria-modal="true" aria-label="Listen Products">' +
          '<button class="modal-close" data-close="listen-modal" aria-label="Close">✕</button>' +
          '<img class="product-img" src="' + p.image + '" alt="' + p.name + '">' +
          '<h3 class="display">' + p.name + '</h3>' +
          '<p class="desc">' + p.description + '</p>' +
          '<div class="audio-box">' +
            '<div style="font-weight:600;font-size:14px">30-second audio</div>' +
            '<audio id="listen-audio" controls preload="metadata" src="' + p.audio + '"></audio>' +
            '<div class="audio-controls">' +
              '<button class="nav-btn" id="listen-replay">Replay</button>' +
              '<a class="nav-btn" href="' + p.url + '">View product →</a>' +
            '</div>' +
          '</div>' +
          '<div class="listen-nav listen-modal-nav">' +
            '<button class="nav-btn" id="listen-modal-prev"' + (index === 0 ? " disabled" : "") + '>← Previous</button>' +
            '<span class="listen-count">' + (index + 1) + ' / ' + LISTEN_PRODUCTS.length + '</span>' +
            '<button class="nav-btn" id="listen-modal-next"' + (index === LISTEN_PRODUCTS.length - 1 ? " disabled" : "") + '>Next →</button>' +
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
    qs("#listen-modal-prev").addEventListener("click", function () {
      if (index > 0) { stopAllAudio(); WellWithHistory.replace("listen", { index: index - 1 }); }
    });
    qs("#listen-modal-next").addEventListener("click", function () {
      if (index < LISTEN_PRODUCTS.length - 1) { stopAllAudio(); WellWithHistory.replace("listen", { index: index + 1 }); }
    });
    if (openModals.indexOf("listen-modal") === -1) openModals.push("listen-modal");
    document.body.style.overflow = "hidden";
    var a = qs("#listen-audio");
    a.play().catch(function () {});
  }

  function closeListen(fromHistory) {
    if (!fromHistory) {
      WellWithHistory.close("listen");
      return;
    }
    var bd = qs("#listen-modal");
    if (bd) bd.remove();
    stopAllAudio();
    openModals = openModals.filter(function (x) { return x !== "listen-modal"; });
    if (!openModals.length) document.body.style.overflow = "";
  }

  WellWithHistory.register("listen", function (data) {
    openListenModal(data.index || 0, true);
  }, closeListen);

  function listenOrderLink(name) {
    return waLink("Hello Palak Luthra, humne " + name + " ke baare mein suna hai and I want to order. Please share details.");
  }

  var featureCard = qs("#feature-listen-card");
  var featureOpen = qs("#feature-listen-open");
  var featureName = qs("#feature-listen-name");
  var featurePurpose = qs("#feature-listen-purpose");
  var featureImage = qs("#feature-listen-image");
  var featureDots = qs("#feature-listen-dots");
  var featureIndex = 0;
  var featureCount = Math.min(4, LISTEN_PRODUCTS.length);
  var featureTimer = 0;

  function showFeatureItem(nextIndex, animate) {
    if (!featureOpen || !featureCount) return;
    featureIndex = (nextIndex + featureCount) % featureCount;
    var item = LISTEN_PRODUCTS[featureIndex];
    function updateFeature() {
      featureName.textContent = item.name;
      featurePurpose.textContent = item.purpose;
      featureImage.src = item.image;
      featureImage.alt = "";
      featureOpen.setAttribute("data-listen-index", String(featureIndex));
      featureDots.innerHTML = Array.from({ length: featureCount }, function (_, dotIndex) {
        return '<i class="' + (dotIndex === featureIndex ? 'active' : '') + '"></i>';
      }).join("");
      featureOpen.classList.remove("is-changing");
    }
    if (animate) {
      featureOpen.classList.add("is-changing");
      window.setTimeout(updateFeature, 210);
    } else updateFeature();
  }
  function resetFeatureTimer() {
    window.clearInterval(featureTimer);
    if (!featureCount) return;
    var softenMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    featureTimer = window.setInterval(function () { showFeatureItem(featureIndex + 1, !softenMotion); }, 4200);
  }
  if (featureCard && featureOpen) {
    showFeatureItem(0, false);
    resetFeatureTimer();
  }

  openers.forEach(function (opener) {
    opener.addEventListener("click", function () {
      if (opener.id === "feature-listen-open") {
        resetFeatureTimer();
        openListenModal(featureIndex);
        return;
      }
      var selected = parseInt(opener.getAttribute("data-listen-index") || "0", 10);
      openListenModal(isNaN(selected) ? 0 : selected);
    });
  });
  render();
}

/* ---------- Partner With Us (home) ---------- */
function initPartner() {
  var grid = qs("#partner-grid"), whyRoot = qs("#partner-why");
  var businessOpeners = qsa("[data-open-business-listen]");
  if (typeof PARTNER_MODELS === "undefined") return;

  function openBusinessExperience(selectedIndex, fromHistory) {
    var index = Math.max(0, Math.min(PARTNER_MODELS.length - 1, Number(selectedIndex) || 0));
    if (!fromHistory) {
      WellWithHistory.open("business-listen", { index: index });
      return;
    }
    var images = [
      "assets/products-transparent/pulp.png",
      "assets/products-transparent/omega-capsules.png",
      "assets/products-transparent/tisane.png"
    ];

    function renderBusinessExperience() {
      var m = PARTNER_MODELS[index];
      var wrap = qs("#modal-slot");
      wrap.innerHTML =
        '<div class="modal-backdrop experience-backdrop open" id="business-listen-modal">' +
          '<div class="modal experience-modal" role="dialog" aria-modal="true" aria-label="Want to do business with us?">' +
            '<button class="modal-close" data-close="business-listen-modal" aria-label="Close">✕</button>' +
            '<img class="product-img" src="' + images[index] + '" alt="" aria-hidden="true">' +
            '<p class="experience-eyebrow">Business opportunity ' + (index + 1) + ' of ' + PARTNER_MODELS.length + '</p>' +
            '<h3 class="display">' + m.name + '</h3>' +
            '<p class="desc">' + m.tagline + '</p>' +
            '<div class="experience-points">' + m.benefits.map(function (benefit) { return '<span>' + benefit + '</span>'; }).join("") + '</div>' +
            '<div class="audio-box">' +
              '<div>Listen about this opportunity</div>' +
              '<audio id="business-listen-audio" controls preload="metadata" src="' + m.audio + '"></audio>' +
              '<div class="audio-controls"><button class="nav-btn" id="business-replay">Replay</button></div>' +
            '</div>' +
            '<div class="listen-nav listen-modal-nav">' +
              '<button class="nav-btn" id="business-modal-prev"' + (index === 0 ? " disabled" : "") + '>← Previous</button>' +
              '<span class="listen-count">' + (index + 1) + ' / ' + PARTNER_MODELS.length + '</span>' +
              '<button class="nav-btn" id="business-modal-next"' + (index === PARTNER_MODELS.length - 1 ? " disabled" : "") + '>Next →</button>' +
            '</div>' +
            '<a class="btn btn-gold wa-order" target="_blank" rel="noopener" href="' +
              waLink("Hello Palak Luthra, humne " + m.name + " ke baare mein suna hai and I want to know more. Please share details.") +
              '">Enquire on WhatsApp</a>' +
          '</div>' +
        '</div>';
      var bd = qs("#business-listen-modal");
      bd.addEventListener("click", function (e) { if (e.target === bd) closeBusinessExperience(); });
      qs('[data-close="business-listen-modal"]').addEventListener("click", closeBusinessExperience);
      qs("#business-replay").addEventListener("click", function () {
        var audio = qs("#business-listen-audio"); audio.currentTime = 0; audio.play();
      });
      qs("#business-modal-prev").addEventListener("click", function () {
        if (index > 0) { stopAllAudio(); WellWithHistory.replace("business-listen", { index: index - 1 }); }
      });
      qs("#business-modal-next").addEventListener("click", function () {
        if (index < PARTNER_MODELS.length - 1) { stopAllAudio(); WellWithHistory.replace("business-listen", { index: index + 1 }); }
      });
      if (openModals.indexOf("business-listen-modal") === -1) openModals.push("business-listen-modal");
      document.body.style.overflow = "hidden";
      qs("#business-listen-audio").play().catch(function () {});
    }

    function closeBusinessExperience(fromHistory) {
      if (!fromHistory) {
        WellWithHistory.close("business-listen");
        return;
      }
      var bd = qs("#business-listen-modal");
      if (bd) bd.remove();
      stopAllAudio();
      openModals = openModals.filter(function (x) { return x !== "business-listen-modal"; });
      if (!openModals.length) document.body.style.overflow = "";
    }

    renderBusinessExperience();
  }

  WellWithHistory.register("business-listen", function (data) {
    openBusinessExperience(data.index || 0, true);
  }, function () {
    var modal = qs("#business-listen-modal");
    if (modal) modal.remove();
    stopAllAudio();
    openModals = openModals.filter(function (id) { return id !== "business-listen-modal"; });
    if (!openModals.length) document.body.style.overflow = "";
  });

  businessOpeners.forEach(function (opener) {
    opener.addEventListener("click", function () { openBusinessExperience(0); });
  });

  if (!grid) return;

  var whyHtml = '<div class="partner-why">' + WHY_WELLWITH.map(function (w) {
    return '<div class="why-row reveal"><span class="dot">●</span><div><strong>' + w.title +
      '</strong><p>' + w.text + '</p></div></div>';
  }).join("") + '</div>';

  grid.innerHTML =
    '<div class="partner-grid">' + PARTNER_MODELS.map(function (m, i) {
      return '<div class="partner-card reveal">' +
        '<span class="partner-index" aria-hidden="true">0' + (i + 1) + '</span>' +
        '<h3>' + m.name + '</h3>' +
        '<p class="tagline">' + m.tagline + '</p>' +
        '<ul>' + m.benefits.map(function (b) { return '<li>' + b + '</li>'; }).join("") + '</ul>' +
        '<div class="partner-actions">' +
          '<button class="btn btn-outline" data-partner="' + i + '" aria-label="Listen about ' + m.name + '"><span class="partner-action-wide">Listen About This</span><span class="partner-action-short">Listen</span></button>' +
          '<a class="btn btn-gold" target="_blank" rel="noopener" aria-label="Enquire about ' + m.name + ' on WhatsApp" href="' +
          waLink("Hello Palak Luthra, humne " + m.name + " ke baare mein suna hai and I want to know more. Please share details.") +
          '"><span class="partner-action-wide">Enquire on WhatsApp</span><span class="partner-action-short">Enquire</span></a>' +
        '</div>' +
      '</div>';
    }).join("") + '</div>';
  if (whyRoot) whyRoot.innerHTML = whyHtml;

  qsa("[data-partner]", grid).forEach(function (btn) {
    btn.addEventListener("click", function () { openPartnerModal(PARTNER_MODELS[+btn.dataset.partner]); });
  });

  function openPartnerModal(m, fromHistory) {
    if (!fromHistory) {
      WellWithHistory.open("partner", { index: Math.max(0, PARTNER_MODELS.indexOf(m)) });
      return;
    }
    var wrap = qs("#modal-slot");
    wrap.innerHTML =
      '<div class="modal-backdrop open" id="partner-modal">' +
        '<div class="modal" role="dialog" aria-modal="true">' +
          '<button class="modal-close" data-close="partner-modal" aria-label="Close">✕</button>' +
          '<span class="partner-index">' + m.name + '</span>' +
          '<h3 class="display">Partnership details</h3>' +
          '<p class="desc">' + m.message + '</p>' +
          '<div style="text-align:left;margin-top:18px">' +
            m.why.map(function (w) { return '<div class="why-row" style="margin-bottom:10px"><span class="dot">✓</span><div><p style="color:var(--text)">' + w + '</p></div></div>'; }).join("") +
          '</div>' +
          '<div class="audio-box">' +
            '<div style="font-weight:600;font-size:14px">Listen about ' + m.name + '</div>' +
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

  function closePartner(fromHistory) {
    if (!fromHistory) {
      WellWithHistory.close("partner");
      return;
    }
    var bd = qs("#partner-modal");
    if (bd) bd.remove();
    stopAllAudio();
    openModals = openModals.filter(function (x) { return x !== "partner-modal"; });
    if (!openModals.length) document.body.style.overflow = "";
  }

  WellWithHistory.register("partner", function (data) {
    openPartnerModal(PARTNER_MODELS[data.index || 0] || PARTNER_MODELS[0], true);
  }, closePartner);
}

/* ---------- Products ---------- */
function initProductGrids() {
  if (typeof PRODUCTS === "undefined") return;
  function card(p) {
    return '<article class="product-card reveal">' +
      '<div class="img-wrap">' +
      '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" decoding="async"></div>' +
      '<div class="body">' +
        '<h3>' + p.name + '</h3>' +
        '<div class="product-price">' + formatMoney(p.price) + '</div>' +
        '<p class="tagline">' + p.tagline + '</p>' +
        '<p class="desc">' + p.description + '</p>' +
        '<div class="row">' +
          '<a class="btn btn-outline" href="' + (PAGE_IN_ASSETS ? "product.html" : "assets/product.html") + '?slug=' + p.slug + '">View Details</a>' +
          '<span class="cart-ctl" data-cart-control="' + p.slug + '">' + cartControlHTML(p.slug) + '</span>' +
        '</div>' +
        '<div class="row">' +
          '<a class="btn btn-gold" target="_blank" rel="noopener" href="' + productWaLink(p.name) + '">Buy Now</a>' +
        '</div>' +
      '</div></article>';
  }
  var all = qs("#grid-products");
  var conc = qs("#grid-concentrates"), add = qs("#grid-addons");
  if (all) all.innerHTML = PRODUCTS.map(card).join("");
  if (conc) conc.innerHTML = PRODUCTS.filter(function (p) { return p.category === "concentrate"; }).map(card).join("");
  if (add) add.innerHTML = PRODUCTS.filter(function (p) { return p.category === "addon"; }).map(card).join("");
}

/* ---------- Full-screen customer review player ---------- */
function initReviewVideos() {
  var entries = [
    { slug: "sea-buckthorn-pulp", src: "assets/videos/reviews/pulp.mp4", poster: "assets/videos/reviews/posters/pulp.jpg", label: "Customer feedback video: Sea Buckthorn Pulp", title: "Sea Buckthorn Pulp", buy: "https://wa.me/919266086554?text=Namaste%20Palak%21%20I%20want%20to%20buy%20WellWith%20Sea%20Buckthorn%20Pulp.%20Please%20share%20order%20details." },
    { slug: "omega-7-capsules", src: "assets/videos/reviews/oil-capsules.mp4", poster: "assets/videos/reviews/posters/oil-capsules.jpg", label: "Customer feedback video: Omega 7 Oil Capsules", title: "Omega 7 Oil Capsules", buy: "https://wa.me/919266086554?text=Namaste%20Palak%21%20I%20want%20to%20buy%20WellWith%20Omega%207%20Oil%20Capsules.%20Please%20share%20order%20details." },
    { slug: "diawell", src: "assets/videos/reviews/diawell.mp4", poster: "assets/videos/reviews/posters/diawell.jpg", label: "Customer feedback video: Diawell", title: "Diawell", buy: "https://wa.me/919266086554?text=Namaste%20Palak%21%20I%20want%20to%20buy%20WellWith%20Diawell.%20Please%20share%20order%20details." },
    { slug: "fitwell", src: "assets/videos/reviews/fitwell.mp4", poster: "assets/videos/reviews/posters/fitwell.jpg", label: "Customer feedback video: Fitwell", title: "Fitwell", buy: productWaLink("Fitwell") },
    { slug: "femwell", src: "assets/videos/reviews/femwell.mp4", poster: "assets/videos/reviews/posters/femwell.jpg", label: "Customer feedback video: Femwell", title: "Femwell", buy: productWaLink("Femwell") },
    { slug: "power-x", src: "assets/videos/reviews/powerx.mp4", poster: "assets/videos/reviews/posters/powerx.jpg", label: "Customer feedback video: PowerX", title: "PowerX", buy: productWaLink("PowerX") },
    { slug: "gummies-30", src: "assets/videos/reviews/gummies.mp4", poster: "assets/videos/reviews/posters/gummies.jpg", label: "Customer feedback video: Sea Buckthorn Gummies", title: "Sea Buckthorn Gummies", buy: "https://wa.me/919266086554?text=Namaste%20Palak%21%20I%20want%20to%20buy%20WellWith%20Sea%20Buckthorn%20Gummies.%20Please%20share%20order%20details." },
    { slug: "nourishing-face-oil", src: "assets/videos/reviews/face-oil.mp4", poster: "assets/videos/reviews/posters/face-oil.jpg", label: "Customer feedback video: Nourishing Face Oil", title: "Nourishing Face Oil", buy: "https://wa.me/919266086554?text=Namaste%20Palak%21%20I%20want%20to%20buy%20WellWith%20Nourishing%20Face%20Oil.%20Please%20share%20order%20details." }
  ];

  window.WELLWITH_REVIEW_ENTRIES = entries;
  WellWithHistory.register("reviews", function (data) {
    openReviewPlayer(data.index || 0, entries, true);
  }, function () {
    var overlay = qs(".review-modal-backdrop");
    if (overlay && typeof overlay._wellwithClose === "function") overlay._wellwithClose(true);
  });
  qsa("[data-open-reviews]").forEach(function (button) {
    button.addEventListener("click", function () { WellWithHistory.open("reviews", { index: 0 }); });
  });
}

function openReviewPlayer(startIndex, entries, fromHistory) {
  var index = Math.max(0, Math.min(entries.length - 1, Number(startIndex) || 0));
  if (!fromHistory) {
    WellWithHistory.open("reviews", { index: index });
    return;
  }
  var existingOverlay = qs(".review-modal-backdrop");
  if (existingOverlay && typeof existingOverlay._wellwithClose === "function") existingOverlay._wellwithClose(true);
  var overlay = document.createElement("div");
  overlay.className = "review-modal-backdrop";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  function render() {
    var item = entries[index];
    overlay.setAttribute("aria-label", item.label);
    overlay.innerHTML =
      '<div class="review-modal-panel">' +
        '<div class="review-modal-stage">' +
          '<video class="review-modal-video" controls autoplay playsinline preload="metadata" poster="' + item.poster + '">' +
            '<source src="' + item.src + '" type="video/mp4">' +
          '</video>' +
          '<button class="review-modal-close" type="button" aria-label="Close video">✕</button>' +
          '<div class="review-skip-feedback" aria-live="polite"></div>' +
        '</div>' +
        '<div class="review-modal-body">' +
          '<h3>' + item.title + '</h3>' +
          '<div class="review-modal-nav">' +
            '<button class="nav-btn review-prev" type="button"' + (index === 0 ? ' disabled' : '') + '>← Previous</button>' +
            '<span class="review-modal-count">' + (index + 1) + ' / ' + entries.length + '</span>' +
            '<button class="nav-btn review-next" type="button"' + (index === entries.length - 1 ? ' disabled' : '') + '>Next →</button>' +
          '</div>' +
          '<div class="review-product-actions"><span class="cart-ctl" data-cart-control="' + item.slug + '">' + cartControlHTML(item.slug) + '</span>' +
          '<a class="btn btn-gold" target="_blank" rel="noopener" href="' + item.buy + '">Buy on WhatsApp</a></div>' +
          '<p class="review-control-note">Play, pause or move the slider. Double-click either side to skip 10 seconds.</p>' +
        '</div>' +
      '</div>';
    var video = qs(".review-modal-video", overlay);
    var stage = qs(".review-modal-stage", overlay);
    var feedback = qs(".review-skip-feedback", overlay);
    var feedbackTimer = null;
    function skip(seconds) {
      if (!isFinite(video.duration)) return;
      video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
      feedback.textContent = seconds < 0 ? "↺ 10 sec" : "10 sec ↻";
      feedback.classList.add("show");
      if (feedbackTimer) clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(function () { feedback.classList.remove("show"); }, 650);
    }
    stage.addEventListener("dblclick", function (e) {
      if (e.target.closest && e.target.closest("button")) return;
      var bounds = stage.getBoundingClientRect();
      skip(e.clientX < bounds.left + bounds.width / 2 ? -10 : 10);
    });
    qs(".review-modal-close", overlay).addEventListener("click", close);
    qs(".review-prev", overlay).addEventListener("click", function () {
      if (index > 0) { try { video.pause(); } catch (e) {} WellWithHistory.replace("reviews", { index: index - 1 }); }
    });
    qs(".review-next", overlay).addEventListener("click", function () {
      if (index < entries.length - 1) { try { video.pause(); } catch (e) {} WellWithHistory.replace("reviews", { index: index + 1 }); }
    });
    video.play().catch(function () {});
  }
  function close(fromHistory) {
    if (!fromHistory) {
      WellWithHistory.close("reviews");
      return;
    }
    var video = qs(".review-modal-video", overlay);
    if (video) { try { video.pause(); } catch (e) {} }
    overlay.remove();
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
  }
  overlay._wellwithClose = close;
  function onKey(e) {
    if (e.key === "Escape") close();
    var video = qs(".review-modal-video", overlay);
    if (video && e.key === "ArrowLeft") video.currentTime = Math.max(0, video.currentTime - 10);
    if (video && e.key === "ArrowRight" && isFinite(video.duration)) video.currentTime = Math.min(video.duration, video.currentTime + 10);
  }
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  document.addEventListener("keydown", onKey);
  render();
}

/* ---------- Health coach profile ---------- */
function initCoachExperience() {
  qsa("[data-open-coach]").forEach(function (opener) {
    opener.addEventListener("click", openCoach);
  });

  function openCoach(fromHistory) {
    if (!fromHistory) {
      WellWithHistory.open("coach", {});
      return;
    }
    var wrap = qs("#modal-slot");
    wrap.innerHTML =
      '<div class="modal-backdrop experience-backdrop open" id="coach-modal">' +
        '<div class="modal experience-modal coach-experience-modal" role="dialog" aria-modal="true" aria-labelledby="coach-name">' +
          '<button class="modal-close" data-close="coach-modal" aria-label="Close">✕</button>' +
          '<div class="coach-profile-visual"><img src="assets/palak-luthra-profile.jpg" alt="Palak Luthra"></div>' +
          '<p class="experience-eyebrow">WellWith Health Coach</p>' +
          '<h3 class="display" id="coach-name">Palak Luthra</h3>' +
          '<p class="desc">Get personal guidance on selecting WellWith products for your everyday wellness goals and routine.</p>' +
          '<a class="btn btn-gold wa-order" target="_blank" rel="noopener" href="' + waLink("Namaste Palak! I would like to consult you about WellWith products and wellness guidance.") + '">Contact on WhatsApp</a>' +
        '</div>' +
      '</div>';
    var modal = qs("#coach-modal");
    modal.addEventListener("click", function (event) { if (event.target === modal) closeCoach(); });
    qs('[data-close="coach-modal"]', modal).addEventListener("click", closeCoach);
    if (openModals.indexOf("coach-modal") === -1) openModals.push("coach-modal");
    document.body.style.overflow = "hidden";
  }

  function closeCoach(fromHistory) {
    if (!fromHistory) {
      WellWithHistory.close("coach");
      return;
    }
    var modal = qs("#coach-modal");
    if (modal) modal.remove();
    openModals = openModals.filter(function (id) { return id !== "coach-modal"; });
    if (!openModals.length) document.body.style.overflow = "";
  }

  WellWithHistory.register("coach", function () { openCoach(true); }, closeCoach);
}

/* ---------- Berry Explorer ---------- */
function initBerryExplorer() {
  var root = qs("#berry-explorer");
  if (!root) return;
  var nutrients = {
    omega7: {
      name: "Omega-7",
      benefit: "A signature fatty acid in Sea Buckthorn that helps support skin and mucous membrane health as part of a balanced diet."
    },
    vitaminc: {
      name: "Vitamin C",
      benefit: "An essential vitamin that contributes to normal immune function and collagen formation, while helping protect cells from oxidative stress."
    },
    vitamine: {
      name: "Vitamin E",
      benefit: "A fat-soluble antioxidant that contributes to the protection of cells from oxidative stress."
    },
    antioxidants: {
      name: "Antioxidants",
      benefit: "Naturally occurring plant compounds that help the body defend cells against oxidative stress caused by free radicals."
    },
    omegas: {
      name: "Omega-3, 6 & 9",
      benefit: "A broad spectrum of fatty acids that supports balanced lipid nutrition and normal cell function as part of a varied diet."
    },
    carotenoids: {
      name: "Carotenoids",
      benefit: "The natural pigments behind the berry’s vivid colour, valued for antioxidant activity; some carotenoids can also be converted to vitamin A."
    }
  };
  var order = ["omega7", "vitaminc", "vitamine", "antioxidants", "omegas", "carotenoids"];
  var nameEl = qs("#berry-detail-name", root);
  var benefitEl = qs("#berry-detail-benefit", root);
  var countEl = qs("#berry-detail-count", root);

  function selectNutrient(key) {
    if (!nutrients[key]) return;
    nameEl.textContent = nutrients[key].name;
    benefitEl.textContent = nutrients[key].benefit;
    countEl.textContent = "Nutrient " + (order.indexOf(key) + 1) + " of " + order.length;
    qsa("[data-nutrient]", root).forEach(function (button) {
      var selected = button.getAttribute("data-nutrient") === key;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  qsa("[data-nutrient]", root).forEach(function (button) {
    button.addEventListener("click", function () {
      selectNutrient(button.getAttribute("data-nutrient"));
    });
  });
}

/* ---------- Quick-commerce home, catalog and cart sheet ---------- */
function flyToCart(source) {
  var target = qs("#quick-cart-pill");
  if (!source || !target || !source.getBoundingClientRect) return;
  var a = source.getBoundingClientRect(), b = target.getBoundingClientRect();
  var clone = source.cloneNode(source.tagName === "IMG");
  clone.className = "fly-product";
  clone.style.left = a.left + "px"; clone.style.top = a.top + "px";
  clone.style.width = Math.max(32, Math.min(a.width, 72)) + "px";
  clone.style.height = Math.max(32, Math.min(a.height, 72)) + "px";
  document.body.appendChild(clone);
  requestAnimationFrame(function () {
    clone.style.transform = "translate3d(" + (b.left + b.width / 2 - a.left - 32) + "px," + (b.top + b.height / 2 - a.top - 32) + "px,0) scale(.2) rotate(12deg)";
    clone.style.opacity = "0.15";
  });
  setTimeout(function () { clone.remove(); target.classList.add("cart-pop"); setTimeout(function () { target.classList.remove("cart-pop"); }, 300); }, 580);
}

function initQuickCommerce() {
  if (typeof PRODUCTS === "undefined") return;
  var inAssets = typeof PAGE_IN_ASSETS !== "undefined" && PAGE_IN_ASSETS;
  var homeHref = inAssets ? "../index.html" : "index.html";
  var isHome = !!qs(".quick-home");

  function icon(path) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + path + '"/></svg>';
  }
  var nav = document.createElement("nav");
  nav.className = "bottom-tabs";
  nav.setAttribute("aria-label", "Primary mobile navigation");
  var initialTab = isHome && /^(?:#categories|#products)$/.test(location.hash) ? location.hash.slice(1) : "home";
  nav.innerHTML =
    '<a class="' + (initialTab === 'home' ? 'active' : '') + '" data-bottom-tab="home" href="' + homeHref + '#home">' + icon('M3 11.5 12 4l9 7.5M5.5 10v10h13V10M9 20v-6h6v6') + '<span>Home</span></a>' +
    '<a class="' + (initialTab === 'categories' ? 'active' : '') + '" data-bottom-tab="categories" href="' + homeHref + '#categories">' + icon('M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z') + '<span>Categories</span></a>' +
    '<a class="' + (initialTab === 'products' ? 'active' : '') + '" data-bottom-tab="products" href="' + homeHref + '#products">' + icon('M4 7.5 12 3l8 4.5v9L12 21l-8-4.5zM12 12l8-4.5M12 12 4 7.5M12 12v9') + '<span>Products</span></a>' +
    '<button type="button" data-bottom-tab="menu" aria-haspopup="dialog" aria-controls="site-menu">' + icon('M4 6h16M4 12h16M4 18h16') + '<span>More</span></button>';

  var siteMenu = document.createElement("div");
  siteMenu.innerHTML = '<button class="site-menu-close" type="button" aria-label="Close menu">×</button>';
  var menuTrigger = null;
  function openSiteMenu() {
    closeSheet(); closeCatalog(); closeBusiness();
    siteMenu.classList.add("active");
    siteMenu.setAttribute("aria-hidden", "false");
    if (menuTrigger) menuTrigger.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () { siteMenu.classList.add("open"); });
    document.body.classList.add("site-menu-open");
  }
  function closeSiteMenu() {
    siteMenu.classList.remove("open");
    siteMenu.setAttribute("aria-hidden", "true");
    if (menuTrigger) menuTrigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("site-menu-open");
    setTimeout(function () { if (!siteMenu.classList.contains("open")) siteMenu.classList.remove("active"); }, 320);
  }
  if (menuTrigger) menuTrigger.addEventListener("click", openSiteMenu);
  qs(".site-menu-close", siteMenu).addEventListener("click", closeSiteMenu);
  siteMenu.addEventListener("click", function (e) { if (e.target === siteMenu) closeSiteMenu(); });
  qsa("[data-site-nav]", siteMenu).forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (!isHome) return;
      e.preventDefault();
      var destination = link.getAttribute("data-site-nav");
      closeSiteMenu();
      setActiveTab(destination === "categories" ? "categories" : destination === "products" ? "products" : destination === "home" ? "home" : "menu");
      if (destination === "products") { openCatalog("all"); return; }
      closeCatalog();
      var target = qs("#" + destination);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      try {
        var url = new URL(window.location.href);
        url.hash = destination;
        WellWithHistory.preserveStateReplace(url.pathname + url.search + url.hash);
      } catch (err) {}
    });
  });

  var pill = document.createElement("button");
  pill.type = "button"; pill.id = "quick-cart-pill"; pill.className = "quick-cart-pill";
  pill.setAttribute("aria-label", "Open cart");
  document.body.appendChild(pill);

  var sheet = document.createElement("div");
  sheet.className = "cart-sheet-backdrop"; sheet.id = "cart-sheet";
  sheet.innerHTML = '<section class="cart-sheet" role="dialog" aria-modal="true" aria-labelledby="cart-sheet-title"><div class="sheet-handle"></div><header><div><p>Your basket</p><h2 id="cart-sheet-title">Cart</h2></div><button type="button" class="sheet-close" aria-label="Close cart">×</button></header><div id="cart-sheet-body"></div></section>';
  document.body.appendChild(sheet);

  /* ---------- Transparent Ladakhi farmer thank-you film ---------- */
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

  function hideCheckoutGratitude() {
    gratitude.classList.remove("active");
    gratitude.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gratitude-open");
    try {
      gratitudeVideo.pause();
      gratitudeAudio.pause();
    } catch (e) {}
  }

  function playCheckoutGratitude(destination) {
    if (gratitude.classList.contains("active")) return;
    gratitudeDestination = destination;
    selectNextGratitudeCharacter();
    gratitude.classList.add("active");
    gratitude.setAttribute("aria-hidden", "false");
    document.body.classList.add("gratitude-open");

    window.clearTimeout(gratitudeTimer);
    /* 3-second flow: thank-you shows ~1.5s, auto-hides to normal screen, WhatsApp opens at 3s */
    gratitudeTimer = window.setTimeout(function () {
      hideCheckoutGratitude();
      gratitudeTimer = window.setTimeout(redirectToWhatsApp, 1500);
    }, 1500);

    try {
      gratitudeVideo.pause();
      gratitudeVideo.currentTime = 0;
      gratitudeAudio.pause();
      gratitudeAudio.currentTime = 0;
      gratitudeAudio.volume = 1;

      var film = gratitudeVideo.play();
      var voice = gratitudeAudio.play();
      if (film && film.catch) film.catch(function () {});
      if (voice && voice.catch) voice.catch(function () {});
    } catch (e) {}
  }

  window.startWellWithThankYou = playCheckoutGratitude;

  var catalog = document.createElement("div");
  catalog.className = "catalog-view"; catalog.id = "catalog-view";
  catalog.innerHTML = '<div class="catalog-shell"><header class="catalog-header"><button type="button" class="catalog-back" aria-label="Back">←</button><div><p>WellWith Shop</p><h2 id="catalog-title">All Products</h2></div><button type="button" class="catalog-heart" aria-label="Wishlist">♡</button><button type="button" class="catalog-search-btn" aria-label="Search">' + icon('m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z') + '</button></header><div class="catalog-promo"><strong>Pure WellWith wellness</strong><span>Explore the complete WellWith collection</span></div><div class="catalog-layout"><aside class="catalog-sidebar" id="catalog-sidebar"></aside><main class="catalog-results"><div class="catalog-grid" id="catalog-grid"></div></main></div></div>';
  document.body.appendChild(catalog);

  var business = document.createElement("div");
  business.className = "business-view"; business.id = "business-view";
  business.innerHTML = '<div class="business-shell"><header class="catalog-header"><button type="button" class="business-back" aria-label="Back">←</button><div><p>WellWith Business</p><h2>Business Zone</h2></div></header><div class="business-layout"><aside class="business-sidebar" id="business-sidebar"></aside><main class="business-results" id="business-results"></main></div></div>';
  document.body.appendChild(business);

  var businessGroups = [
    { key: "partner", label: "Partner", model: PARTNER_MODELS[0] },
    { key: "b2b", label: "B2B", model: PARTNER_MODELS[2] },
    { key: "retail", label: "Retail", model: PARTNER_MODELS[1] }
  ];
  qs("#business-sidebar", business).innerHTML = businessGroups.map(function (group) {
    return '<button type="button" data-business-filter="' + group.key + '"><span>' + group.label.charAt(0) + '</span><b>' + group.label + '</b></button>';
  }).join("");

  var catalogGroups = [
    ["all", "All", "pulp.png"], ["concentrate", "Juices", "diawell.png"],
    ["capsules", "Capsules", "omega-capsules.png"], ["oils", "Oils", "face-oil.png"],
    ["tea", "Tea", "tisane.png"], ["foods", "Foods", "gummies-30.png"],
    ["skincare", "Face", "sunscreen-50.png"], ["body", "Body", "foot-cream-50.png"]
  ];
  qs("#catalog-sidebar", catalog).innerHTML = catalogGroups.map(function (g) {
    return '<button type="button" data-catalog-filter="' + g[0] + '"><span><img src="' + (inAssets ? 'products-transparent/' : 'assets/products-transparent/') + g[2] + '" alt=""></span><b>' + g[1] + '</b></button>';
  }).join("");

  function productMatches(p, key) {
    var text = (p.slug + " " + p.name + " " + p.tagline).toLowerCase();
    if (!key || key === "all") return true;
    if (key === "wellness") return p.category === "concentrate" || /capsule|gumm|powder|berry|collagen|tablet/.test(text);
    if (key === "capsules") return /capsule|tablet/.test(text);
    if (key === "oils") return /oil/.test(text);
    if (key === "tea") return /tea|tisane|ctc/.test(text);
    if (key === "foods") return /gumm|jam|rice|berry|powder|collagen/.test(text);
    if (key === "skincare" || key === "face") return /face|cream|cleanser|sunscreen|soap|scar|gluta|ubtan/.test(text);
    if (key === "body") return /foot|pain|massage|soap|scar/.test(text);
    return p.category === key;
  }

  function quickCard(p) {
    return '<article class="quick-product-card">' +
      '<button class="quick-product-open" type="button" data-open-list="' + p.category + '" aria-label="View ' + p.name + '">' +
        '<span class="quick-img-swap"><img src="' + p.image + '" alt="' + p.name + '" loading="lazy"></span>' +
      '</button>' +
      '<div class="quick-card-body"><button class="quick-name" type="button" data-open-list="' + p.category + '">' + p.name + '</button>' +
      '<p>1 pack</p><div class="quick-price-row"><strong>' + formatMoney(p.price) + '</strong><span data-cart-control="' + p.slug + '">' + cartControlHTML(p.slug, "quick-stepper") + '</span></div></div></article>';
  }

  function renderRails() {
    var root = qs("#rail-products");
    if (root) root.innerHTML = PRODUCTS.map(quickCard).join("");
  }

  var activeFilter = "all";
  function listingCard(p) {
    var off = Math.max(0, (p.mrp || p.price) - p.price);
    return '<article class="listing-card">' +
      '<div class="listing-image"><button class="wish-btn" type="button" aria-label="Add ' + p.name + ' to wishlist">♡</button><span class="quick-img-swap"><img src="' + p.image + '" alt="' + p.name + '"></span><span class="listing-add" data-cart-control="' + p.slug + '">' + cartControlHTML(p.slug, "listing-stepper") + '</span></div>' +
      '<div class="listing-price"><strong>' + formatMoney(p.price) + '</strong><del>' + formatMoney(p.mrp || p.price) + '</del></div>' +
      '<div class="listing-off">' + (off ? formatMoney(off) + ' OFF' : 'MRP pricing') + '</div>' +
      '<h3>' + p.name + '</h3><p>1 pack</p><button class="variant-link" type="button">1 variant ›</button>' +
    '</article>';
  }
  function openCatalog(key, query, fromHistory) {
    activeFilter = key || "all";
    if (!fromHistory) {
      WellWithHistory.open("catalog", { key: activeFilter, query: query || "" });
      return;
    }
    closeBusiness(true);
    closeSheet(true);
    var items = PRODUCTS.filter(function (p) {
      return productMatches(p, activeFilter) && (!query || (p.name + " " + p.description).toLowerCase().indexOf(query.toLowerCase()) !== -1);
    });
    qs("#catalog-title", catalog).textContent = query ? 'Search: “' + query + '”' : (catalogGroups.find(function (g) { return g[0] === activeFilter; }) || [0, "Products"])[1];
    qs("#catalog-grid", catalog).innerHTML = items.length ? items.map(listingCard).join("") : '<div class="catalog-empty"><h3>No products found</h3><p>Try a different search.</p></div>';
    qsa("[data-catalog-filter]", catalog).forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-catalog-filter") === activeFilter); });
    catalog.classList.add("active");
    requestAnimationFrame(function () { catalog.classList.add("open"); });
    document.body.classList.add("catalog-open");
    catalog.scrollTop = 0;
  }
  function closeCatalog(fromHistory) {
    if (!fromHistory) {
      WellWithHistory.close("catalog");
      return;
    }
    catalog.classList.remove("open");
    document.body.classList.remove("catalog-open");
    setTimeout(function () { if (!catalog.classList.contains("open")) catalog.classList.remove("active"); }, 430);
  }

  function renderBusiness(key) {
    var group = businessGroups.find(function (item) { return item.key === key; }) || businessGroups[0];
    var model = group.model;
    qsa("[data-business-filter]", business).forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-business-filter") === group.key);
    });
    qs("#business-results", business).innerHTML =
      '<article class="business-list-card"><p class="business-label">' + group.label + '</p><h3>' + model.name + '</h3><p class="business-tagline">' + model.tagline + '</p>' +
      '<ul>' + model.benefits.map(function (benefit) { return '<li>' + benefit + '</li>'; }).join("") + '</ul>' +
      '<div class="business-note"><strong>How it works</strong><p>' + model.message + '</p></div>' +
      '<a class="btn btn-gold" target="_blank" rel="noopener" href="' + waLink("Hello Palak Luthra, I want to know more about the " + model.name + " opportunity. Please share details.") + '">Enquire on WhatsApp</a></article>';
  }
  function openBusiness(key, fromHistory) {
    key = key || "partner";
    if (!fromHistory) {
      WellWithHistory.open("business", { key: key });
      return;
    }
    closeCatalog(true);
    closeSheet(true);
    renderBusiness(key);
    business.classList.add("active");
    requestAnimationFrame(function () { business.classList.add("open"); });
    document.body.classList.add("business-open");
  }
  function closeBusiness(fromHistory) {
    if (!fromHistory) {
      WellWithHistory.close("business");
      return;
    }
    business.classList.remove("open");
    document.body.classList.remove("business-open");
    setTimeout(function () { if (!business.classList.contains("open")) business.classList.remove("active"); }, 430);
  }

  function renderSheet() {
    var items = cartItems(), total = cartTotal();
    var root = qs("#cart-sheet-body", sheet);
    if (!items.length) {
      root.innerHTML = '<div class="sheet-empty"><div class="empty-basket">' + icon('M5 9h14l-1 11H6zM9 9c0-3 1-5 3-5s3 2 3 5') + '</div><h3>Your cart is empty</h3><p>Add your WellWith favourites to begin.</p></div>';
      return;
    }
    var orderLines = items.map(function (it, i) {
      return (i + 1) + ". " + it.product.name + ", Qty: " + it.qty;
    }).join("\n");
    var orderMessage = "Namaste Palak! I want to place this order:\n\n" + orderLines +
      "\n\nEstimated total: " + formatMoney(total) +
      "\n\nPlease confirm availability, delivery and payment details. Dhanyavaad!";
    root.innerHTML =
      '<div class="cart-savings">Your health is on the way <span aria-hidden="true">🌿</span></div>' +
      '<div class="cart-delivery-row"><span class="delivery-clock" aria-hidden="true">' + icon('M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z') + '</span><div><strong>Delivery timing</strong><p>Confirmed based on your delivery address</p></div></div>' +
      '<div class="cart-delivery-row"><span class="delivery-clock" aria-hidden="true">' + icon('M5 12l4 4L19 6') + '</span><div><strong>Delivery updates</strong><p>Shared directly with you on WhatsApp</p></div></div>' +
      '<div class="sheet-items">' + items.map(function (it) { return '<div class="sheet-item"><img src="' + it.product.image + '" alt="' + it.product.name + '"><div><h3>' + it.product.name + '</h3><p>1 pack</p><strong>' + formatMoney(it.product.price * it.qty) + '</strong></div><div class="qty-stepper"><button data-cart-dec="' + it.product.slug + '" aria-label="Decrease ' + it.product.name + '">−</button><span>' + it.qty + '</span><button data-cart-inc="' + it.product.slug + '" aria-label="Increase ' + it.product.name + '">+</button></div></div>'; }).join("") + '</div>' +
      '<button class="sheet-add-more" type="button">Forgot something? <strong>Add More Items</strong></button>' +
      '<div class="sheet-summary"><div><span>Item total</span><strong>' + formatMoney(total) + '</strong></div><a class="sheet-checkout" target="_blank" rel="noopener" href="' + waLink(orderMessage) + '"><span>Proceed with WhatsApp</span><strong>' + formatMoney(total) + ' →</strong></a></div>';
    var addMore = qs(".sheet-add-more", root);
    if (addMore) addMore.addEventListener("click", function () { openCatalog("all"); });
    var checkout = qs(".sheet-checkout", root);
    if (checkout) checkout.addEventListener("click", function (event) {
      event.preventDefault();
      playCheckoutGratitude(checkout.href);
    });
  }
  function openSheet(fromHistory) {
    if (!fromHistory) {
      WellWithHistory.open("cart", {});
      return;
    }
    closeCatalog(true);
    closeBusiness(true);
    renderSheet();
    sheet.classList.add("active");
    requestAnimationFrame(function () { sheet.classList.add("open"); });
    document.body.classList.add("sheet-open");
  }
  function closeSheet(fromHistory) {
    if (!fromHistory) {
      WellWithHistory.close("cart");
      return;
    }
    sheet.classList.remove("open");
    document.body.classList.remove("sheet-open");
    setTimeout(function () { if (!sheet.classList.contains("open")) sheet.classList.remove("active"); }, 430);
  }

  WellWithHistory.register("cart", function () { openSheet(true); }, closeSheet);
  WellWithHistory.register("catalog", function (data) { openCatalog(data.key || "all", data.query || "", true); }, closeCatalog);
  WellWithHistory.register("business", function (data) { openBusiness(data.key || "partner", true); }, closeBusiness);

  function syncQuickCart() {
    var count = cartCount(), total = cartTotal();
    pill.classList.toggle("visible", count > 0);
    pill.innerHTML = '<span class="pill-bag">' + icon('M5 8h14l-1 12H6zM9 8c0-3 1-5 3-5s3 2 3 5') + '<b>' + count + '</b></span><span><strong>Cart</strong><small>' + count + (count === 1 ? ' item' : ' items') + '</small></span><em>' + formatMoney(total) + ' ›</em>';
    renderSheet();
  }

  renderRails();
  syncQuickCart();
  var priorCartHandler = window.onCartChanged;
  window.onCartChanged = function () { if (typeof priorCartHandler === "function") priorCartHandler(); syncQuickCart(); };

  function setActiveTab(name) {
    qsa("[data-bottom-tab]", nav).forEach(function (tab) {
      tab.classList.toggle("active", tab.getAttribute("data-bottom-tab") === name);
    });
  }
  if (isHome) {
    qsa("[data-bottom-tab]", nav).forEach(function (tab) {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        var name = tab.getAttribute("data-bottom-tab");
        setActiveTab(name);
        if (name === "menu") {
          openSiteMenu();
          return;
        }
        if (name === "products") {
          openCatalog("all");
          return;
        }
        closeSiteMenu();
        if (WellWithHistory.currentView() !== "root") WellWithHistory.replace("root", {});
        var target = qs("#" + name);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        try {
          var url = new URL(window.location.href);
          url.hash = name;
          WellWithHistory.preserveStateReplace(url.pathname + url.search + url.hash);
        } catch (err) {}
      });
    });
  } else {
    var moreTab = qs('[data-bottom-tab="menu"]', nav);
    if (moreTab) moreTab.addEventListener("click", function () { setActiveTab("menu"); openSiteMenu(); });
  }

  pill.addEventListener("click", openSheet);
  qsa(".cart-link").forEach(function (link) {
    link.addEventListener("click", function (e) { e.preventDefault(); openSheet(); });
  });
  qs(".sheet-close", sheet).addEventListener("click", closeSheet);
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });
  qs(".catalog-back", catalog).addEventListener("click", closeCatalog);
  qsa("[data-catalog-filter]", catalog).forEach(function (btn) { btn.addEventListener("click", function () { openCatalog(btn.getAttribute("data-catalog-filter")); }); });
  qs(".business-back", business).addEventListener("click", closeBusiness);
  qsa("[data-business-filter]", business).forEach(function (btn) { btn.addEventListener("click", function () { renderBusiness(btn.getAttribute("data-business-filter")); }); });
  qsa("[data-open-business]").forEach(function (businessOpener) {
    businessOpener.addEventListener("click", function () {
      openBusiness(businessOpener.getAttribute("data-open-business"));
    });
  });
  qsa("[data-scroll-to]").forEach(function (scrollOpener) {
    scrollOpener.addEventListener("click", function () {
      var target = qs("#" + scrollOpener.getAttribute("data-scroll-to"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.addEventListener("click", function (e) {
    var opener = e.target.closest ? e.target.closest("[data-open-list]") : null;
    if (opener) { e.preventDefault(); openCatalog(opener.getAttribute("data-open-list")); }
    var wish = e.target.closest ? e.target.closest(".wish-btn,.catalog-heart") : null;
    if (wish) {
      var isSaved = wish.classList.toggle("saved");
      wish.textContent = isSaved ? "♥" : "♡";
      if (wish.classList.contains("wish-btn")) {
        var productName = wish.getAttribute("aria-label").replace(/^(Add|Remove) /, "").replace(/ to wishlist$/, "");
        wish.setAttribute("aria-label", isSaved ? "Remove " + productName + " from wishlist" : "Add " + productName + " to wishlist");
      } else {
        wish.setAttribute("aria-label", isSaved ? "Close wishlist" : "Wishlist");
      }
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeSheet(); closeCatalog(); closeBusiness(); closeSiteMenu(); } });

  var search = qs("#quick-search"), searchInput = qs("#quick-search-input");
  var searchSuggest = null, searchMatches = [], activeSuggestion = -1;
  var searchCategories = [
    { label: "Juices", key: "concentrate" },
    { label: "Capsules", key: "capsules" },
    { label: "Tea", key: "tea" },
    { label: "Skin Care", key: "skincare" },
    { label: "Face Care", key: "face" },
    { label: "Body Care", key: "body" },
    { label: "Daily Foods", key: "foods" },
    { label: "All Products", key: "all" }
  ];

  function escapeSearchText(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }
  function highlightSearchText(label, query) {
    var clean = String(label), lower = clean.toLowerCase(), needle = query.toLowerCase();
    var at = lower.indexOf(needle);
    if (at < 0) return escapeSearchText(clean);
    return escapeSearchText(clean.slice(0, at)) + "<mark>" + escapeSearchText(clean.slice(at, at + query.length)) + "</mark>" + escapeSearchText(clean.slice(at + query.length));
  }
  function suggestionScore(label, searchable, query) {
    var name = label.toLowerCase(), text = searchable.toLowerCase();
    if (name === query) return 0;
    if (name.indexOf(query) === 0) return 1;
    if (name.split(/\s+/).some(function (word) { return word.indexOf(query) === 0; })) return 2;
    if (name.indexOf(query) !== -1) return 3;
    if (text.indexOf(query) !== -1) return 4;
    return 99;
  }
  function closeSearchSuggestions() {
    if (!searchSuggest) return;
    searchSuggest.hidden = true;
    search.classList.remove("suggestions-open");
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    activeSuggestion = -1;
  }
  function activateSearchSuggestion(index) {
    if (!searchSuggest || !searchMatches.length) return;
    activeSuggestion = (index + searchMatches.length) % searchMatches.length;
    qsa("[data-suggestion-index]", searchSuggest).forEach(function (item, itemIndex) {
      item.classList.toggle("is-active", itemIndex === activeSuggestion);
      item.setAttribute("aria-selected", itemIndex === activeSuggestion ? "true" : "false");
    });
    searchInput.setAttribute("aria-activedescendant", "search-suggestion-" + activeSuggestion);
  }
  function chooseSearchSuggestion(index) {
    var match = searchMatches[index];
    if (!match) return;
    searchInput.value = match.label;
    closeSearchSuggestions();
    if (match.type === "category") openCatalog(match.key);
    else openCatalog("all", match.label);
  }
  function renderSearchSuggestions() {
    if (!searchSuggest) return;
    var query = searchInput.value.trim().toLowerCase();
    activeSuggestion = -1;
    if (!query) { closeSearchSuggestions(); return; }

    var products = PRODUCTS.map(function (product) {
      var searchable = [product.name, product.tagline, product.description, product.ingredients].join(" ");
      return { type: "product", label: product.name, product: product, score: suggestionScore(product.name, searchable, query) };
    }).filter(function (item) { return item.score < 99; });
    var categories = searchCategories.map(function (category) {
      return { type: "category", label: category.label, key: category.key, score: suggestionScore(category.label, category.label, query) };
    }).filter(function (item) { return item.score < 99; });

    searchMatches = products.concat(categories).sort(function (a, b) {
      if (a.score !== b.score) return a.score - b.score;
      if (a.type !== b.type) return a.type === "product" ? -1 : 1;
      return a.label.localeCompare(b.label);
    }).slice(0, 7);

    if (!searchMatches.length) {
      searchSuggest.innerHTML = '<div class="search-suggestion-empty">No matching products found</div>';
    } else {
      searchSuggest.innerHTML = searchMatches.map(function (item, index) {
        var thumb = item.type === "product"
          ? '<span class="search-suggestion-thumb"><img src="' + escapeSearchText(item.product.image) + '" alt=""></span>'
          : '<span class="search-suggestion-category" aria-hidden="true">⌕</span>';
        return '<button type="button" id="search-suggestion-' + index + '" class="search-suggestion-item" role="option" aria-selected="false" data-suggestion-index="' + index + '">' +
          thumb + '<span><strong>' + highlightSearchText(item.label, query) + '</strong><small>' + (item.type === "product" ? "Product" : "Category") + '</small></span><b aria-hidden="true">›</b></button>';
      }).join("");
    }
    searchSuggest.hidden = false;
    search.classList.add("suggestions-open");
    searchInput.setAttribute("aria-expanded", "true");
  }

  if (search) {
    searchSuggest = document.createElement("div");
    searchSuggest.id = "search-suggestions";
    searchSuggest.className = "search-suggestions";
    searchSuggest.setAttribute("role", "listbox");
    searchSuggest.setAttribute("aria-label", "Search suggestions");
    searchSuggest.hidden = true;
    search.appendChild(searchSuggest);
    searchInput.setAttribute("autocomplete", "off");
    searchInput.setAttribute("aria-autocomplete", "list");
    searchInput.setAttribute("aria-controls", "search-suggestions");
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.addEventListener("input", renderSearchSuggestions);
    searchInput.addEventListener("focus", function () { if (searchInput.value.trim()) renderSearchSuggestions(); });
    searchInput.addEventListener("keydown", function (e) {
      if (searchSuggest.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); activateSearchSuggestion(activeSuggestion + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); activateSearchSuggestion(activeSuggestion - 1); }
      else if (e.key === "Enter" && activeSuggestion >= 0) { e.preventDefault(); chooseSearchSuggestion(activeSuggestion); }
      else if (e.key === "Escape") { closeSearchSuggestions(); }
    });
    searchSuggest.addEventListener("pointerdown", function (e) { e.preventDefault(); });
    searchSuggest.addEventListener("click", function (e) {
      var item = e.target.closest ? e.target.closest("[data-suggestion-index]") : null;
      if (item) chooseSearchSuggestion(parseInt(item.getAttribute("data-suggestion-index"), 10));
    });
    document.addEventListener("pointerdown", function (e) { if (!search.contains(e.target)) closeSearchSuggestions(); });
    search.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = searchInput.value.trim();
      if (q) { closeSearchSuggestions(); openCatalog("all", q); }
    });
  }
  qs(".catalog-search-btn", catalog).addEventListener("click", function () { closeCatalog(); if (isHome && searchInput) { searchInput.focus(); searchInput.scrollIntoView({ behavior: "smooth", block: "center" }); } else { openCatalog("all"); } });

  var promoCarousel = qs("#promo-carousel"), promoViewport = qs("#promo-viewport");
  if (promoCarousel && promoViewport) {
    var promoSlides = qsa("[data-promo-slide]", promoCarousel);
    var promoDots = qsa("[data-promo]", promoCarousel);
    var promoPrev = qs("[data-promo-prev]", promoCarousel);
    var promoNext = qs("[data-promo-next]", promoCarousel);
    var promoIndex = 0;
    var promoScrollFrame = 0;
    var dragStartX = 0;
    var dragStartScroll = 0;
    var dragMoved = false;

    function updatePromoState(index) {
      promoIndex = Math.max(0, Math.min(promoSlides.length - 1, index));
      promoDots.forEach(function (dot, dotIndex) {
        var active = dotIndex === promoIndex;
        dot.classList.toggle("active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }
    function showPromo(index, smooth) {
      var next = (index + promoSlides.length) % promoSlides.length;
      updatePromoState(next);
      promoViewport.scrollTo({ left: next * promoViewport.clientWidth, behavior: smooth === false ? "auto" : "smooth" });
    }

    promoDots.forEach(function (dot, index) {
      dot.addEventListener("click", function () { showPromo(index); });
    });
    if (promoPrev) promoPrev.addEventListener("click", function () { showPromo(promoIndex - 1); });
    if (promoNext) promoNext.addEventListener("click", function () { showPromo(promoIndex + 1); });

    promoViewport.addEventListener("scroll", function () {
      if (promoScrollFrame) cancelAnimationFrame(promoScrollFrame);
      promoScrollFrame = requestAnimationFrame(function () {
        var width = promoViewport.clientWidth || 1;
        updatePromoState(Math.round(promoViewport.scrollLeft / width));
      });
    }, { passive: true });

    promoViewport.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { event.preventDefault(); showPromo(promoIndex - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); showPromo(promoIndex + 1); }
    });

    promoViewport.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragStartX = event.clientX;
      dragStartScroll = promoViewport.scrollLeft;
      dragMoved = false;
      promoViewport.classList.add("is-dragging");
      promoViewport.setPointerCapture(event.pointerId);
    });
    promoViewport.addEventListener("pointermove", function (event) {
      if (!promoViewport.classList.contains("is-dragging")) return;
      var distance = event.clientX - dragStartX;
      if (Math.abs(distance) > 5) dragMoved = true;
      promoViewport.scrollLeft = dragStartScroll - distance;
      if (dragMoved) event.preventDefault();
    });
    function finishPromoDrag(event) {
      if (!promoViewport.classList.contains("is-dragging")) return;
      promoViewport.classList.remove("is-dragging");
      if (promoViewport.hasPointerCapture(event.pointerId)) promoViewport.releasePointerCapture(event.pointerId);
      showPromo(Math.round(promoViewport.scrollLeft / (promoViewport.clientWidth || 1)));
    }
    promoViewport.addEventListener("pointerup", finishPromoDrag);
    promoViewport.addEventListener("pointercancel", finishPromoDrag);
    promoViewport.addEventListener("click", function (event) {
      if (!dragMoved) return;
      event.preventDefault();
      event.stopPropagation();
      dragMoved = false;
    }, true);
    window.addEventListener("resize", function () { showPromo(promoIndex, false); });
    updatePromoState(0);
  }
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", function () {
  WellWithHistory.init();
  initNavbar();
  initCart();
  initFactStrip();
  initBerryExplorer();
  initModalBackdrops();
  initListen();
  initPartner();
  initProductGrids();
  initReviewVideos();
  initCoachExperience();
  initQuickCommerce();
  initVisualPolish();
  initReveal();
});
