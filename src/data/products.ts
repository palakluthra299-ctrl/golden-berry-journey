import pulpImg from "@/assets/products/pulp.jpg";
import fitwellImg from "@/assets/products/fitwell.jpg";
import diawellImg from "@/assets/products/diawell.jpg";
import powerxImg from "@/assets/products/powerx.jpg";
import femwellImg from "@/assets/products/femwell.jpg";
import turmericImg from "@/assets/products/turmeric.jpg";
import omegaImg from "@/assets/products/omega-capsules.jpg";
import faceOilImg from "@/assets/products/face-oil.jpg";
import tisaneImg from "@/assets/products/tisane.jpg";

export interface Ingredient {
  name: string;
  icon: string;
  benefit: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string;
  ingredientsList: Ingredient[];
  image: string;
  category: "concentrate" | "addon";
  color: string;
  animationIcon: string;
}

export const products: Product[] = [
  {
    slug: "sea-buckthorn-pulp",
    name: "Sea Buckthorn Pulp",
    tagline: "The Root of All Nutrition",
    description: "99.9% pure Sea Buckthorn Pulp harvested from bushes whose roots dig 200 ft deep into Ladakh's mineral-rich soil, gathering extraordinary nutrition from the pristine Himalayan earth.",
    ingredients: "99.9% Sea Buckthorn Pulp, rich in fruit oil.",
    ingredientsList: [
      { name: "Sea Buckthorn Pulp", icon: "🍊", benefit: "190+ bioactive compounds, 99.9% pure pulp from Ladakh's 11,500 ft altitude bushes." },
      { name: "Natural Fruit Oil", icon: "💧", benefit: "Rich in Omega 3, 6, 7 & 9 for cellular nourishment and skin health." },
      { name: "Vitamin C", icon: "🌟", benefit: "12x more Vitamin C than oranges, boosting immunity naturally." },
    ],
    image: pulpImg,
    category: "concentrate",
    color: "30 80% 54%",
    animationIcon: "🌿",
  },
  {
    slug: "fitwell",
    name: "Fitwell",
    tagline: "Ignite Your Metabolism",
    description: "A powerful blend that combines Sea Buckthorn with Garcinia Cambogia and Kokum to naturally boost fat oxidation and support healthy weight management.",
    ingredients: "Sea Buckthorn, Hydroxycitric acid (Garcinia cambogia), and Kokum.",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Rich in Omega-7 which supports healthy metabolism and fat breakdown." },
      { name: "Garcinia Cambogia (HCA)", icon: "🍋", benefit: "Hydroxycitric acid blocks fat-producing enzymes and suppresses appetite." },
      { name: "Kokum", icon: "🫐", benefit: "Garcinol-rich superfruit that aids fat oxidation and weight management." },
    ],
    image: fitwellImg,
    category: "concentrate",
    color: "20 85% 50%",
    animationIcon: "🔥",
  },
  {
    slug: "diawell",
    name: "Diawell",
    tagline: "Your Immune Shield",
    description: "Traditional Ayurvedic powerhouses unite with Sea Buckthorn to create a protective shield for blood glucose management and kidney health.",
    ingredients: "Sea Buckthorn, Karela, Chirata, Jamun, and Punarnava.",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Antioxidant powerhouse that protects cells from free radical damage." },
      { name: "Karela (Bitter Gourd)", icon: "🥒", benefit: "Natural insulin-like compound that helps regulate blood glucose levels." },
      { name: "Chirata", icon: "🌿", benefit: "Ayurvedic bitter herb that supports liver function and blood purification." },
      { name: "Jamun", icon: "🫐", benefit: "Rich in jamboline which helps convert starch into energy, managing sugar spikes." },
      { name: "Punarnava", icon: "🌱", benefit: "Kidney-protective herb that supports renal health and reduces water retention." },
    ],
    image: diawellImg,
    category: "concentrate",
    color: "152 52% 36%",
    animationIcon: "🛡️",
  },
  {
    slug: "power-x",
    name: "Power-X",
    tagline: "Legendary Stamina",
    description: "Inspired by the endurance of Genghis Khan's 13th-century warriors, Power-X combines seven potent herbs with Sea Buckthorn for unmatched vitality and stamina.",
    ingredients: "Sea Buckthorn, Konch Beej, Safed Musli, Gokhru, Akarkara, Salam Panja, and Ashwagandha.",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Energy-boosting superfruit trusted by Genghis Khan's army for endurance." },
      { name: "Konch Beej", icon: "🌰", benefit: "Natural source of L-DOPA, enhances stamina and vitality." },
      { name: "Safed Musli", icon: "🌿", benefit: "Ayurvedic adaptogen known to boost strength and physical performance." },
      { name: "Gokhru", icon: "🌾", benefit: "Supports testosterone levels naturally for energy and muscle health." },
      { name: "Akarkara", icon: "🔥", benefit: "Stimulant herb that improves blood circulation and nervous system." },
      { name: "Salam Panja", icon: "🖐️", benefit: "Rare Himalayan orchid used as a tonic for overall physical wellness." },
      { name: "Ashwagandha", icon: "💪", benefit: "King of Ayurvedic herbs — reduces stress and boosts endurance significantly." },
    ],
    image: powerxImg,
    category: "concentrate",
    color: "15 70% 45%",
    animationIcon: "⚔️",
  },
  {
    slug: "femwell",
    name: "Femwell",
    tagline: "Gentle Vitality for Women",
    description: "A nurturing blend of Ayurvedic herbs specifically formulated for women's gynecological health, hormonal balance, and overall vitality.",
    ingredients: "Sea Buckthorn, Shatavari, Daru Haldi, Ashok Chhal, and Dashmool.",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Omega-rich berry that supports skin glow and hormonal wellness." },
      { name: "Shatavari", icon: "🌸", benefit: "Queen of herbs for women — balances hormones and supports reproductive health." },
      { name: "Daru Haldi", icon: "🌿", benefit: "Anti-inflammatory root that aids in gynecological wellness and skin clarity." },
      { name: "Ashok Chhal", icon: "🌳", benefit: "Sacred bark used for centuries to support menstrual health and uterine toning." },
      { name: "Dashmool", icon: "🍃", benefit: "Ten-root blend that reduces inflammation and supports overall female vitality." },
    ],
    image: femwellImg,
    category: "concentrate",
    color: "340 60% 55%",
    animationIcon: "🌸",
  },
  {
    slug: "turmeric-blend",
    name: "Turmeric Blend",
    tagline: "The Golden Infusion",
    description: "Advanced Super Critical CO2 extracted Turmeric Oil meets Sea Buckthorn in this golden infusion, delivering maximum bioavailable curcuminoids for powerful anti-inflammatory support.",
    ingredients: "Sea Buckthorn and Turmeric oil (Advanced Super Critical CO2 extraction).",
    ingredientsList: [
      { name: "Sea Buckthorn", icon: "🍊", benefit: "Golden berry base rich in vitamins A, C, E and essential fatty acids." },
      { name: "Turmeric Oil (CO2 Extracted)", icon: "✨", benefit: "Super Critical CO2 extraction preserves maximum curcuminoids for powerful anti-inflammatory action." },
    ],
    image: turmericImg,
    category: "concentrate",
    color: "45 90% 50%",
    animationIcon: "✨",
  },
  {
    slug: "omega-7-capsules",
    name: "Omega 7 Oil Capsules",
    tagline: "Rich in Omega 7",
    description: "Premium capsules containing Sea Buckthorn berry and seed oil, delivering the rare Omega 7 fatty acid along with Omega 3, 6 & 9 for complete cellular nourishment.",
    ingredients: "Sea Buckthorn berry and seed oil.",
    ingredientsList: [
      { name: "Sea Buckthorn Berry Oil", icon: "🍊", benefit: "Rich in rare Omega-7 (Palmitoleic acid) that supports mucous membranes and skin." },
      { name: "Sea Buckthorn Seed Oil", icon: "🌰", benefit: "Contains balanced Omega 3, 6 & 9 for heart health and cellular repair." },
    ],
    image: omegaImg,
    category: "addon",
    color: "35 75% 50%",
    animationIcon: "💊",
  },
  {
    slug: "nourishing-face-oil",
    name: "Nourishing Face Oil",
    tagline: "Elixir of Youth",
    description: "100% pure Supercritical CO2 extracted Sea Buckthorn oil, rich in Omega 3, 6, 7 & 9. A luxurious facial oil that deeply nourishes and rejuvenates all skin types.",
    ingredients: "100% pure Sea Buckthorn based Nourishing Oil with Omega 3, 6, 7 & 9.",
    ingredientsList: [
      { name: "Sea Buckthorn Oil (CO2)", icon: "💧", benefit: "100% pure cold-extracted oil that deeply penetrates skin for anti-aging benefits." },
      { name: "Omega 3 & 6", icon: "🧬", benefit: "Essential fatty acids that repair skin barrier and lock in moisture." },
      { name: "Omega 7 & 9", icon: "✨", benefit: "Rare Omega-7 regenerates skin cells; Omega-9 keeps skin supple and youthful." },
    ],
    image: faceOilImg,
    category: "addon",
    color: "25 65% 40%",
    animationIcon: "💧",
  },
  {
    slug: "tisane-leaf-tea",
    name: "Sea Buckthorn Leaves Tisane",
    tagline: "Mountain Freshness in a Cup",
    description: "Caffeine-free tisane made from pure Sea Buckthorn leaves harvested in Ladakh. Just half a teaspoon brews into a vibrant yellow elixir in 5 seconds.",
    ingredients: "Sea Buckthorn leaves.",
    ingredientsList: [
      { name: "Sea Buckthorn Leaves", icon: "🍃", benefit: "Caffeine-free, antioxidant-rich leaves that brew into a vibrant yellow healing elixir in just 5 seconds." },
    ],
    image: tisaneImg,
    category: "addon",
    color: "85 50% 45%",
    animationIcon: "🍵",
  },
];

export const getWhatsAppLink = (productName: string, customMessage?: string) => {
  const phone = "918299542169";
  const message = customMessage || `Namaste Vandana! I am very interested in your WellWith ${productName}. Please tell me more about its ingredients.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
