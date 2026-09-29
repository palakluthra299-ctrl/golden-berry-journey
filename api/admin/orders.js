/* WellWith — admin orders API.
 *
 * POST /api/admin/orders   body: { "password": "..." }
 *
 * Returns the latest order snapshots (newest first) for the admin page.
 * The password is checked against the ADMIN_PASSWORD env var with a
 * timing-safe comparison. Nothing about orders is exposed without it.
 */

var crypto = require("crypto");
var store = require("../cashfree/order-store.js");

function send(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

function safeEqual(a, b) {
  var ab = Buffer.from(String(a == null ? "" : a), "utf8");
  var bb = Buffer.from(String(b == null ? "" : b), "utf8");
  if (ab.length !== bb.length) return false;
  try {
    return crypto.timingSafeEqual(ab, bb);
  } catch (e) {
    return false;
  }
}

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return send(res, 405, { error: "METHOD_NOT_ALLOWED", message: "Use POST." });
  }

  var expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return send(res, 503, {
      error: "ADMIN_NOT_CONFIGURED",
      message: "Admin password is not configured yet. Add ADMIN_PASSWORD in Vercel env vars."
    });
  }

  var body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  /* brute-force guard: 5 wrong tries from one IP -> 15 min lock */
  var ip = "";
  try {
    ip = String((req.headers && req.headers["x-forwarded-for"]) || "")
      .split(",")[0].trim();
  } catch (e) { ip = ""; }
  if (!ip && req.socket && req.socket.remoteAddress) ip = String(req.socket.remoteAddress);
  if (await store.loginBlocked(ip || "unknown")) {
    return send(res, 429, {
      error: "TOO_MANY_ATTEMPTS",
      message: "Too many wrong attempts. Try again in 15 minutes."
    });
  }

  if (!safeEqual(body.password, expected)) {
    await store.recordFailedLogin(ip);
    return send(res, 401, { error: "WRONG_PASSWORD", message: "Incorrect password." });
  }
  await store.clearFailedLogins(ip);

  try {
    var orders = await store.listOrders(100);
    return send(res, 200, { orders: orders, count: orders.length });
  } catch (e) {
    if (e && e.code === "STORE_NOT_CONFIGURED") {
      return send(res, 503, {
        error: "STORE_NOT_CONFIGURED",
        message: "Order storage is not connected yet. Add the Upstash Redis integration in Vercel."
      });
    }
    return send(res, 502, {
      error: "STORE_ERROR",
      message: "Could not load orders. Please try again."
    });
  }
};
