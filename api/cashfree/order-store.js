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
  clearFailedLogins: clearFailedLogins,
  getConfig: getConfig,
  setConfig: setConfig,
  logLead: logLead,
  listLeads: listLeads,
  leadThrottled: leadThrottled,
  getProductOverrides: getProductOverrides,
  setProductOverrides: setProductOverrides,
  effectivePrice: effectivePrice,
  DEFAULT_CONFIG: DEFAULT_CONFIG
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

/* ---------- site config (admin-controllable feature flags + banner text) ----------
 * Stored in Redis hash "ww:config". getConfig() always returns a full config
 * (defaults when Redis is missing or keys unset) so the site keeps working. */

var CONFIG_KEY = "ww:config";
var BANNER_SCENES = ["hey", "stop", "sale", "hurry", "cta"];

var DEFAULT_CONFIG = {
  cashfree_enabled: false,  // default OFF: Palak turns it ON from admin when ready
  coupon_visible: true,     // show the speacial20 Apply Coupon offer
  banner: {
    hey: ["HEY!", "HEY!", "HEY!"],
    stop: ["stop", "scrolling"],
    sale: ["MEGA", "SALE", "UP TO", "20% OFF"],
    hurry: ["HURRY", "HURRY", "LIMITED TIME", "HURRY", "HURRY"],
    cta: ["SHOP NOW"]
  }
};

function toBool(v, fallback) {
  if (v === true || v === "1" || v === 1 || v === "true") return true;
  if (v === false || v === "0" || v === 0 || v === "false") return false;
  return fallback;
}

function cleanWord(w) {
  w = String(w == null ? "" : w).replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (w.length > 24) w = w.slice(0, 24);
  return w;
}

function cleanBanner(input) {
  /* returns a sanitized banner object or null when input is unusable */
  if (!input || typeof input !== "object") return null;
  var out = {};
  for (var i = 0; i < BANNER_SCENES.length; i++) {
    var key = BANNER_SCENES[i];
    var arr = input[key];
    if (!Array.isArray(arr)) return null;
    var words = [];
    for (var j = 0; j < arr.length && words.length < 6; j++) {
      var w = cleanWord(arr[j]);
      if (w) words.push(w);
    }
    if (!words.length) return null;
    out[key] = words;
  }
  return out;
}

async function getConfig() {
  var cfg = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  var r = client();
  if (!r) return cfg;
  try {
    var h = await r.hgetall(CONFIG_KEY);
    if (!h) return cfg;
    if (h.cashfree_enabled !== undefined) cfg.cashfree_enabled = toBool(h.cashfree_enabled, true);
    if (h.coupon_visible !== undefined) cfg.coupon_visible = toBool(h.coupon_visible, true);
    if (h.banner) {
      try {
        var b = cleanBanner(JSON.parse(h.banner));
        if (b) cfg.banner = b;
      } catch (e) { /* keep default */ }
    }
  } catch (e) { /* keep defaults */ }
  return cfg;
}

/* patch: {cashfree_enabled?, coupon_visible?, banner?} — validated. Never throws. */
async function setConfig(patch) {
  var r = client();
  if (!r) {
    var err = new Error("Order storage is not configured.");
    err.code = "STORE_NOT_CONFIGURED";
    throw err;
  }
  patch = patch || {};
  var fields = {};
  if (patch.cashfree_enabled !== undefined) {
    if (typeof patch.cashfree_enabled !== "boolean") {
      var e1 = new Error("cashfree_enabled must be true/false.");
      e1.code = "BAD_PATCH";
      throw e1;
    }
    fields.cashfree_enabled = patch.cashfree_enabled ? "1" : "0";
  }
  if (patch.coupon_visible !== undefined) {
    if (typeof patch.coupon_visible !== "boolean") {
      var e2 = new Error("coupon_visible must be true/false.");
      e2.code = "BAD_PATCH";
      throw e2;
    }
    fields.coupon_visible = patch.coupon_visible ? "1" : "0";
  }
  if (patch.banner !== undefined) {
    var b = cleanBanner(patch.banner);
    if (!b) {
      var e3 = new Error("banner must have hey/stop/sale/hurry/cta scenes, each 1-6 short words.");
      e3.code = "BAD_PATCH";
      throw e3;
    }
    fields.banner = JSON.stringify(b);
  }
  var keys = Object.keys(fields);
  if (!keys.length) {
    var e4 = new Error("Nothing to update.");
    e4.code = "BAD_PATCH";
    throw e4;
  }
  await r.hset(CONFIG_KEY, fields);
  return getConfig();
}

