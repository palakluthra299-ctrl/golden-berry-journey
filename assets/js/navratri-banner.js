/* ==========================================================================
   NAVRATRI MATA BANNER — auto-rotates the Devi across 9 days (2D animated)
   Sharad Navratri 2026: Oct 11 = Day 1 (Shailaputri) … Oct 19 = Day 9.
   Outside these dates the banner stays hidden. Palak: kuch badalna ho to
   neeche DEVIS list me naam/symbol badal do — date ka hisaab automatic hai.
   ========================================================================== */
(function () {
  "use strict";

  var IMG_V = "20261011-1"; // cache-buster for devi images

  var DEVIS = [
    { name: "MAA SHAILAPUTRI",  symbol: "Symbol of strength",    img: "devi-1-shailaputri.png",  alt: "Maa Shailaputri — Symbol of strength" },
    { name: "MAA BRAHMACHARINI", symbol: "Symbol of devotion",   img: "devi-2-brahmacharini.png", alt: "Maa Brahmacharini — Symbol of devotion" },
    { name: "MAA CHANDRAGHANTA", symbol: "Symbol of courage",    img: "devi-3-chandraghanta.png", alt: "Maa Chandraghanta — Symbol of courage" },
    { name: "MAA KUSHMANDA",     symbol: "Symbol of energy",     img: "devi-4-kushmanda.png",     alt: "Maa Kushmanda — Symbol of energy" },
    { name: "MAA SKANDAMATA",    symbol: "Symbol of motherhood", img: "devi-5-skandamata.png",    alt: "Maa Skandamata — Symbol of motherhood" },
    { name: "MAA KATYAYANI",     symbol: "Symbol of power",       img: "devi-6-katyayani.png",     alt: "Maa Katyayani — Symbol of power" },
    { name: "MAA KALARATRI",     symbol: "Symbol of protection",  img: "devi-7-kalaratri.png",     alt: "Maa Kalaratri — Symbol of protection" },
    { name: "MAA MAHAGAURI",     symbol: "Symbol of purity",      img: "devi-8-mahagauri.png",     alt: "Maa Mahagauri — Symbol of purity" },
    { name: "MAA SIDDHIDATRI",   symbol: "Symbol of fulfilment", img: "devi-9-siddhidatri.png",   alt: "Maa Siddhidatri — Symbol of fulfilment" }
  ];

  function dayOnly(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  function currentDeviIndex() {
    var start = new Date(2026, 9, 11); // Oct 11, 2026 = Day 1
    var diff = Math.round((dayOnly(new Date()) - dayOnly(start)) / 86400000);
    return (diff >= 0 && diff <= 8) ? diff : -1;
  }

  function spawnPetals(root) {
    var layer = root.querySelector(".navratri-petals");
    if (!layer) return;
    var n = 10;
    for (var i = 0; i < n; i++) {
      var p = document.createElement("i");
      p.style.left = (4 + Math.random() * 92) + "%";
      p.style.animationDuration = (6 + Math.random() * 6) + "s";
      p.style.animationDelay = (-Math.random() * 10) + "s";
      var s = 0.7 + Math.random() * 0.7;
      p.style.width = (10 * s) + "px";
      p.style.height = (13 * s) + "px";
      layer.appendChild(p);
    }
  }

  function spawnDiyas(root) {
    var spots = [
      { left: "12%", bottom: "10px" },
      { left: "20%", bottom: "22px" },
      { right: "30%", bottom: "12px" },
      { right: "14%", bottom: "26px" }
    ];
    spots.forEach(function (sp, i) {
      var d = document.createElement("span");
      d.className = "navratri-diya";
      d.setAttribute("aria-hidden", "true");
      if (sp.left) d.style.left = sp.left;
      if (sp.right) d.style.right = sp.right;
      d.style.bottom = sp.bottom;
      d.style.animationDelay = (-i * 0.4) + "s";
      root.querySelector(".navratri-inner").appendChild(d);
    });
  }

  function init() {
    var banner = document.getElementById("navratri-banner");
    if (!banner) return;
    var idx = currentDeviIndex();
    if (idx < 0) return; // not Navratri — stay hidden

    var devi = DEVIS[idx];
    var img = document.getElementById("navratri-devi-img");
    var nameEl = document.getElementById("navratri-devi-name");
    var symEl = document.getElementById("navratri-devi-symbol");

    if (img) {
      img.src = "assets/navratri/" + devi.img + "?v=" + IMG_V;
      img.alt = devi.alt;
    }
    if (nameEl) nameEl.textContent = devi.name;
    if (symEl) symEl.textContent = devi.symbol;

    banner.hidden = false;
    spawnPetals(banner);
    spawnDiyas(banner);
    startGiftRotator();
  }

  /* ---- Diwali gift message rotator (added 2026-10-12): swaps text every 4.5s ---- */
  var GIFT_MSGS = [
    "🎁 Gift your loved ones — WellWith gift hampers!",
    "🪔 Diwali gifting with a healthy twist!",
    "✨ Festive hampers for every budget!"
  ];
  function startGiftRotator() {
    var giftEl = document.getElementById("navratri-gift-text");
    if (!giftEl) return;
    var gi = 0;
    setInterval(function () {
      giftEl.classList.add("gift-fade");
      setTimeout(function () {
        gi = (gi + 1) % GIFT_MSGS.length;
        giftEl.textContent = GIFT_MSGS[gi];
        giftEl.classList.remove("gift-fade");
      }, 450);
    }, 4500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
