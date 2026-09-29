/* WellWith — shared admin auth helper.
 *
 * checkAdmin(req, res) -> { ok: true, ip } when the password in the JSON body
 * matches ADMIN_PASSWORD (timing-safe, with brute-force guard).
 * Otherwise it sends the error response itself and returns { ok: false }.
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

function clientIp(req) {
  var ip = "";
  try {
    ip = String((req.headers && req.headers["x-forwarded-for"]) || "")
      .split(",")[0].trim();
  } catch (e) { ip = ""; }
  if (!ip && req.socket && req.socket.remoteAddress) ip = String(req.socket.remoteAddress);
  return ip || "unknown";
}

function readBody(req) {
  var body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  return body;
}

async function checkAdmin(req, res) {
  if (req.method !== "POST") {
    send(res, 405, { error: "METHOD_NOT_ALLOWED", message: "Use POST." });
    return { ok: false };
  }
  var expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    send(res, 503, {
      error: "ADMIN_NOT_CONFIGURED",
      message: "Admin password is not configured yet. Add ADMIN_PASSWORD in Vercel env vars."
    });
    return { ok: false };
  }
  var ip = clientIp(req);
  if (await store.loginBlocked(ip)) {
    send(res, 429, {
      error: "TOO_MANY_ATTEMPTS",
      message: "Too many wrong attempts. Try again in 15 minutes."
    });
    return { ok: false };
  }
  var body = readBody(req);
  if (!safeEqual(body.password, expected)) {
    await store.recordFailedLogin(ip);
    send(res, 401, { error: "WRONG_PASSWORD", message: "Incorrect password." });
    return { ok: false };
  }
  await store.clearFailedLogins(ip);
  return { ok: true, ip: ip, body: body };
}

module.exports = { checkAdmin: checkAdmin, send: send, readBody: readBody };
