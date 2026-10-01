/* Vercel build step: copy the static site into dist/ (no bundling). */
var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var out = path.join(root, "dist");
var entries = [
  "index.html",
  "product.html",
  "products.html",
  "cart.html",
  "checkout.html",
  "checkout-review.html",
  "order-confirmation.html",
  "admin.html",
  "expert.html",
  "solution-finder.html",
  "contact.html",
  "terms.html",
  "refunds.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "css",
  "js",
  "assets"
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
entries.forEach(function (name) {
  var src = path.join(root, name);
  var dst = path.join(out, name);
  if (!fs.existsSync(src)) { throw new Error("missing: " + name); }
  fs.cpSync(src, dst, { recursive: true });
});
console.log("wellwith static site copied to dist/ (" + entries.length + " entries)");