/* ---------- WhatsApp leads ----------
 * Logged when a shopper taps a WhatsApp checkout option. We never see their
 * name/phone (they continue on WhatsApp), but the cart + time is captured. */

var LEADS_ZSET = "ww:leads";
var LEAD_KEY = function (id) { return "ww:lead:" + id; };
var MAX_LEADS = 200;

function cleanLead(l) {
  if (!l || typeof l !== "object") return null;
  if (l.channel !== "WHATSAPP") return null;
  var cart = String(l.cart || "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 500);
  var itemCount = parseInt(l.itemCount, 10);
  var total = Number(l.total);
  if (!cart || !(itemCount >= 1) || itemCount > 99 || !(total >= 0) || total > 1000000) return null;
  var now = Date.now();
  return {
    id: "L-" + now.toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
    channel: "WHATSAPP",
    cart: cart,
    itemCount: itemCount,
    total: Math.round(total * 100) / 100,
    ts: now,
    tsIso: new Date(now).toISOString()
  };
}

/* tiny spam throttle: one lead per IP per 10s. Returns true when throttled. */
async function leadThrottled(ip) {
  var r = client();
  if (!r || !ip) return false;
  try {
    var key = "ww:lead:rl:" + ip;
    var n = await r.incr(key);
    if (n === 1) await r.expire(key, 10);
    return n > 1;
  } catch (e) {
    return false;
  }
}

async function logLead(raw) {
  var lead = cleanLead(raw);
  if (!lead) {
    var err = new Error("Invalid lead data.");
    err.code = "BAD_LEAD";
    throw err;
  }
  var r = client();
  if (!r) {
    var err2 = new Error("Order storage is not configured.");
    err2.code = "STORE_NOT_CONFIGURED";
    throw err2;
  }
  await r.set(LEAD_KEY(lead.id), JSON.stringify(lead));
  await r.zadd(LEADS_ZSET, { score: lead.ts, member: lead.id });
  await r.zremrangebyrank(LEADS_ZSET, 0, -(MAX_LEADS + 1));
  return lead;
}

async function listLeads(limit) {
  var r = client();
  if (!r) {
    var err = new Error("Order storage is not configured.");
    err.code = "STORE_NOT_CONFIGURED";
    throw err;
  }
  limit = parseInt(limit, 10);
  if (!(limit >= 1)) limit = 50;
  if (limit > 200) limit = 200;
  var ids = await r.zrange(LEADS_ZSET, 0, limit - 1, { rev: true });
  if (!ids || !ids.length) return [];
  var raws = await r.mget(ids.map(LEAD_KEY));
  var out = [];
  for (var i = 0; i < raws.length; i++) {
    var lead = parse(raws[i]);
    if (lead) out.push(lead);
  }
  return out;
}

/* ---------- product overrides (admin product manager) ----------
 * Stored as one JSON doc in Redis key "ww:product_overrides":
 *   { "<slug>": { name, sku, price, price_drop, active, image, category, tagline, description } }
 * Only admin-set fields are stored; the storefront merges them over the
 * baked-in catalog (assets/js/data.js) and the server merges them over
 * api/cashfree/prices.json. Effective price = price_drop (when set and lower)
 * else price override else base price. */

var PRODUCTS_KEY = "ww:product_overrides";
var PRODUCT_CATEGORIES = ["concentrate", "addon"];

function cleanSlug(s) {
  s = String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (s.length > 60) s = s.slice(0, 60);
  return s;
}
function cleanText(s, max) {
  s = String(s == null ? "" : s).replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (s.length > max) s = s.slice(0, max);
  return s;
}
function cleanPrice(n) {
  n = Number(n);
  if (!isFinite(n) || n <= 0 || n > 1000000) return null;
  return Math.round(n);
}
function cleanImageUrl(s) {
  s = cleanText(s, 500);
  if (!s) return "";
  if (/^(https?:\/\/|assets\/|\/)/i.test(s)) return s;
  return "";
}
/* Sanitize one product override. Returns the cleaned object, or null when
 * it carries nothing usable. `isNew` marks admin-added products (name+price required). */
function cleanProductOverride(slug, input, isNew) {
  if (!slug || !input || typeof input !== "object") return null;
  var out = {};
  var name = cleanText(input.name, 80);
  if (name) out.name = name;
  var sku = cleanText(input.sku, 40);
  if (sku) out.sku = sku;
  var price = cleanPrice(input.price);
  if (price) out.price = price;
  var drop = cleanPrice(input.price_drop);
  if (drop) out.price_drop = drop;
  if (typeof input.active === "boolean") out.active = input.active;
  var img = cleanImageUrl(input.image);
  if (img) out.image = img;
  var cat = cleanText(input.category, 20).toLowerCase();
  if (PRODUCT_CATEGORIES.indexOf(cat) !== -1) out.category = cat;
  var tagline = cleanText(input.tagline, 120);
  if (tagline) out.tagline = tagline;
  var desc = cleanText(input.description, 2000);
  if (desc) out.description = desc;
  if (isNew && (!out.name || !out.price)) return null;
  if (!Object.keys(out).length) return null;
  return out;
}
/* Effective selling price for a slug: price_drop (when lower) > price override > base. */
function effectivePrice(slug, basePrice, overrides) {
  var o = (overrides && overrides[slug]) || {};
  var price = (typeof o.price === "number" && o.price > 0) ? o.price
    : (typeof basePrice === "number" ? basePrice : 0);
  if (typeof o.price_drop === "number" && o.price_drop > 0 && o.price_drop < price) return o.price_drop;
  return price;
}
async function getProductOverrides() {
  var r = client();
  if (!r) return {};
  try {
    var o = parse(await r.get(PRODUCTS_KEY));
    return (o && typeof o === "object" && !Array.isArray(o)) ? o : {};
  } catch (e) {
    return {};
  }
}
async function setProductOverrides(patch) {
  var r = client();
  if (!r) {
    var err = new Error("Order storage is not configured.");
    err.code = "STORE_NOT_CONFIGURED";
    throw err;
  }
  patch = (patch && typeof patch === "object") ? patch : {};
  var current = await getProductOverrides();
  var slugs = Object.keys(patch);
  if (!slugs.length) {
    var e = new Error("Nothing to update.");
    e.code = "BAD_PATCH";
    throw e;
  }
  if (slugs.length > 200) {
    var e2 = new Error("Too many products in one save (max 200).");
    e2.code = "BAD_PATCH";
    throw e2;
  }
  for (var i = 0; i < slugs.length; i++) {
    var slug = cleanSlug(slugs[i]);
    if (!slug) continue;
    var val = patch[slugs[i]];
    if (val === null) { delete current[slug]; continue; } // null = remove override
    var isNew = !current[slug] || !!current[slug]._new;
    var c = cleanProductOverride(slug, val, isNew && val._new === true);
    if (c) {
      /* Merge into the existing override (don't wipe fields the patch
       * didn't include — e.g. name/image of an admin-added product when
       * only its price is edited). */
      var prev = (current[slug] && typeof current[slug] === "object") ? current[slug] : {};
      var merged = Object.assign({}, prev, c);
      /* Explicit "clear the drop": a patch price_drop of 0/empty removes it. */
      if (val.price_drop === 0 || val.price_drop === "" || val.price_drop === null) delete merged.price_drop;
      /* Explicit clear of text fields: blanking removes the override key
       * (catalog products fall back to base data, new products to defaults). */
      ["image", "category", "tagline", "description"].forEach(function (k) {
        if (val[k] === "") delete merged[k];
      });
      if (val._new === true) merged._new = true;
      else if (prev._new) merged._new = true;
      current[slug] = merged;
    }
  }
  await r.set(PRODUCTS_KEY, JSON.stringify(current));
  return current;
}
