/* WellWith — order snapshot store (Upstash Redis, added via Vercel Marketplace).
 *
 * Every Cashfree checkout saves a full order snapshot here so the admin page
 * (/admin.html) can list orders. Cashfree's PG API has no "list all orders"
 * endpoint, so without this store the admin page would have nothing to show.
 *
 * All ops are best-effort: if the Upstash env vars are missing, save/update
 * become silent no-ops (checkout must NEVER fail because storage is down).
 * listOrders() throws STORE_NOT_CONFIGURED so the admin API can answer honestly.
 */

var Redis = null;
try {
  Redis = require("@upstash/redis").Redis;
} catch (e) {
  Redis = null;
}

function client() {
  if (!Redis) return null;
  /* Vercel injects either UPSTASH_REDIS_* or KV_* names depending on how the
     Upstash integration was connected — accept both. */
  var url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  var token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url: url, token: token });
  } catch (e) {
    return null;
  }
}

function orderKey(id) { return "ww:order:" + id; }
var ORDERS_ZSET = "ww:orders";

function parse(raw) {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  return raw;
}

/* Save a full order snapshot at checkout time. Never throws. */
async function saveOrder(snapshot) {
  var r = client();
  if (!r || !snapshot || !snapshot.orderId) return false;
  try {
    var key = orderKey(snapshot.orderId);
    await r.set(key, JSON.stringify(snapshot));
    await r.zadd(ORDERS_ZSET, {
      score: snapshot.createdAtMs || Date.now(),
      member: snapshot.orderId
    });
    return true;
  } catch (e) {
    return false;
  }
}

/* Update the payment status of a stored snapshot (called from verify). Never throws. */
async function updateOrderStatus(orderId, status, extra) {
  var r = client();
  if (!r || !orderId) return false;
  try {
    var snap = parse(await r.get(orderKey(orderId)));
    if (!snap) return false;
    snap.status = status;
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) snap[k] = extra[k];
      }
    }
    await r.set(orderKey(orderId), JSON.stringify(snap));
    return true;
  } catch (e) {
    return false;
  }
}

/* Newest-first order snapshots for the admin page. Throws STORE_NOT_CONFIGURED. */
async function listOrders(limit) {
  var r = client();
  if (!r) {
    var err = new Error("Order storage is not configured.");
    err.code = "STORE_NOT_CONFIGURED";
    throw err;
  }
  limit = parseInt(limit, 10);
  if (!(limit >= 1)) limit = 50;
  if (limit > 200) limit = 200;

  var ids = await r.zrange(ORDERS_ZSET, 0, limit - 1, { rev: true });
  if (!ids || !ids.length) return [];
  var keys = ids.map(orderKey);
  var raws = await r.mget(keys);
  var out = [];
  for (var i = 0; i < raws.length; i++) {
    var snap = parse(raws[i]);
    if (snap) out.push(snap);
  }
  return out;
}

module.exports = {
  saveOrder: saveOrder,
  updateOrderStatus: updateOrderStatus,
  listOrders: listOrders,
  loginBlocked: loginBlocked,
  recordFailedLogin: recordFailedLogin,
  clearFailedLogins: clearFailedLogins
};

/* ---------- admin login brute-force protection ----------
 * 5 wrong password attempts from one IP within 15 minutes -> locked for 15 min.
 * Counters live in the same Redis store. If Redis is missing, no blocking
 * happens (the admin API already 503s without Redis anyway). */

var RL_PREFIX = "ww:admin:rl:";
var RL_MAX_ATTEMPTS = 5;
var RL_WINDOW_SECONDS = 900; // 15 minutes

async function loginBlocked(ip) {
  var r = client();
  if (!r || !ip) return false;
  try {
    var n = await r.get(RL_PREFIX + ip);
    return Number(n) >= RL_MAX_ATTEMPTS;
  } catch (e) {
    return false;
  }
}

async function recordFailedLogin(ip) {
  var r = client();
  if (!r || !ip) return 0;
  try {
    var key = RL_PREFIX + ip;
    var n = await r.incr(key);
    if (n === 1) await r.expire(key, RL_WINDOW_SECONDS);
    return n;
  } catch (e) {
    return 0;
  }
}

async function clearFailedLogins(ip) {
  var r = client();
  if (!r || !ip) return;
  try {
    await r.del(RL_PREFIX + ip);
  } catch (e) { /* ignore */ }
}
