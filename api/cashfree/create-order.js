/* WellWith — Cashfree order creation (Vercel serverless function).
 *
 * SECURITY:
 * - Cashfree secrets are read ONLY from process.env
 *   (CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET, CASHFREE_ENV).
 * - NEVER commit keys. NEVER expose them to the browser.
 * - The payable amount is RECOMPUTED here from api/cashfree/prices.json.
 *   The browser only sends slugs + quantities; any client-side total is ignored.
 */

var PRICES = require("./prices.json");
var COUPONS = require("./coupons.json");

var COD_ADVANCE = 100; // Rs 100 advance for Cash-on-Delivery orders

function cashfreeBase() {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function send(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

function siteBase() {
  if (process.env.SITE_URL) return String(process.env.SITE_URL).replace(/\/+$/, "");
  if (process.env.VERCEL_URL) return "https://" + process.env.VERCEL_URL;
  return "";
}

function round2(n) { return Math.round(n * 100) / 100; }

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return send(res, 405, { error: "METHOD_NOT_ALLOWED", message: "Use POST." });
  }

  var clientId = process.env.CASHFREE_CLIENT_ID;
  var clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return send(res, 503, {
      error: "PAYMENT_NOT_CONFIGURED",
      message: "Online payment is being configured. Please order on WhatsApp for now."
    });
  }

  var body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  var cartLines = Array.isArray(body.cartLines) ? body.cartLines : [];
  var customer = body.customer || {};
  var address = body.address || {};
  var paymentMethod = body.paymentMethod;
  var couponCode = String(body.coupon || "").trim().toUpperCase();

  /* ---------- cart → server-side pricing ---------- */
  if (!cartLines.length) {
    return send(res, 400, { error: "EMPTY_CART", message: "Your cart is empty." });
  }
  var lines = [];
  var subtotal = 0;
  for (var i = 0; i < cartLines.length; i++) {
    var cl = cartLines[i] || {};
    var slug = String(cl.slug || "").trim();
    var qty = parseInt(cl.qty, 10);
    if (!slug || !(qty > 0) || qty > 99) {
      return send(res, 400, { error: "INVALID_CART", message: "Invalid cart item." });
    }
    var price = PRICES[slug];
    if (typeof price !== "number" || !(price > 0)) {
      return send(res, 503, {
        error: "PRICES_NOT_CONFIGURED",
        message: "Online payment is being configured. Please order on WhatsApp for now."
      });
    }
    var lineTotal = round2(price * qty);
    lines.push({ slug: slug, qty: qty, price: price, lineTotal: lineTotal });
    subtotal = round2(subtotal + lineTotal);
  }

  /* ---------- customer ---------- */
  var name = String(customer.name || "").trim();
  var phone = String(customer.phone || "").replace(/\D/g, "");
  if (name.length < 2) {
    return send(res, 400, { error: "INVALID_NAME", message: "Please enter your full name." });
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return send(res, 400, { error: "INVALID_PHONE", message: "Please enter a valid 10-digit mobile number." });
  }

  /* ---------- address ---------- */
  var addrLine = String(address.line || "").trim();
  var addrCity = String(address.city || "").trim();
  var addrState = String(address.state || "").trim();
  var addrPin = String(address.pin || "").replace(/\D/g, "");
  if (addrLine.length < 8) {
    return send(res, 400, { error: "INVALID_ADDRESS", message: "Please enter your full delivery address." });
  }
  if (addrCity.length < 2) {
    return send(res, 400, { error: "INVALID_CITY", message: "Please enter your city." });
  }
  if (addrState.length < 2) {
    return send(res, 400, { error: "INVALID_STATE", message: "Please enter your state." });
  }
  if (!/^\d{6}$/.test(addrPin)) {
    return send(res, 400, { error: "INVALID_PIN", message: "Please enter a valid 6-digit PIN code." });
  }

  /* ---------- payment method ---------- */
  if (paymentMethod !== "PREPAID" && paymentMethod !== "COD") {
    return send(res, 400, { error: "INVALID_PAYMENT_METHOD", message: "Please choose Prepaid or COD." });
  }

  /* ---------- coupon (server-validated) ---------- */
  var discount = 0;
  var appliedCoupon = null;
  if (couponCode) {
    var c = COUPONS[couponCode];
    if (!c || typeof c.value !== "number" || !(c.value > 0) ||
        (c.type !== "percent" && c.type !== "flat")) {
      return send(res, 400, { error: "INVALID_COUPON", message: "This coupon code is not valid." });
    }
    if (c.min_order && subtotal < c.min_order) {
      return send(res, 400, {
        error: "COUPON_MIN_ORDER",
        message: "This coupon needs a minimum order of \u20B9" + c.min_order + "."
      });
    }
    discount = c.type === "percent" ? subtotal * (c.value / 100) : c.value;
    if (c.max_discount && discount > c.max_discount) discount = c.max_discount;
    discount = Math.min(round2(discount), subtotal);
    appliedCoupon = couponCode;
  }

  var total = round2(subtotal - discount);
  if (!(total >= 1)) {
    return send(res, 400, { error: "INVALID_TOTAL", message: "Order total is too low for online payment." });
  }

  /* ---------- split: prepaid vs COD advance ---------- */
  var payNow;
  var payOnDelivery = 0;
  var orderTags = {};
  if (paymentMethod === "COD") {
    if (total < COD_ADVANCE) {
      return send(res, 400, {
        error: "COD_MIN_TOTAL",
        message: "COD needs an order of at least \u20B9" + COD_ADVANCE + "."
      });
    }
    payNow = COD_ADVANCE;
    payOnDelivery = round2(total - COD_ADVANCE);
    orderTags.payment_method = "COD_ADVANCE";
    orderTags.cod_remaining = String(payOnDelivery);
  } else {
    payNow = total;
    orderTags.payment_method = "PREPAID";
  }

  /* ---------- create Cashfree order ---------- */
  var env = process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
  var d = new Date();
  var ymd = d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  var orderId = "WW-" + ymd + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  var base = siteBase();
  var cfOrder = {
    order_id: orderId,
    order_amount: payNow,
    order_currency: "INR",
    customer_details: {
      customer_id: "WWCUST-" + phone,
      customer_name: name,
      customer_phone: "91" + phone
    },
    order_meta: {},
    order_tags: orderTags
  };
  if (base) {
    cfOrder.order_meta.return_url =
      base + "/order-confirmation.html?order_id=" + encodeURIComponent(orderId);
  }

  var cfRes;
  try {
    cfRes = await fetch(cashfreeBase() + "/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": "2025-01-01"
      },
      body: JSON.stringify(cfOrder)
    });
  } catch (e) {
    return send(res, 502, {
      error: "GATEWAY_ERROR",
      message: "Could not reach the payment gateway. Please try again."
    });
  }

  var cfData = null;
  try { cfData = await cfRes.json(); } catch (e) { /* ignore */ }

  if (!cfRes.ok || !cfData || !cfData.payment_session_id) {
    return send(res, 502, {
      error: "ORDER_CREATE_FAILED",
      message: (cfData && cfData.message) || "Could not start the payment. Please try again."
    });
  }

  return send(res, 200, {
    payment_session_id: cfData.payment_session_id,
    order_id: orderId,
    cf_order_id: cfData.cf_order_id,
    env: env,
    breakdown: {
      lines: lines,
      subtotal: subtotal,
      discount: discount,
      coupon: appliedCoupon,
      total: total,
      payNow: payNow,
      payOnDelivery: payOnDelivery,
      paymentMethod: paymentMethod
    }
  });
};
