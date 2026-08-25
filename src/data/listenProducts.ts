import pulpImg from "@/assets/products/pulp.jpg";
import turmericImg from "@/assets/products/turmeric.jpg";
import fitwellImg from "@/assets/products/fitwell.jpg";
import diawellImg from "@/assets/products/diawell.jpg";
import powerxImg from "@/assets/products/powerx.jpg";
import femwellImg from "@/assets/products/femwell.jpg";

import pulpAudio from "@/assets/audio/pulp.wav.asset.json";
import turmericAudio from "@/assets/audio/Turmuricoil.wav.asset.json";
import fitwellAudio from "@/assets/audio/fitwell.wav.asset.json";
import diawellAudio from "@/assets/audio/diawell.wav.asset.json";
import powerxAudio from "@/assets/audio/power_x.wav.asset.json";
import femwellAudio from "@/assets/audio/femwell.wav.asset.json";

export interface ListenProduct {
  /** stable key, also used as the audio placeholder name */
  id: string;
  name: string;
  /** one-line purpose shown on the card */
  purpose: string;
  /** short benefit-focused description shown inside the popup */
  description: string;
  image: string;
  /** audio file URL — replace with your own file anytime */
  audio: string | null;
  /** optional link to the full product page */
  url?: string;
}

export const listenProducts: ListenProduct[] = [
  {
    id: "pulp_audio",
    name: "Sea Buckthorn Pulp",
    purpose: "Daily overall wellness, immunity and general health support.",
    description:
      "99.9% pure Ladakh Sea Buckthorn pulp — a simple daily spoon for immunity, energy and everyday wellness.",
    image: pulpImg,
    audio: pulpAudio.url,
    url: "/product/sea-buckthorn-pulp",
  },
  {
    id: "turmeric_audio",
    name: "Sea Buckthorn With Turmeric",
    purpose: "Focused on immunity and joint wellness.",
    description:
      "Sea Buckthorn blended with CO2-extracted turmeric oil for comfortable joints and steady immune support.",
    image: turmericImg,
    audio: turmericAudio.url,
    url: "/product/turmeric-blend",
  },
  {
    id: "fitwell_audio",
    name: "Sea Buckthorn FitWell",
    purpose: "Focused on metabolism and weight-management support.",
    description:
      "Sea Buckthorn with Garcinia and Kokum to support a healthy metabolism and weight-management routine.",
    image: fitwellImg,
    audio: fitwellAudio.url,
    url: "/product/fitwell",
  },
  {
    id: "diawell_audio",
    name: "Sea Buckthorn DiaWell",
    purpose: "Focused on blood-sugar and metabolic wellness.",
    description:
      "Karela, Jamun, Chirata and Punarnava with Sea Buckthorn — traditional herbs for metabolic wellness.",
    image: diawellImg,
    audio: diawellAudio.url,
    url: "/product/diawell",
  },
  {
    id: "powerx_audio",
    name: "Sea Buckthorn Power X",
    purpose: "Men's stamina, energy and vitality support.",
    description:
      "Seven Ayurvedic herbs including Ashwagandha and Safed Musli with Sea Buckthorn for stamina and vitality.",
    image: powerxImg,
    audio: powerxAudio.url,
    url: "/product/power-x",
  },
  {
    id: "femwell_audio",
    name: "Sea Buckthorn FemWell",
    purpose: "Women's wellness and hormonal health support.",
    description:
      "Shatavari, Ashok Chhal and Dashmool with Sea Buckthorn — a gentle blend for women's everyday balance.",
    image: femwellImg,
    audio: femwellAudio.url,
    url: "/product/femwell",
  },
];

export const listenOrderLink = (productName: string) =>
  `https://wa.me/919266086554?text=${encodeURIComponent(
    `Hello Palak Luthra, humne ${productName} ke baare mein suna hai and I want to order. Please share details.`
  )}`;
