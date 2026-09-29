/* WellWith — public product-overrides API.
 *
 * GET /api/products/get
 *
 * Returns the admin's product overrides (price changes, price drops, SKU,
 * active/inactive flags, admin-added products) as JSON. No secrets, no
 * customer data, so no auth is needed. The storefront merges these over the
 * baked-in catalog in assets/js/data.js. Returns {} when Redis is missing.
 */

var store = require("../cashfree/order-store.js");

module.exports = async function (req, res) {
  if (req.method !== "GET") {
    res.status(405).setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "METHOD_NOT_ALLOWED", message: "Use GET." }));
    return;
  }
  try {
    var overrides = await store.getProductOverrides();
    res.status(200).setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify({ ok: true, overrides: overrides }));
  } catch (e) {
    res.status(200).setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify({ ok: true, overrides: {} }));
  }
};
