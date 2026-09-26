/* WellWith — hand-coded site data. Content mirrored from the golden-berry-journey repo. */
const WA_PHONE = "919266086554";

const PRODUCTS = [
  {
    slug: "sea-buckthorn-pulp", name: "Sea Buckthorn Pulp",
    tagline: "The Root of All Nutrition",
    description: "99.9% pure Sea Buckthorn Pulp harvested from bushes whose roots dig 200 ft deep into Ladakh's mineral-rich soil, gathering extraordinary nutrition from the pristine Himalayan earth.",
    ingredients: "99.9% Sea Buckthorn Pulp, rich in fruit oil.",
    image: "assets/products/pulp.jpg", category: "concentrate",
    color: "#dd8f2b", animationIcon: "🌿",
    ingredientsList: [
      { name: "Sea Buckthorn Pulp", icon: "🍊", benefit: "190+ bioactive compounds, 99.9% pure pulp from Ladakh's 11,500 ft altitude bushes." },
      { name: "Natural Fruit Oil", icon: "💧", benefit: "Rich in Omega 3, 6, 7 & 9 for cellular nourishment and skin health." },
      { name: "Vitamin C", icon: "🌟", benefit: "12x more Vitamin C than oranges, boosting immunity naturally." },
    ],
  },
  {
    slug: "fitwell", name: "Fitwell",
    tagline: "Ignite Your Metabolism",
    description: "A powerful blend that combines Sea Buckthorn with Garcinia Cambogia and Kokum to naturally boost fat oxidation and support healthy weight management.",
    ingredients: "Sea Buckthorn, Hydroxycitric acid (Garcinia cambogia), and Kokum.",
    image: "assets/products/fitwell.jpg", category: "concentrate",
    color: "#e06a1f", animationIcon: "🔥",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Rich in Omega-7 which supports healthy metabolism and fat breakdown." },
      { name: "Garcinia Cambogia (HCA)", icon: "🍋", benefit: "Hydroxycitric acid blocks fat-producing enzymes and suppresses appetite." },
      { name: "Kokum", icon: "🫐", benefit: "Garcinol-rich superfruit that aids fat oxidation and weight management." },
    ],
  },
  {
    slug: "diawell", name: "Diawell",
    tagline: "Your Immune Shield",
    description: "Traditional Ayurvedic powerhouses unite with Sea Buckthorn to create a protective shield for blood glucose management and kidney health.",
    ingredients: "Sea Buckthorn, Karela, Chirata, Jamun, and Punarnava.",
    image: "assets/products/diawell.jpg", category: "concentrate",
    color: "#2e8b57", animationIcon: "🛡️",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Antioxidant powerhouse that protects cells from free radical damage." },
      { name: "Karela (Bitter Gourd)", icon: "🥒", benefit: "Natural insulin-like compound that helps regulate blood glucose levels." },
      { name: "Chirata", icon: "🌿", benefit: "Ayurvedic bitter herb that supports liver function and blood purification." },
      { name: "Jamun", icon: "🫐", benefit: "Rich in jamboline which helps convert starch into energy, managing sugar spikes." },
      { name: "Punarnava", icon: "🌱", benefit: "Kidney-protective herb that supports renal health and reduces water retention." },
    ],
  },
  {
    slug: "power-x", name: "Power-X",
    tagline: "Legendary Stamina",
    description: "Inspired by the endurance of Genghis Khan's 13th-century warriors, Power-X combines seven potent herbs with Sea Buckthorn for unmatched vitality and stamina.",
    ingredients: "Sea Buckthorn, Konch Beej, Safed Musli, Gokhru, Akarkara, Salam Panja, and Ashwagandha.",
    image: "assets/products/powerx.jpg", category: "concentrate",
    color: "#c2512c", animationIcon: "⚔️",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Energy-boosting superfruit trusted by Genghis Khan's army for endurance." },
      { name: "Konch Beej", icon: "🌰", benefit: "Natural source of L-DOPA, enhances stamina and vitality." },
      { name: "Safed Musli", icon: "🌿", benefit: "Ayurvedic adaptogen known to boost strength and physical performance." },
      { name: "Gokhru", icon: "🌾", benefit: "Supports testosterone levels naturally for energy and muscle health." },
      { name: "Akarkara", icon: "🔥", benefit: "Stimulant herb that improves blood circulation and nervous system." },
      { name: "Salam Panja", icon: "🖐️", benefit: "Rare Himalayan orchid used as a tonic for overall physical wellness." },
      { name: "Ashwagandha", icon: "💪", benefit: "King of Ayurvedic herbs — reduces stress and boosts endurance significantly." },
    ],
  },
  {
    slug: "femwell", name: "Femwell",
    tagline: "Gentle Vitality for Women",
    description: "A nurturing blend of Ayurvedic herbs specifically formulated for women's gynecological health, hormonal balance, and overall vitality.",
    ingredients: "Sea Buckthorn, Shatavari, Daru Haldi, Ashok Chhal, and Dashmool.",
    image: "assets/products/femwell.jpg", category: "concentrate",
    color: "#d1487a", animationIcon: "🌸",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Omega-rich berry that supports skin glow and hormonal wellness." },
      { name: "Shatavari", icon: "🌸", benefit: "Queen of herbs for women — balances hormones and supports reproductive health." },
      { name: "Daru Haldi", icon: "🌿", benefit: "Anti-inflammatory root that aids in gynecological wellness and skin clarity." },
      { name: "Ashok Chhal", icon: "🌳", benefit: "Sacred bark used for centuries to support menstrual health and uterine toning." },
      { name: "Dashmool", icon: "🍃", benefit: "Ten-root blend that reduces inflammation and supports overall female vitality." },
    ],
  },
  {
    slug: "turmeric-blend", name: "Turmeric Blend",
    tagline: "The Golden Infusion",
    description: "Advanced Super Critical CO2 extracted Turmeric Oil meets Sea Buckthorn in this golden infusion, delivering maximum bioavailable curcuminoids for powerful anti-inflammatory support.",
    ingredients: "Sea Buckthorn and Turmeric oil (Advanced Super Critical CO2 extraction).",
    image: "assets/products/turmeric.jpg", category: "concentrate",
    color: "#e6a817", animationIcon: "✨",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Golden berry base rich in vitamins A, C, E and essential fatty acids." },
      { name: "Turmeric Oil (CO2 Extracted)", icon: "✨", benefit: "Super Critical CO2 extraction preserves maximum curcuminoids for powerful anti-inflammatory action." },
    ],
  },
  {
    slug: "omega-7-capsules", name: "Omega 7 Oil Capsules",
    tagline: "Rich in Omega 7",
    description: "Premium capsules containing Sea Buckthorn berry and seed oil, delivering the rare Omega 7 fatty acid along with Omega 3, 6 & 9 for complete cellular nourishment.",
    ingredients: "Sea Buckthorn berry and seed oil.",
    image: "assets/products/omega-capsules.jpg", category: "addon",
    color: "#d18f2e", animationIcon: "💊",
    ingredientsList: [
      { name: "Sea Buckthorn Berry Oil", icon: "🍊", benefit: "Rich in rare Omega-7 (Palmitoleic acid) that supports mucous membranes and skin." },
      { name: "Sea Buckthorn Seed Oil", icon: "🌰", benefit: "Contains balanced Omega 3, 6 & 9 for heart health and cellular repair." },
    ],
  },
  {
    slug: "nourishing-face-oil", name: "Nourishing Face Oil",
    tagline: "Elixir of Youth",
    description: "100% pure Supercritical CO2 extracted Sea Buckthorn oil, rich in Omega 3, 6, 7 & 9. A luxurious facial oil that deeply nourishes and rejuvenates all skin types.",
    ingredients: "100% pure Sea Buckthorn based Nourishing Oil with Omega 3, 6, 7 & 9.",
    image: "assets/products/face-oil.jpg", category: "addon",
    color: "#b06a2e", animationIcon: "💧",
    ingredientsList: [
      { name: "Sea Buckthorn Oil (CO2)", icon: "💧", benefit: "100% pure cold-extracted oil that deeply penetrates skin for anti-aging benefits." },
      { name: "Omega 3 & 6", icon: "🧬", benefit: "Essential fatty acids that repair skin barrier and lock in moisture." },
      { name: "Omega 7 & 9", icon: "✨", benefit: "Rare Omega-7 regenerates skin cells; Omega-9 keeps skin supple and youthful." },
    ],
  },
  {
    slug: "tisane-leaf-tea", name: "Sea Buckthorn Leaves Tisane",
    tagline: "Mountain Freshness in a Cup",
    description: "Caffeine-free tisane made from pure Sea Buckthorn leaves harvested in Ladakh. Just half a teaspoon brews into a vibrant yellow elixir in 5 seconds.",
    ingredients: "Sea Buckthorn leaves.",
    image: "assets/products/tisane.jpg", category: "addon",
    color: "#8aa832", animationIcon: "🍵",
    ingredientsList: [
      { name: "Sea Buckthorn Leaves", icon: "🍃", benefit: "Caffeine-free, antioxidant-rich leaves that brew into a vibrant yellow healing elixir in just 5 seconds." },
    ],
  },
];

