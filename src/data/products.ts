import pulpImg from "@/assets/products/pulp.jpg";
import fitwellImg from "@/assets/products/fitwell.jpg";
import diawellImg from "@/assets/products/diawell.jpg";
import powerxImg from "@/assets/products/powerx.jpg";
import femwellImg from "@/assets/products/femwell.jpg";
import turmericImg from "@/assets/products/turmeric.jpg";
import omegaImg from "@/assets/products/omega-capsules.jpg";
import faceOilImg from "@/assets/products/face-oil.jpg";
import tisaneImg from "@/assets/products/tisane.jpg";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string;
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
    image: tisaneImg,
    category: "addon",
    color: "85 50% 45%",
    animationIcon: "🍵",
  },
];

export const sendWhatsAppLead = (productName: string, customMessage?: string) => {
  const phone = "919266086554";
  const message = customMessage || `Namaste Palak! I am very interested in your WellWith ${productName}. Please tell me more about its ingredients.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
};
