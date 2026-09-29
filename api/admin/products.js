/* WellWith — admin product-manager API.
 *
 * POST /api/admin/products   body: { "password": "...", "patch": { "<slug>": {...}|null } }
 *
 * Saves admin product overrides (add/edit products, SKU, price, price drop,
 * active/inactive). Same password + brute-force protection as the other
 * admin APIs. A patch value of null removes that product's override.
 * New products pass "_new": true and require name + price.
 */

var store = require("../cashfree/order-store.js");
var auth = require("./_auth.js");

module.exports = async function (req, res) {
  var check = await auth.checkAdmin(req, res);
  if (!check.ok) return;

  try {
    var overrides = await store.setProductOverrides(check.body.patch);
    return auth.send(res, 200, { ok: true, overrides: overrides });
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
      message: "Could not save products. Please try again."
    });
  }
};
