/* WellWith — WhatsApp lead capture API.
 *
 * POST /api/lead/log   body: { "channel": "WHATSAPP", "cart": "slug×qty, ...",
 *                              "itemCount": 2, "total": 1298 }
 *
 * Logged when a shopper taps a WhatsApp checkout option. Public endpoint
 * (the site itself calls it), with light per-IP throttling against spam.
 * Never fails the shopper's WhatsApp flow — errors are silent by design.
 */

var store = require("../cashfree/order-store.js");

function send(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return send(res, 405, { error: "METHOD_NOT_ALLOWED", message: "Use POST." });
  }
  var body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  var ip = "";
  try {
    ip = String((req.headers && req.headers["x-forwarded-for"]) || "")
      .split(",")[0].trim();
  } catch (e) { ip = ""; }
  if (!ip && req.socket && req.socket.remoteAddress) ip = String(req.socket.remoteAddress);

  try {
    if (await store.leadThrottled(ip || "unknown")) {
      return send(res, 429, { error: "TOO_FAST", message: "Please wait a moment." });
    }
    var lead = await store.logLead(body);
    return send(res, 200, { ok: true, id: lead.id });
  } catch (e) {
    if (e && e.code === "BAD_LEAD") {
      return send(res, 400, { error: "BAD_LEAD", message: e.message });
    }
    /* storage hiccups must never break the WhatsApp flow */
    return send(res, 200, { ok: false });
  }
};
