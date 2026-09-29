/* WellWith — admin WhatsApp-leads API.
 *
 * POST /api/admin/leads   body: { "password": "..." }
 *
 * Returns recent WhatsApp checkout leads (newest first). Same password +
 * brute-force protection as the orders API.
 */

var store = require("../cashfree/order-store.js");
var auth = require("./_auth.js");

module.exports = async function (req, res) {
  var check = await auth.checkAdmin(req, res);
  if (!check.ok) return;

  try {
    var leads = await store.listLeads(100);
    return auth.send(res, 200, { leads: leads, count: leads.length });
  } catch (e) {
    if (e && e.code === "STORE_NOT_CONFIGURED") {
      return auth.send(res, 503, {
        error: "STORE_NOT_CONFIGURED",
        message: "Order storage is not connected yet. Add the Upstash Redis integration in Vercel."
      });
    }
    return auth.send(res, 502, {
      error: "STORE_ERROR",
      message: "Could not load leads. Please try again."
    });
  }
};
