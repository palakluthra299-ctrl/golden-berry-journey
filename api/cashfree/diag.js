/**
 * Runtime config diagnostic — exposes ONLY whether the Cashfree env vars are
 * present (never their values). Used to debug "Online payment is being
 * configured" without leaking secrets.
 */
module.exports = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).end(JSON.stringify({
    ok: true,
    hasClientId: !!process.env.CASHFREE_CLIENT_ID,
    hasClientSecret: !!process.env.CASHFREE_CLIENT_SECRET,
    cashfreeEnv: process.env.CASHFREE_ENV || null,
    vercelEnv: process.env.VERCEL_ENV || null
  }));
};
