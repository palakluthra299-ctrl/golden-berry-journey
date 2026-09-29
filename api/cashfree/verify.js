/* WellWith — Cashfree order verification (Vercel serverless function).
 *
 * GET /api/cashfree/verify?order_id=WW-YYYYMMDD-XXXXXX
 * Re-fetches the order from Cashfree and returns its authoritative status.
 * The confirmation page shows success ONLY when order_status === "PAID".
 * Secrets are read ONLY from process.env — never committed, never in the browser.
 */

function cashfreeBase() {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function send(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

module.exports = async function (req, res) {
  if (req.method !== "GET") {
    return send(res, 405, { error: "METHOD_NOT_ALLOWED", message: "Use GET." });
  }

  var orderId = String((req.query && req.query.order_id) || "").trim();
  if (!orderId) {
    return send(res, 400, { error: "MISSING_ORDER_ID", message: "order_id is required." });
  }

  var clientId = process.env.CASHFREE_CLIENT_ID;
  var clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return send(res, 503, {
      error: "PAYMENT_NOT_CONFIGURED",
      message: "Online payment is being configured."
    });
  }

  var cfRes;
  try {
    cfRes = await fetch(cashfreeBase() + "/orders/" + encodeURIComponent(orderId), {
      method: "GET",
      headers: {
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": "2025-01-01"
      }
    });
  } catch (e) {
    return send(res, 502, { error: "GATEWAY_ERROR", message: "Could not reach the payment gateway." });
  }

  var data = null;
  try { data = await cfRes.json(); } catch (e) { /* ignore */ }

  if (!cfRes.ok || !data || !data.order_id) {
    return send(res, 502, {
      error: "VERIFY_FAILED",
      message: (data && data.message) || "Could not verify this order."
    });
  }

  /* ---------- update stored snapshot for the admin page (best-effort) ----------
     Capped at ~2.5s so verification never hangs because storage is down. */
  try {
    var store = require("./order-store.js");
    var extra = {};
    if (data.order_status === "PAID") extra.paidAt = new Date().toISOString();
    await Promise.race([
      store.updateOrderStatus(orderId, data.order_status, extra),
      new Promise(function (resolve) { setTimeout(resolve, 2500); })
    ]);
  } catch (e) { /* storage is optional */ }

  var payments = Array.isArray(data.payments) ? data.payments : [];
  return send(res, 200, {
    order_id: data.order_id,
    cf_order_id: data.cf_order_id,
    order_status: data.order_status, // "PAID" means money reached Cashfree
    order_amount: data.order_amount,
    order_currency: data.order_currency,
    order_tags: data.order_tags || {},
    payments: payments.map(function (p) {
      return {
        cf_payment_id: p.cf_payment_id,
        payment_status: p.payment_status,
        payment_amount: p.payment_amount,
        payment_time: p.payment_time,
        payment_method: p.payment_method
      };
    })
  });
};
