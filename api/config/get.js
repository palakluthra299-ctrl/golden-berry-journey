/* WellWith — public site-config API.
 *
 * GET /api/config/get
 *
 * Returns the admin-controllable site settings (feature flags + banner text).
 * Contains no secrets and no customer data, so no auth is needed.
 * Always returns a full config (defaults when Redis is not connected).
 */

var store = require("../cashfree/order-store.js");

module.exports = async function (req, res) {
  if (req.method !== "GET") {
    res.status(405).setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "METHOD_NOT_ALLOWED", message: "Use GET." }));
    return;
  }
  try {
    var config = await store.getConfig();
    res.status(200).setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(config));
  } catch (e) {
    /* never fail the site over config: fall back to defaults */
    res.status(200).setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(store.DEFAULT_CONFIG));
  }
};
