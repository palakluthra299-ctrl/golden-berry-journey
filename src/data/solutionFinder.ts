export interface SolutionProduct {
  name: string;
  why: string;
  tags: string[];
}

export interface ConcernCategory {
  key: string;
  label: string;
  emoji: string;
  keywords: string[];
  products: SolutionProduct[];
}

export const concerns: ConcernCategory[] = [
  {
    key: "skin",
    label: "Skin",
    emoji: "✨",
    keywords: ["skin", "acne", "eczema", "psoriasis", "dryness", "scars", "glow", "aging", "wrinkle", "pimple"],
    products: [
      { name: "Sea Buckthorn Juice (Pulp) 300ml", why: "Deep cellular nourishment for healing skin from within.", tags: ["Omega 3,6,7,9", "Vitamin C"] },
      { name: "Nourishing Oil 10ml", why: "Repairs skin barrier and boosts natural glow.", tags: ["CO2 Extracted", "Rich in Omega-7"] },
      { name: "Night Cream", why: "Overnight regeneration for youthful skin.", tags: ["Anti-aging"] },
      { name: "Moisturizing Cream 50gm", why: "Deep hydration for smooth, supple skin.", tags: ["Hydrating"] },
      { name: "Gentle Face Cleanser", why: "Gently removes impurities without stripping moisture.", tags: ["Sulfate-free"] },
    ],
  },
  {
    key: "hair",
    label: "Hair",
    emoji: "💇",
    keywords: ["hair", "hairfall", "hair fall", "scalp", "dandruff", "bald"],
    products: [
      { name: "Sea Buckthorn Juice (Pulp) 300ml", why: "Nourishes hair follicles from within.", tags: ["Omega-rich"] },
      { name: "Leaf Tea 50gm", why: "Antioxidants strengthen roots and improve scalp health.", tags: ["Caffeine-free"] },
      { name: "Oil Capsules", why: "Rare Omega-7 supports healthy hair growth.", tags: ["Omega 3,6,7,9"] },
    ],
  },
  {
    key: "joint",
    label: "Joint Pain",
    emoji: "🦴",
    keywords: ["joint", "joints", "pain", "inflammation", "arthritis", "knee", "back pain"],
    products: [
      { name: "Pulp with Turmeric Oil 300ml", why: "Powerful anti-inflammatory duo for joint comfort.", tags: ["Curcuminoids"] },
      { name: "Ayurvedic Pain Relief Massage Oil", why: "Direct topical relief for sore joints.", tags: ["Ayurvedic"] },
      { name: "Black Rice", why: "Anti-inflammatory antioxidants for daily wellness.", tags: ["Antioxidants"] },
      { name: "Leaf Tea", why: "Soothing brew that reduces internal inflammation.", tags: ["Herbal"] },
    ],
  },
  {
    key: "gut",
    label: "Gut Health",
    emoji: "🌱",
    keywords: ["gut", "digestion", "digestive", "stomach", "acidity", "bloating", "constipation"],
    products: [
      { name: "Sea Buckthorn Juice (Pulp) 300ml", why: "Soothes and heals the gut lining.", tags: ["190+ compounds"] },
      { name: "Oil Capsules", why: "Omega-7 nurtures mucous membranes of the gut.", tags: ["Gut lining"] },
      { name: "Black Rice", why: "Fiber-rich support for healthy digestion.", tags: ["High Fiber"] },
      { name: "Leaf Tea", why: "Gentle after-meal brew for smoother digestion.", tags: ["Caffeine-free"] },
    ],
  },
  {
    key: "diabetes",
    label: "Diabetes",
    emoji: "🩸",
    keywords: ["diabetes", "sugar", "blood sugar", "glucose", "insulin"],
    products: [
      { name: "DiaWell 300ml", why: "Ayurvedic blend to support healthy blood glucose.", tags: ["Karela", "Jamun"] },
      { name: "Oil Capsules", why: "Supports metabolic health.", tags: ["Omega-7"] },
      { name: "Black Rice", why: "Low glycemic grain for stable sugar levels.", tags: ["Low GI"] },
      { name: "Leaf Tea", why: "Daily brew for glucose balance.", tags: ["Herbal"] },
    ],
  },
  {
    key: "weight",
    label: "Weight Management",
    emoji: "🔥",
    keywords: ["weight", "fat", "obesity", "slim", "loss", "belly"],
    products: [
      { name: "FitWell 300ml", why: "Garcinia + Kokum blend for healthy fat oxidation.", tags: ["HCA", "Metabolism"] },
      { name: "Oil Capsules", why: "Omega-7 supports appetite regulation.", tags: ["Omega-7"] },
      { name: "Leaf Tea", why: "Zero-calorie metabolic booster.", tags: ["Caffeine-free"] },
      { name: "Black Rice", why: "Filling, low-GI grain for weight goals.", tags: ["Low GI"] },
    ],
  },
  {
    key: "men",
    label: "Men's Wellness",
    emoji: "💪",
    keywords: ["men", "man", "stamina", "energy", "vitality", "testosterone", "power"],
    products: [
      { name: "Power X 300ml", why: "7-herb blend for stamina and vitality.", tags: ["Ashwagandha", "Musli"] },
      { name: "Oil Capsules", why: "Cellular energy support.", tags: ["Omega-rich"] },
      { name: "Leaf Tea", why: "Daily wellness brew.", tags: ["Antioxidants"] },
    ],
  },
  {
    key: "women",
    label: "Female Wellness",
    emoji: "🌸",
    keywords: ["women", "woman", "female", "hormone", "period", "menstrual", "pcod", "pcos"],
    products: [
      { name: "FemWell 300ml", why: "Shatavari-based hormonal balance blend.", tags: ["Shatavari", "Ashok"] },
      { name: "Oil Capsules", why: "Supports skin and hormonal wellness.", tags: ["Omega-7"] },
      { name: "Leaf Tea", why: "Calming daily brew.", tags: ["Caffeine-free"] },
    ],
  },
  {
    key: "immunity",
    label: "Immunity",
    emoji: "🛡️",
    keywords: ["immunity", "immune", "cold", "flu", "wellness", "general", "sick"],
    products: [
      { name: "Gummies", why: "Tasty daily immunity boost.", tags: ["Vitamin C"] },
      { name: "Dry Berry Powder", why: "Concentrated antioxidant power.", tags: ["190+ compounds"] },
      { name: "Dry Berry", why: "Whole berry snack for daily wellness.", tags: ["Natural"] },
      { name: "Oil Capsules", why: "Omega-rich immune support.", tags: ["Omega 3,6,7,9"] },
    ],
  },
  {
    key: "sun",
    label: "Sun Protection",
    emoji: "☀️",
    keywords: ["sun", "sunscreen", "tan", "spf", "uv"],
    products: [
      { name: "Sunscreen Lotion SPF 50", why: "Broad-spectrum protection with Sea Buckthorn goodness.", tags: ["SPF 50"] },
    ],
  },
];

export const findConcern = (query: string): ConcernCategory | null => {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  // exact key/label match first
  const exact = concerns.find((c) => c.key === q || c.label.toLowerCase() === q);
  if (exact) return exact;
  // keyword substring match
  for (const c of concerns) {
    if (c.keywords.some((k) => q.includes(k) || k.includes(q))) return c;
  }
  return null;
};

export const suggestions = concerns.flatMap((c) => [c.label, ...c.keywords]).slice(0, 40);
