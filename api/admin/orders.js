/* WellWith — admin orders API.
 *
 * POST /api/admin/orders   body: { "password": "..." }
 *
 * Returns the latest order snapshots (newest first) for the admin page.
 * The password is checked against the ADMIN_PASSWORD env var with a
 * timing-safe comparison. Nothing about orders is exposed without it.
 */

var store = require("../cashfree/order-store.js");
var auth = require("./_auth.js");

module.exports = async function (req, res) {
  var check = await auth.checkAdmin(req, res);
  if (!check.ok) return;

  try {
    var orders = await store.listOrders(100);
    return auth.send(res, 200, { orders: orders, count: orders.length });
  } catch (e) {
    if (e && e.code === "STORE_NOT_CONFIGURED") {
      return auth.send(res, 503, {
        error: "STORE_NOT_CONFIGURED",
        message: "Order storage is not connected yet. Add the Upstash Redis integration in Vercel."
      });
    }
    return auth.send(res, 502, {
      error: "STORE_ERROR",
      message: "Could not load orders. Please try again."
    });
  }
};