const LISTEN_PRODUCTS = [
  { id: "pulp", name: "Sea Buckthorn Pulp", purpose: "Daily overall wellness, immunity and general health support.",
    description: "99.9% pure Ladakh Sea Buckthorn pulp — a simple daily spoon for immunity, energy and everyday wellness.",
    image: "assets/products/pulp.jpg", audio: "assets/audio/pulp.wav", url: "product.html?slug=sea-buckthorn-pulp" },
  { id: "turmeric", name: "Sea Buckthorn With Turmeric", purpose: "Focused on immunity and joint wellness.",
    description: "Sea Buckthorn blended with CO2-extracted turmeric oil for comfortable joints and steady immune support.",
    image: "assets/products/turmeric.jpg", audio: "assets/audio/turmeric.wav", url: "product.html?slug=turmeric-blend" },
  { id: "fitwell", name: "Sea Buckthorn FitWell", purpose: "Focused on metabolism and weight-management support.",
    description: "Sea Buckthorn with Garcinia and Kokum to support a healthy metabolism and weight-management routine.",
    image: "assets/products/fitwell.jpg", audio: "assets/audio/fitwell.wav", url: "product.html?slug=fitwell" },
  { id: "diawell", name: "Sea Buckthorn DiaWell", purpose: "Focused on blood-sugar and metabolic wellness.",
    description: "Karela, Jamun, Chirata and Punarnava with Sea Buckthorn — traditional herbs for metabolic wellness.",
    image: "assets/products/diawell.jpg", audio: "assets/audio/diawell.wav", url: "product.html?slug=diawell" },
  { id: "powerx", name: "Sea Buckthorn Power X", purpose: "Men's stamina, energy and vitality support.",
    description: "Seven Ayurvedic herbs including Ashwagandha and Safed Musli with Sea Buckthorn for stamina and vitality.",
    image: "assets/products/powerx.jpg", audio: "assets/audio/power-x.wav", url: "product.html?slug=power-x" },
  { id: "femwell", name: "Sea Buckthorn FemWell", purpose: "Women's wellness and hormonal health support.",
    description: "Shatavari, Ashok Chhal and Dashmool with Sea Buckthorn — a gentle blend for women's everyday balance.",
    image: "assets/products/femwell.jpg", audio: "assets/audio/femwell.wav", url: "product.html?slug=femwell" },
];

