/* WellWith — admin product overrides (client side).
 *
 * Loads AFTER assets/js/data.js and BEFORE assets/js/app.js.
 * Fetches /api/products/get and merges the admin's overrides into the global
 * PRODUCTS array:
 *   - price        → new selling price (MRP)
 *   - price_drop   → sale price; site shows old price struck-through and the
 *                    new price with the animated glow (p.onDrop = true)
 *   - active:false → product hidden from listings/rails/search/cart
 *   - _new:true    → admin-added product, appended to the catalog
 *   - sku/name/image/category/tagline/description → applied when present
 *
 * Exposes window.__overridesReady (a promise). app.js awaits it before
 * rendering anything product-related, so there is no flash of base prices.
 * A 2.5s timeout guarantees the site never hangs if the API is unreachable.
 */

(function () {
  "use strict";

  function fmt(n) {
    return "\u20B9" + Number(n || 0).toLocaleString("en-IN");
  }

  /* Drop-aware price HTML used by rails, catalog cards and product page. */
  window.productPriceHTML = function (p) {
    if (p && p.onDrop) {
      return '<span class="ww-price"><del class="ww-price-strike">' + fmt(p.mrp) + '</del>' +
        '<span class="ww-price-drop">' + fmt(p.price) + '</span>' +
        '<span class="ww-drop-badge">PRICE DROP</span></span>';
    }
    return '<span class="ww-price">' + fmt(p ? p.price : 0) + '</span>';
  };
  window.isProductActive = function (p) {
    return !p || p.active !== false;
  };

  function applyOverrides(overrides) {
    if (typeof PRODUCTS === "undefined" || !overrides) return;
    var bySlug = {};
    PRODUCTS.forEach(function (p) {
      bySlug[p.slug] = p;
      if (p.active === undefined) p.active = true; /* default: visible */
    });

    Object.keys(overrides).forEach(function (slug) {
      var o = overrides[slug] || {};
      var p = bySlug[slug];

      if (!p) {
        /* Admin-added product: needs name + price (server enforces this too). */
        if (!o._new || !o.name || !(o.price > 0)) return;
        var np = {
          slug: slug,
          name: o.name,
          tagline: o.tagline || "",
          description: o.description || "",
          ingredients: "",
          image: o.image || "assets/products/pulp.jpg",
          category: o.category || "addon",
          color: "#dd8f2b",
          price: o.price,
          mrp: o.price,
          active: o.active !== false,
          sku: o.sku || "",
          onDrop: false,
          _admin: true
        };
        if (o.price_drop > 0 && o.price_drop < np.price) {
          np.mrp = np.price;
          np.price = o.price_drop;
          np.onDrop = true;
        }
        PRODUCTS.push(np);
        bySlug[slug] = np;
        return;
      }

      if (o.name) p.name = o.name;
      if (typeof o.sku === "string") p.sku = o.sku;
      if (o.image) p.image = o.image;
      if (o.category) p.category = o.category;
      if (o.tagline) p.tagline = o.tagline;
      if (typeof o.description === "string" && o.description) p.description = o.description;

      var base = (typeof o.price === "number" && o.price > 0) ? o.price : p.price;
      p.mrp = base;
      p.onDrop = false;
      if (typeof o.price_drop === "number" && o.price_drop > 0 && o.price_drop < base) {
        p.price = o.price_drop;
        p.onDrop = true;
      } else {
        p.price = base;
      }
      p.active = o.active !== false;
    });
  }

  function fetchOverrides() {
    var ctl = null;
    try {
      if (typeof AbortController !== "undefined") {
        ctl = new AbortController();
        setTimeout(function () { try { ctl.abort(); } catch (e) {} }, 2500);
      }
    } catch (e) { ctl = null; }
    return fetch("/api/products/get", {
      cache: "no-store",
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error("bad status");
      return r.json();
    }).then(function (d) {
      return (d && d.overrides) || {};
    });
  }

  window.__overridesReady = Promise.resolve()
    .then(fetchOverrides)
    .then(applyOverrides)
    .catch(function () { /* site works on baked-in catalog */ });
})();
