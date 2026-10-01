/* WellWith — GA4 e-commerce events (view_item, add_to_cart, begin_checkout, purchase).
   Load AFTER app.js on every shop page. Safe no-ops when gtag is blocked. */
(function () {
  "use strict";

  function gaEvent(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params || {});
    } catch (e) {}
  }

  function num(n) {
    var v = parseFloat(n);
    return isNaN(v) ? 0 : v;
  }

  /* Build a GA4 item object from a WellWith product entry. */
  function gaItem(product, qty) {
    return {
      item_id: product.slug || "",
      item_name: product.name || "",
      item_category: product.category || "",
      price: num(product.price),
      quantity: qty || 1
    };
  }

  function cartTotal(items) {
    return items.reduce(function (sum, it) { return sum + num(it.product.price) * it.qty; }, 0);
  }

  /* --- add_to_cart: wrap the global addToCart() (works whichever app.js copy loaded) --- */
  function hookAddToCart() {
    if (typeof window.addToCart !== "function" || window.__wwGaAddToCartHooked) return;
    window.__wwGaAddToCartHooked = true;
    var orig = window.addToCart;
    window.addToCart = function (slug, qty) {
      var before = (typeof cartCount === "function") ? cartCount() : 0;
      orig(slug, qty);
      try {
        var p = (typeof PRODUCTS !== "undefined")
          ? PRODUCTS.find(function (x) { return x.slug === slug; }) : null;
        if (p && p.active !== false) {
          var q = qty || 1;
          gaEvent("add_to_cart", {
            currency: "INR",
            value: num(p.price) * q,
            items: [gaItem(p, q)]
          });
        }
      } catch (e) {}
      return before;
    };
  }

  /* --- view_item: call with the product object from product.html --- */
  function trackViewItem(p) {
    if (!p) return;
    gaEvent("view_item", {
      currency: "INR",
      value: num(p.price),
      items: [gaItem(p, 1)]
    });
  }

  /* --- begin_checkout: call with cartItems() array from checkout.html --- */
  function trackBeginCheckout(items) {
    if (!items || !items.length) return;
    gaEvent("begin_checkout", {
      currency: "INR",
      value: cartTotal(items),
      items: items.map(function (it) { return gaItem(it.product, it.qty); })
    });
  }

  /* --- purchase: call once with {orderId, amount, lines:[{name,qty,price}]} --- */
  function trackPurchase(order) {
    if (!order || !order.orderId) return;
    var flag = "ww_ga_purchase_" + order.orderId;
    try {
      if (sessionStorage.getItem(flag)) return; /* never double-count */
      sessionStorage.setItem(flag, "1");
    } catch (e) {}
    gaEvent("purchase", {
      transaction_id: order.orderId,
      currency: "INR",
      value: num(order.amount),
      items: (order.lines || []).map(function (l) {
        return {
          item_name: l.name || "",
          price: num(l.price),
          quantity: l.qty || 1
        };
      })
    });
  }

  hookAddToCart();
  window.wwGa = {
    event: gaEvent,
    viewItem: trackViewItem,
    beginCheckout: trackBeginCheckout,
    purchase: trackPurchase
  };
})();