const PARTNER_MODELS = [
  { id: "community-partner", name: "Community Partner",
    tagline: "Start with your community and grow your wellness business.",
    benefits: ["No previous experience needed", "Training & mentorship", "Retail + incentive opportunities"],
    message: "A simple way to start with your own network and community.",
    why: ["Simple entry model — Sign Up, Train, Earn, Scale", "Training and mentorship support for beginners", "Company-stated retail and incentive opportunities"],
    audio: "assets/audio/communitypartner.wav", icon: "👥", enquiry: "Community Partner enquiry" },
  { id: "franchise-owner", name: "Franchise Owner",
    tagline: "Build a larger WellWith business in your city.",
    benefits: ["Territory rights", "Branding & marketing support", "Setup + training"],
    message: "A larger-scale business model for building WellWith in your city.",
    why: ["Territory rights and regional exclusivity as listed by the company", "Branding, marketing and setup support", "Full Seabuckthorn product portfolio access"],
    audio: "assets/audio/franchisebusiness.wav", icon: "🏢", enquiry: "Franchise Query" },
  { id: "b2b-partner", name: "B2B Partner",
    tagline: "Connect WellWith with your existing business or organisation.",
    benefits: ["Bulk Supply", "Private / White Label", "Institutional & R&D collaboration"],
    message: "A collaboration model for businesses that already have an organisation, network or infrastructure.",
    why: ["Bulk supply and private / white-label options", "Institutional tie-ups and R&D collaboration", "Seabuckthorn-based portfolio for category expansion"],
    audio: "assets/audio/B2B.wav", icon: "🤝", enquiry: "B2B Query" },
];

