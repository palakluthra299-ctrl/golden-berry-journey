/* WellWith — admin site-config API.
 *
 * POST /api/admin/config   body: { "password": "...", "patch": {...} }
 *
 * Saves admin-controllable site settings (feature flags + banner text).
 * Same password + brute-force protection as the orders API.
 */

var store = require("../cashfree/order-store.js");
var auth = require("./_auth.js");

module.exports = async function (req, res) {
  var check = await auth.checkAdmin(req, res);
  if (!check.ok) return;

  try {
    var config = await store.setConfig(check.body.patch);
    return auth.send(res, 200, { ok: true, config: config });
  } catch (e) {
    if (e && e.code === "STORE_NOT_CONFIGURED") {
      return auth.send(res, 503, {
        error: "STORE_NOT_CONFIGURED",
        message: "Order storage is not connected yet. Add the Upstash Redis integration in Vercel."
      });
    }
    if (e && e.code === "BAD_PATCH") {
      return auth.send(res, 400, { error: "BAD_PATCH", message: e.message });
    }
    return auth.send(res, 502, {
      error: "STORE_ERROR",
      message: "Could not save settings. Please try again."
    });
  }
};
