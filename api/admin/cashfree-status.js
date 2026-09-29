/* WellWith — Cashfree environment status (admin only).
 *
 * Returns whether the server is talking to Cashfree PRODUCTION or SANDBOX,
 * and whether the client ID/secret are configured — WITHOUT exposing the
 * key values themselves. Used by the admin panel so Palak can confirm
 * "real payment ready" before flipping the Cashfree toggle ON.
 */
var auth = require("./_auth.js");

module.exports = async function (req, res) {
  var check = await auth.checkAdmin(req, res);
  if (!check.ok) return;
  var env = process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
  var keysConfigured = !!(process.env.CASHFREE_CLIENT_ID && process.env.CASHFREE_CLIENT_SECRET);
  return auth.send(res, 200, { ok: true, env: env, keysConfigured: keysConfigured });
};
