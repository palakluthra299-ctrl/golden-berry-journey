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
  {
    slug: "ao-shot", name: "AO Antioxidant Shot",
    tagline: "Concentrated daily shot of Himalayan sea buckthorn with natural vitamins, minerals and antioxidants.",
    description: "Concentrated daily shot of Himalayan sea buckthorn with natural vitamins, minerals and antioxidants. No added sugar, preservatives or artificial components.",
    ingredients: "Concentrated Himalayan sea buckthorn with natural vitamins, minerals and antioxidants. No added sugar.",
    image: "assets/products/ao-shot.jpg", category: "concentrate",
    color: "#e07b1f", animationIcon: "⚡",
    ingredientsList: [
      { name: "Sea Buckthorn Concentrate", icon: "🍊", benefit: "Concentrated daily shot of Himalayan sea buckthorn, naturally rich in vitamins and minerals." },
      { name: "Natural Antioxidants", icon: "🛡️", benefit: "No added sugar, preservatives or artificial components — just pure berry nutrition." },
    ],
  },
  {
    slug: "gummies-30", name: "Sea Buckthorn Gummies",
    tagline: "Sea buckthorn superfruit gummies with natural sugar (FOS); omegas 3, 6, 7 & 9. For kids and adults.",
    description: "Made with sea buckthorn superfruit from Ladakh with natural sugar FOS. Contains omegas 3, 6, 7 & 9. Suitable for kids and adults.",
    ingredients: "Sea buckthorn superfruit gummies with natural FOS sugar; omegas 3, 6, 7 & 9. For kids and adults.",
    image: "assets/products/gummies-30.jpg", category: "addon",
    color: "#e8912d", animationIcon: "🍬",
    ingredientsList: [
      { name: "Sea Buckthorn Superfruit", icon: "🍊", benefit: "Made with Ladakh sea buckthorn superfruit, sweetened naturally with FOS." },
      { name: "Omegas 3, 6, 7 & 9", icon: "💧", benefit: "Full omega spectrum in a tasty gummy — suitable for kids and adults." },
    ],
  },
  {
    slug: "vitc-capsules", name: "Vitamin C Capsules",
    tagline: "Formulated with Vitamin C, omega 3/6/7/9 fatty acids and vitamins A and E for daily nutritional needs.",
    description: "Formulated with Vitamin C, omega 3/6/7/9 fatty acids and vitamins A and E for daily nutritional needs.",
    ingredients: "Vitamin C with omega 3/6/7/9 fatty acids and vitamins A and E for daily nutritional needs.",
    image: "assets/products/vitc-capsules.jpg", category: "addon",
    color: "#f0a92e", animationIcon: "💊",
    ingredientsList: [
      { name: "Vitamin C", icon: "🌟", benefit: "Daily vitamin C for everyday nutritional needs." },
      { name: "Omegas 3/6/7/9", icon: "💧", benefit: "Sea buckthorn-derived omegas alongside vitamins A and E." },
    ],
  },
  {
    slug: "collagen-200", name: "Multi Collagen Peptide",
    tagline: "Bioactive collagen peptides (type I & II) with Boswellia, glutathione and rosehip. Orange flavour.",
    description: "200 g. Contains bioactive collagen peptides, Boswellia Serrata extract, glutathione, rosehip extract and vitamins and minerals. Type I and II collagen peptides. Orange flavour.",
    ingredients: "Bioactive collagen peptides (type I & II) with Boswellia, glutathione and rosehip. Orange flavour.",
    image: "assets/products/collagen-200.jpg", category: "addon",
    color: "#e8a87c", animationIcon: "✨",
    ingredientsList: [
      { name: "Collagen Peptides (I & II)", icon: "🧬", benefit: "Bioactive type I & II collagen peptides." },
      { name: "Boswellia Serrata", icon: "🌿", benefit: "Traditional botanical extract blended into the formula." },
      { name: "Glutathione & Rosehip", icon: "🍊", benefit: "With rosehip extract, vitamins and minerals. Orange flavour." },
    ],
  },
  {
    slug: "dry-berry-100", name: "Sea Buckthorn Dry Berry",
    tagline: "Whole dried berries, wild-harvested and shade-dried in Ladakh. No sugar or additives.",
    description: "Whole dried berries wild-harvested and shade-dried in Ladakh. Preserved without sugar or additives. Rich in vitamin C (998 mg/100 g).",
    ingredients: "Whole dried berries, wild-harvested and shade-dried in Ladakh. No sugar or additives.",
    image: "assets/products/dry-berry-100.jpg", category: "addon",
    color: "#d97b2b", animationIcon: "🫐",
    ingredientsList: [
      { name: "Whole Dried Berries", icon: "🫐", benefit: "Wild-harvested and shade-dried in Ladakh, preserved without sugar or additives." },
      { name: "Vitamin C", icon: "🌟", benefit: "Naturally rich in vitamin C (998 mg/100 g)." },
    ],
  },
  {
    slug: "berry-powder-100", name: "Sea Buckthorn Berry Powder",
    tagline: "100% natural berry powder from Ladakh dry berries — about 20 servings per pack.",
    description: "100% natural berry powder from Ladakh dry berries. No artificial preservatives or additives. 20 servings per 100 g pack.",
    ingredients: "100% natural berry powder from Ladakh dry berries. No artificial preservatives or additives.",
    image: "assets/products/berry-powder-100.jpg", category: "addon",
    color: "#cf8a3a", animationIcon: "🌾",
    ingredientsList: [
      { name: "Berry Powder", icon: "🍊", benefit: "100% natural powder from Ladakh dry berries — about 20 servings per pack." },
      { name: "No Additives", icon: "✅", benefit: "No artificial preservatives or additives." },
    ],
  },
  {
    slug: "jam-250", name: "Sea Buckthorn Jam",
    tagline: "Made with 100% natural Ladakh sea buckthorn berries. No refined sugar or artificial preservatives.",
    description: "Made with 100% natural Ladakh-sourced sea buckthorn berries. No artificial preservatives, synthetic colours or refined sugar. Tangy-sweet flavour.",
    ingredients: "Made with 100% natural Ladakh sea buckthorn berries. No refined sugar or artificial preservatives.",
    image: "assets/products/jam-250.jpg", category: "addon",
    color: "#c65b2e", animationIcon: "🍓",
    ingredientsList: [
      { name: "Ladakh Berries", icon: "🍊", benefit: "Made with 100% natural Ladakh-sourced sea buckthorn berries." },
      { name: "No Refined Sugar", icon: "✅", benefit: "Tangy-sweet flavour with no artificial preservatives or synthetic colours." },
    ],
  },
  {
    slug: "superfruit-tea", name: "Super Fruit Tea",
    tagline: "Dried berries and leaves of Ladakh sea buckthorn — 20 × 2 g herbal infusion bags.",
    description: "Made with dried berries and dry leaves of Ladakh-sourced sea buckthorn. 20 bags × 2 g each. Herbal infusion for daily routine.",
    ingredients: "Dried berries and leaves of Ladakh sea buckthorn. 20 herbal infusion bags.",
    image: "assets/products/superfruit-tea.jpg", category: "addon",
    color: "#8aa832", animationIcon: "🍵",
    ingredientsList: [
      { name: "Dried Berries", icon: "🫐", benefit: "Ladakh sea buckthorn berries in every bag." },
      { name: "Dry Leaves", icon: "🍃", benefit: "Blended with sea buckthorn leaves — 20 × 2 g herbal infusion bags for daily routine." },
    ],
  },
  {
    slug: "ctc-tea-250", name: "Omega CTC Tea",
    tagline: "Premium CTC blend of sea buckthorn and classic tea leaves. 100% organic, sugar-free.",
    description: "Premium blend of CTC (crush, tear, curl) sea buckthorn and classic tea leaves. 100% organic, sugar-free tea leaves. Lab-tested and certified.",
    ingredients: "Premium CTC blend of sea buckthorn and classic tea leaves. 100% organic, sugar-free.",
    image: "assets/products/ctc-tea-250.jpg", category: "addon",
    color: "#7a8f2e", animationIcon: "☕",
    ingredientsList: [
      { name: "Sea Buckthorn CTC", icon: "🍃", benefit: "Crush-tear-curl blend of sea buckthorn with classic tea leaves." },
      { name: "100% Organic", icon: "✅", benefit: "Organic, sugar-free, lab-tested and certified tea leaves." },
    ],
  },
  {
    slug: "effervescent-15", name: "Moringa Effervescent Tablets",
    tagline: "Fast-dissolving tablets with sea buckthorn and moringa. Vegan, sugar-free, orange flavour.",
    description: "15 fast-dissolving effervescent tablets with sea buckthorn and moringa. Plant-based iron, calcium and essential amino acids. Vegan, sugar-free, non-GMO. Orange flavour.",
    ingredients: "Fast-dissolving tablets with sea buckthorn and moringa. Vegan, sugar-free, orange flavour.",
    image: "assets/products/effervescent-15.jpg", category: "addon",
    color: "#e8a13a", animationIcon: "🍊",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Fast-dissolving effervescent tablets — just drop in water." },
      { name: "Moringa", icon: "🌿", benefit: "With moringa: plant-based iron, calcium and essential amino acids. Vegan, sugar-free, non-GMO." },
    ],
  },
  {
    slug: "black-rice-250", name: "Chak Hao Black Rice",
    tagline: "100% natural black rice from Manipur — gluten-free, high fiber, zero additives.",
    description: "100% natural black rice from Manipur. Zero additives and preservatives. Gluten-free superfood with high fiber and antioxidants.",
    ingredients: "100% natural black rice from Manipur. Gluten-free, high fiber, zero additives.",
    image: "assets/products/black-rice-250.jpg", category: "addon",
    color: "#4a4a5e", animationIcon: "🍚",
    ingredientsList: [
      { name: "Chak Hao Black Rice", icon: "🍚", benefit: "100% natural black rice from Manipur — the legendary forbidden rice." },
      { name: "High Fiber", icon: "✅", benefit: "Gluten-free superfood with high fiber and antioxidants. Zero additives." },
    ],
  },
  {
    slug: "dentowin-100", name: "Dentowin Herbal Toothpaste",
    tagline: "Plant-based toothpaste with sea buckthorn, neem, tulsi, elaichi and 21 herbal ingredients. Sulphate & fluoride free.",
    description: "Plant-based herbal toothpaste with sea buckthorn, neem, tulsi, elaichi and 17 more herbs (21 herbal key ingredients). Sulphate-free, paraben-free, fluoride-free.",
    ingredients: "Sea buckthorn, neem, tulsi, elaichi and 21 herbal ingredients. Sulphate & fluoride free.",
    image: "assets/products/dentowin-100.jpg", category: "addon",
    color: "#5da85f", animationIcon: "🪥",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Plant-based toothpaste powered by sea buckthorn." },
      { name: "Neem & Tulsi", icon: "🌿", benefit: "With neem, tulsi, elaichi and 17 more herbs — 21 herbal key ingredients." },
      { name: "Free From", icon: "✅", benefit: "Sulphate-free, paraben-free, fluoride-free." },
    ],
  },
  {
    slug: "ubtan-facewash-110", name: "Ubtan Face Wash",
    tagline: "Ayurvedic-inspired cleanser with sea buckthorn oil, haldi, chandan, aloe vera and mild exfoliating beads.",
    description: "Ayurvedic-inspired cleanser with sea buckthorn oil, haldi extract, chandan (sandalwood), aloe vera and mild exfoliating beads. For all skin types.",
    ingredients: "Sea buckthorn oil, haldi, chandan, aloe vera and mild exfoliating beads. For all skin types.",
    image: "assets/products/ubtan-facewash-110.jpg", category: "addon",
    color: "#d8a03a", animationIcon: "🧴",
    ingredientsList: [
      { name: "Sea Buckthorn Oil", icon: "💧", benefit: "Ayurvedic-inspired cleanser with omega-rich sea buckthorn oil." },
      { name: "Haldi & Chandan", icon: "✨", benefit: "With haldi extract and chandan (sandalwood) for a traditional ubtan glow." },
      { name: "Aloe & Beads", icon: "🌿", benefit: "Aloe vera with mild exfoliating beads. For all skin types." },
    ],
  },
  {
    slug: "sunscreen-50", name: "Whipped Sunscreen SPF 50",
    tagline: "Broad-spectrum sunscreen with sea buckthorn oil and omega-7. No white cast, for all skin types.",
    description: "Broad-spectrum sunscreen with sea buckthorn oil. Rich in antioxidants, omega-7 fatty acids and vitamins A, C, E. No white cast. For all skin types.",
    ingredients: "Broad-spectrum SPF 50 PA++++ with sea buckthorn oil and omega-7. No white cast, for all skin types.",
    image: "assets/products/sunscreen-50.jpg", category: "addon",
    color: "#f0c93e", animationIcon: "☀️",
    ingredientsList: [
      { name: "SPF 50 PA++++", icon: "☀️", benefit: "Broad-spectrum sun protection with no white cast — for all skin types." },
      { name: "Sea Buckthorn Oil", icon: "🍊", benefit: "Rich in antioxidants, omega-7 fatty acids and vitamins A, C, E." },
    ],
  },
  {
    slug: "gentle-cleanser-100", name: "Gentle Face Cleanser",
    tagline: "With sea buckthorn oil and oat extract — removes impurities without drying skin.",
    description: "100 ml. With sea buckthorn oil and oat extract. Removes dirt, oil and impurities without drying skin. Suitable for all skin types.",
    ingredients: "Sea buckthorn oil and oat extract — removes impurities without drying skin.",
    image: "assets/products/gentle-cleanser-100.jpg", category: "addon",
    color: "#a8c68a", animationIcon: "🫧",
    ingredientsList: [
      { name: "Sea Buckthorn Oil", icon: "💧", benefit: "Gentle daily cleanse powered by sea buckthorn oil." },
      { name: "Oat Extract", icon: "🌾", benefit: "With oat extract — removes dirt, oil and impurities without drying. All skin types." },
    ],
  },
  {
    slug: "gluta-facewash", name: "Glutathione Face Wash",
    tagline: "With glutathione, sea buckthorn oil (omegas 3, 6, 7, 9), kojic acid and vitamins C and E.",
    description: "Gentle face wash enriched with glutathione, sea buckthorn oil (omegas 3, 6, 7, 9), kojic acid and vitamins C and E. Cleanses without dryness or irritation.",
    ingredients: "Glutathione, sea buckthorn oil (omegas 3, 6, 7, 9), kojic acid and vitamins C and E.",
    image: "assets/products/gluta-facewash.jpg", category: "addon",
    color: "#b8a8d8", animationIcon: "🧼",
    ingredientsList: [
      { name: "Glutathione", icon: "✨", benefit: "Gentle face wash enriched with glutathione." },
      { name: "Sea Buckthorn Omegas", icon: "🍊", benefit: "Sea buckthorn oil with omegas 3, 6, 7, 9." },
      { name: "Kojic Acid & Vitamins", icon: "🌟", benefit: "With kojic acid and vitamins C and E — cleanses without dryness or irritation." },
    ],
  },
  {
    slug: "night-cream", name: "Nourishing Night Cream",
    tagline: "With hyaluronic acid, niacinamide, sea buckthorn oil and argan kernel oil. Non-sticky overnight care.",
    description: "With hyaluronic acid, niacinamide, sea buckthorn oil and argan kernel oil. Non-sticky formula for overnight skin care.",
    ingredients: "Hyaluronic acid, niacinamide, sea buckthorn oil and argan kernel oil. Non-sticky overnight care.",
    image: "assets/products/night-cream.jpg", category: "addon",
    color: "#6a5a8a", animationIcon: "🌙",
    ingredientsList: [
      { name: "Hyaluronic Acid", icon: "💧", benefit: "Overnight hydration that doesn't feel sticky." },
      { name: "Niacinamide", icon: "✨", benefit: "With niacinamide and argan kernel oil for overnight skin care." },
      { name: "Sea Buckthorn Oil", icon: "🍊", benefit: "Omega-rich sea buckthorn oil feeds skin while you sleep." },
    ],
  },
  {
    slug: "moisturizing-cream-50", name: "Moisturizing Cream",
    tagline: "With CO₂-extracted sea buckthorn oil, vitamins C & E and omegas 3, 6, 7, 9. Lightweight.",
    description: "Enriched with CO₂-extracted sea buckthorn oil. Contains vitamins C and E and omegas 3, 6, 7, 9. Lightweight, easily absorbed.",
    ingredients: "CO₂-extracted sea buckthorn oil with vitamins C & E and omegas 3, 6, 7, 9. Lightweight.",
    image: "assets/products/moisturizing-cream-50.jpg", category: "addon",
    color: "#d8a05a", animationIcon: "🧴",
    ingredientsList: [
      { name: "CO₂ Sea Buckthorn Oil", icon: "💧", benefit: "Enriched with CO₂-extracted sea buckthorn oil." },
      { name: "Vitamins C & E", icon: "🌟", benefit: "With vitamins C and E and omegas 3, 6, 7, 9 — lightweight, easily absorbed." },
    ],
  },
  {
    slug: "scar-cream-50", name: "Stretch & Scar Cream",
    tagline: "3X sea buckthorn oil with hyaluronic acid and licorice extract.",
    description: "Contains 3X potency of sea buckthorn oil, hyaluronic acid and licorice extract. Massage affected area twice daily until absorbed.",
    ingredients: "3X sea buckthorn oil with hyaluronic acid and licorice extract.",
    image: "assets/products/scar-cream-50.jpg", category: "addon",
    color: "#c98a6a", animationIcon: "🤍",
    ingredientsList: [
      { name: "3X Sea Buckthorn Oil", icon: "🍊", benefit: "Triple-potency sea buckthorn oil base." },
      { name: "Hyaluronic Acid & Licorice", icon: "🌿", benefit: "With hyaluronic acid and licorice extract — massage twice daily until absorbed." },
    ],
  },
  {
    slug: "soap-100", name: "Natural Sea Buckthorn Soap",
    tagline: "Handmade bathing bar with coconut oil, castor oil, sea buckthorn seed & berry oils and glycerin.",
    description: "Handmade bathing bar with purified water, coconut oil, castor oil, sea buckthorn seed oil, berry oil and glycerin. Enriched with omegas 3, 6, 7, 9.",
    ingredients: "Handmade bar with coconut oil, castor oil, sea buckthorn seed & berry oils and glycerin.",
    image: "assets/products/soap-100.jpg", category: "addon",
    color: "#d8b06a", animationIcon: "🧽",
    ingredientsList: [
      { name: "Coconut & Castor Oil", icon: "🥥", benefit: "Handmade bathing bar with coconut oil and castor oil." },
      { name: "Sea Buckthorn Oils", icon: "🍊", benefit: "With sea buckthorn seed oil, berry oil and glycerin — omegas 3, 6, 7, 9." },
    ],
  },
  {
    slug: "foot-cream-50", name: "Foot Cream",
    tagline: "With shea butter, sea buckthorn, neem, clove, lactic acid and tea tree oil for soft, smooth feet.",
    description: "Made with essential oils of shea butter, sea buckthorn, neem and clove, plus lactic acid and tea tree oil. Keeps feet soft and smooth.",
    ingredients: "Shea butter, sea buckthorn, neem, clove, lactic acid and tea tree oil for soft, smooth feet.",
    image: "assets/products/foot-cream-50.jpg", category: "addon",
    color: "#a8c8a0", animationIcon: "🦶",
    ingredientsList: [
      { name: "Shea Butter", icon: "🧈", benefit: "Rich shea butter base for soft, smooth feet." },
      { name: "Sea Buckthorn & Neem", icon: "🌿", benefit: "With sea buckthorn, neem and clove." },
      { name: "Lactic Acid & Tea Tree", icon: "💧", benefit: "Lactic acid and tea tree oil for happy feet." },
    ],
  },
  {
    slug: "pain-oil", name: "Pain Relief Massage Oil",
    tagline: "100% natural — sea buckthorn oil, bel, ashwagandha, kateri, haldi, til oil. Fragrance-free.",
    description: "100% natural ingredients: sea buckthorn oil, bel, ashwagandha, kateri, haldi, til oil. Fragrance-free, no harmful chemicals. For joints and muscles.",
    ingredients: "100% natural: sea buckthorn oil, bel, ashwagandha, kateri, haldi, til oil. Fragrance-free.",
    image: "assets/products/pain-oil.jpg", category: "addon",
    color: "#b07a3a", animationIcon: "💆",
    ingredientsList: [
      { name: "Sea Buckthorn Oil", icon: "🍊", benefit: "100% natural massage oil for joints and muscles." },
      { name: "Ayurvedic Herbs", icon: "🌿", benefit: "With bel, ashwagandha, kateri, haldi and til oil." },
      { name: "No Chemicals", icon: "✅", benefit: "Fragrance-free, no harmful chemicals." },
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
  { id: "omega", name: "Omega 7 Oil Capsules", purpose: "Focused on Omega 7 and complete cellular nourishment.",
    description: "Sea Buckthorn berry and seed oil capsules delivering the rare Omega 7 with Omega 3, 6 and 9.",
    image: "assets/products/omega-capsules.jpg", audio: "assets/audio/omega.wav", url: "product.html?slug=omega-7-capsules" },
  { id: "faceoil", name: "Nourishing Face Oil", purpose: "Focused on deep skin nourishment and rejuvenation.",
    description: "100% pure CO2-extracted Sea Buckthorn oil, rich in Omega 3, 6, 7 and 9 — the elixir of youth for all skin types.",
    image: "assets/products/face-oil.jpg", audio: "assets/audio/faceoil.wav", url: "product.html?slug=nourishing-face-oil" },
  { id: "tisane", name: "Sea Buckthorn Leaves Tisane", purpose: "Focused on caffeine-free daily refreshment.",
    description: "Pure Ladakh Sea Buckthorn leaves — half a teaspoon brews a vibrant yellow elixir in 5 seconds.",
    image: "assets/products/tisane.jpg", audio: "assets/audio/tisane.wav", url: "product.html?slug=tisane-leaf-tea" },
  { id: "dentowin", name: "Dentowin Herbal Toothpaste", purpose: "Focused on natural oral care.",
    description: "Plant-based toothpaste with sea buckthorn, neem, tulsi, elaichi and 21 herbal ingredients. Sulphate and fluoride free.",
    image: "assets/products/dentowin-100.jpg", audio: "assets/audio/dentowin.wav", url: "product.html?slug=dentowin-100" },
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

/* Resolve media and detail-page paths for the static artifact's asset-hosted subpages. */
var PAGE_IN_ASSETS = /\/assets\/[^/]+\.html$/.test(window.location.pathname);
if (PAGE_IN_ASSETS) {
  PRODUCTS.forEach(function (p) { p.image = p.image.replace(/^assets\//, ""); });
  LISTEN_PRODUCTS.forEach(function (p) {
    p.image = p.image.replace(/^assets\//, "");
    p.audio = p.audio.replace(/^assets\//, "");
  });
  PARTNER_MODELS.forEach(function (m) { m.audio = m.audio.replace(/^assets\//, ""); });
} else {
  LISTEN_PRODUCTS.forEach(function (p) { p.url = "assets/" + p.url; });
}
