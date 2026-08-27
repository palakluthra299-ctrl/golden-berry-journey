export const PARTNER_CONTACT_NAME = "Palak Luthra";
export const PARTNER_CONTACT_PHONE = "9266086554";
const PARTNER_WA_PHONE = "919266086554";

export type PartnerIcon = "community" | "franchise" | "b2b";

export interface PartnerModel {
  id: string;
  name: string;
  icon: PartnerIcon;
  tagline: string;
  benefits: string[];
  message: string;
  whyWellWith: string[];
  /** enquiry destination — WhatsApp to Palak Luthra (9266086554) */
  enquiryLabel: string;
  /** audio served from the production public/ directory */
  audio: string;
}

export const partnerModels: PartnerModel[] = [
  {
    id: "community-partner",
    name: "Community Partner",
    icon: "community",
    tagline: "Start with your community and grow your wellness business.",
    benefits: [
      "No previous experience needed",
      "Training & mentorship",
      "Retail + incentive opportunities",
    ],
    message: "A simple way to start with your own network and community.",
    whyWellWith: [
      "Simple entry: Sign Up, Train, Earn and Scale",
      "Training and mentorship stated for new partners",
      "Seabuckthorn wellness portfolio to take to your network",
    ],
    enquiryLabel: "Community Partner enquiry",
    audio: "/community_partner_audio.wav",
  },
  {
    id: "franchise-owner",
    name: "Franchise Owner",
    icon: "franchise",
    tagline: "Build a larger WellWith business in your city.",
    benefits: ["Territory rights", "Branding & marketing support", "Setup + training"],
    message: "A larger-scale business model for building WellWith in your city.",
    whyWellWith: [
      "Territory rights and regional exclusivity stated by the company",
      "Branding, marketing, setup and training support",
      "Structured setup with an established wellness brand",
    ],
    enquiryLabel: "Franchise Query",
    audio: "/franchise_owner_audio.wav",
  },
  {
    id: "b2b-partner",
    name: "B2B Partner",
    icon: "b2b",
    tagline: "Connect WellWith with your existing business or organisation.",
    benefits: ["Bulk Supply", "Private / White Label", "Institutional & R&D collaboration"],
    message:
      "A collaboration model for businesses that already have an organisation, network or infrastructure.",
    whyWellWith: [
      "Bulk supply and private / white label options listed",
      "Institutional tie-ups and R&D collaboration",
      "Seabuckthorn-based portfolio for category expansion",
    ],
    enquiryLabel: "B2B Query",
    audio: "/b2b_partner_audio.wav",
  },
];

export const partnerEnquiryLink = (model: PartnerModel) =>
  `https://wa.me/${PARTNER_WA_PHONE}?text=${encodeURIComponent(
    `Namaste ${PARTNER_CONTACT_NAME}, I want to explore the WellWith ${model.name} model (${model.enquiryLabel}). Please share details.`
  )}`;

export const whyWellWithPoints = [
  {
    title: "1M+ Users",
    detail: "WellWith Business states that it has over 1 million users across 15 nations.",
  },
  {
    title: "Ladakh Seabuckthorn",
    detail: "The company says its Seabuckthorn is handpicked from the valleys of Ladakh.",
  },
  {
    title: "Research & Quality Focus",
    detail:
      "WellWith Business highlights science-backed product development and lab-certified purity.",
  },
  {
    title: "Business Support",
    detail: "Training, mentorship and digital-first support are highlighted for entrepreneurs.",
  },
  {
    title: "Established Models",
    detail:
      "Community Partner, Franchise Owner and B2B Partner options give different ways to work with WellWith.",
  },
];