const WHY_WELLWITH = [
  { title: "1M+ Users", text: "WellWith Business states that it has over 1 million users across 15 nations." },
  { title: "Ladakh Seabuckthorn", text: "The company says its Seabuckthorn is handpicked from the valleys of Ladakh." },
  { title: "Research & Quality Focus", text: "Science-backed product development and lab-certified purity are highlighted." },
  { title: "Business Support", text: "Training, mentorship and digital-first support are highlighted for entrepreneurs." },
  { title: "3 Partnership Models", text: "Community Partner, Franchise Owner and B2B Partner provide different ways to explore working with WellWith." },
];

const HERO_FACTS = [
  "Sea Buckthorn — 190+ bioactive nutrients in one berry",
  "Rich in Omega 3, 6, 7 & 9 — a rare combo found in no other fruit",
  "Packed with more Vitamin C than oranges",
  "Grown wild at 11,500 ft in the Himalayas of Ladakh",
  "Used by Russian cosmonauts for radiation recovery",
  "Trusted by DRDO for high-altitude immunity support",
];

const CONCERNS = [
  { key: "skin", label: "Skin", emoji: "✨",
    keywords: ["skin","acne","eczema","psoriasis","dryness","scars","glow","aging","wrinkle","pimple"],
    products: [
      { name: "Sea Buckthorn Juice (Pulp) 300ml", why: "Deep cellular nourishment for healing skin from within.", tags: ["Omega 3,6,7,9","Vitamin C"] },
      { name: "Nourishing Oil 10ml", why: "Repairs skin barrier and boosts natural glow.", tags: ["CO2 Extracted","Rich in Omega-7"] },
      { name: "Night Cream", why: "Overnight regeneration for youthful skin.", tags: ["Anti-aging"] },
      { name: "Moisturizing Cream 50gm", why: "Deep hydration for smooth, supple skin.", tags: ["Hydrating"] },
      { name: "Gentle Face Cleanser", why: "Gently removes impurities without stripping moisture.", tags: ["Sulfate-free"] },
    ]},
  { key: "hair", label: "Hair", emoji: "💇",
    keywords: ["hair","hairfall","hair fall","scalp","dandruff","bald"],
    products: [
      { name: "Sea Buckthorn Juice (Pulp) 300ml", why: "Nourishes hair follicles from within.", tags: ["Omega-rich"] },
      { name: "Leaf Tea 50gm", why: "Antioxidants strengthen roots and improve scalp health.", tags: ["Caffeine-free"] },
      { name: "Oil Capsules", why: "Rare Omega-7 supports healthy hair growth.", tags: ["Omega 3,6,7,9"] },
    ]},
  { key: "joint", label: "Joint Pain", emoji: "🦴",
    keywords: ["joint","joints","pain","inflammation","arthritis","knee","back pain"],
    products: [
      { name: "Pulp with Turmeric Oil 300ml", why: "Powerful anti-inflammatory duo for joint comfort.", tags: ["Curcuminoids"] },
      { name: "Ayurvedic Pain Relief Massage Oil", why: "Direct topical relief for sore joints.", tags: ["Ayurvedic"] },
      { name: "Black Rice", why: "Anti-inflammatory antioxidants for daily wellness.", tags: ["Antioxidants"] },
      { name: "Leaf Tea", why: "Soothing brew that reduces internal inflammation.", tags: ["Herbal"] },
    ]},
  { key: "gut", label: "Gut Health", emoji: "🌱",
    keywords: ["gut","digestion","digestive","stomach","acidity","bloating","constipation"],
    products: [
      { name: "Sea Buckthorn Juice (Pulp) 300ml", why: "Soothes and heals the gut lining.", tags: ["190+ compounds"] },
      { name: "Oil Capsules", why: "Omega-7 nurtures mucous membranes of the gut.", tags: ["Gut lining"] },
      { name: "Black Rice", why: "Fiber-rich support for healthy digestion.", tags: ["High Fiber"] },
      { name: "Leaf Tea", why: "Gentle after-meal brew for smoother digestion.", tags: ["Caffeine-free"] },
    ]},
  { key: "diabetes", label: "Diabetes", emoji: "🩸",
    keywords: ["diabetes","sugar","blood sugar","glucose","insulin"],
    products: [
      { name: "DiaWell 300ml", why: "Ayurvedic blend to support healthy blood glucose.", tags: ["Karela","Jamun"] },
      { name: "Oil Capsules", why: "Supports metabolic health.", tags: ["Omega-7"] },
      { name: "Black Rice", why: "Low glycemic grain for stable sugar levels.", tags: ["Low GI"] },
      { name: "Leaf Tea", why: "Daily brew for glucose balance.", tags: ["Herbal"] },
    ]},
  { key: "weight", label: "Weight Management", emoji: "🔥",
    keywords: ["weight","fat","obesity","slim","loss","belly"],
    products: [
      { name: "FitWell 300ml", why: "Garcinia + Kokum blend for healthy fat oxidation.", tags: ["HCA","Metabolism"] },
      { name: "Oil Capsules", why: "Omega-7 supports appetite regulation.", tags: ["Omega-7"] },
      { name: "Leaf Tea", why: "Zero-calorie metabolic booster.", tags: ["Caffeine-free"] },
      { name: "Black Rice", why: "Filling, low-GI grain for weight goals.", tags: ["Low GI"] },
    ]},
  { key: "men", label: "Men's Wellness", emoji: "💪",
    keywords: ["men","man","stamina","energy","vitality","testosterone","power"],
    products: [
      { name: "Power X 300ml", why: "7-herb blend for stamina and vitality.", tags: ["Ashwagandha","Musli"] },
      { name: "Oil Capsules", why: "Cellular energy support.", tags: ["Omega-rich"] },
      { name: "Leaf Tea", why: "Daily wellness brew.", tags: ["Antioxidants"] },
    ]},
  { key: "women", label: "Female Wellness", emoji: "🌸",
    keywords: ["women","woman","female","hormone","period","menstrual","pcod","pcos"],
    products: [
      { name: "FemWell 300ml", why: "Shatavari-based hormonal balance blend.", tags: ["Shatavari","Ashok"] },
      { name: "Oil Capsules", why: "Supports skin and hormonal wellness.", tags: ["Omega-7"] },
      { name: "Leaf Tea", why: "Calming daily brew.", tags: ["Caffeine-free"] },
    ]},
  { key: "immunity", label: "Immunity", emoji: "🛡️",
    keywords: ["immunity","immune","cold","flu","wellness","general","sick"],
    products: [
      { name: "Gummies", why: "Tasty daily immunity boost.", tags: ["Vitamin C"] },
      { name: "Dry Berry Powder", why: "Concentrated antioxidant power.", tags: ["190+ compounds"] },
      { name: "Dry Berry", why: "Whole berry snack for daily wellness.", tags: ["Natural"] },
      { name: "Oil Capsules", why: "Omega-rich immune support.", tags: ["Omega 3,6,7,9"] },
    ]},
  { key: "sun", label: "Sun Protection", emoji: "☀️",
    keywords: ["sun","sunscreen","tan","spf","uv"],
    products: [
      { name: "Sunscreen Lotion SPF 50", why: "Broad-spectrum protection with Sea Buckthorn goodness.", tags: ["SPF 50"] },
    ]},
];

function findConcern(query) {
  const q = (query || "").toLowerCase().trim();
  if (!q) return null;
  const exact = CONCERNS.find((c) => c.key === q || c.label.toLowerCase() === q);
  if (exact) return exact;
  for (const c of CONCERNS) {
    if (c.keywords.some((k) => q.includes(k) || k.includes(q))) return c;
  }
  return null;
}

function waLink(message) {
  return "https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(message);
}
function productWaLink(name) {
  return waLink("Namaste Palak! I am very interested in your WellWith " + name + ". Please tell me more about its ingredients.");
}
