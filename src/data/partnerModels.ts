export interface PartnerModel {
  id: string;
  name: string;
  tagline: string;
  benefits: string[];
  message: string;
  why: string[];
  /** production-safe public path */
  audio: string;
  /** icon key handled in the component */
  icon: "community" | "franchise" | "b2b";
  /** enquiry label used in the WhatsApp message */
  enquiry: string;
}

export const PARTNER_CONTACT_NAME = "Palak Luthra";
export const PARTNER_CONTACT_PHONE = "9266086554";

export const partnerModels: PartnerModel[] = [
  {
    id: "community-partner",
    name: "Community Partner",
    tagline: "Start with your community and grow your wellness business.",
    benefits: [
      "No previous experience needed",
      "Training & mentorship",
      "Retail + incentive opportunities",
    ],
    message: "A simple way to start with your own network and community.",
    why: [
      "Simple entry model — Sign Up, Train, Earn, Scale",
      "Training and mentorship support for beginners",
      "Company-stated retail and incentive opportunities",
    ],
    audio: "/communitypartner.wav",
    icon: "community",
    enquiry: "Community Partner enquiry",
  },
  {
    id: "franchise-owner",
    name: "Franchise Owner",
    tagline: "Build a larger WellWith business in your city.",
    benefits: ["Territory rights", "Branding & marketing support", "Setup + training"],
    message: "A larger-scale business model for building WellWith in your city.",
    why: [
      "Territory rights and regional exclusivity as listed by the company",
      "Branding, marketing and setup support",
      "Full Seabuckthorn product portfolio access",
    ],
    audio: "/franchisebusiness.wav",
    icon: "franchise",
    enquiry: "Franchise Query",
  },
  {
    id: "b2b-partner",
    name: "B2B Partner",
    tagline: "Connect WellWith with your existing business or organisation.",
    benefits: ["Bulk Supply", "Private / White Label", "Institutional & R&D collaboration"],
    message:
      "A collaboration model for businesses that already have an organisation, network or infrastructure.",
    why: [
      "Bulk supply and private / white-label options",
      "Institutional tie-ups and R&D collaboration",
      "Seabuckthorn-based portfolio for category expansion",
    ],
    audio: "/B2B.wav",
    icon: "b2b",
    enquiry: "B2B Query",
  },
];

export const whyWellWith = [
  {
    title: "1M+ Users",
    text: "WellWith Business states that it has over 1 million users across 15 nations.",
  },
  {
    title: "Ladakh Seabuckthorn",
    text: "The company says its Seabuckthorn is handpicked from the valleys of Ladakh.",
  },
  {
    title: "Research & Quality Focus",
    text: "Science-backed product development and lab-certified purity are highlighted.",
  },
  {
    title: "Business Support",
    text: "Training, mentorship and digital-first support are highlighted for entrepreneurs.",
  },
  {
    title: "3 Partnership Models",
    text: "Community Partner, Franchise Owner and B2B Partner provide different ways to explore working with WellWith.",
  },
];

export const partnerEnquiryLink = (model: PartnerModel) =>
  `https://wa.me/91${PARTNER_CONTACT_PHONE}?text=${encodeURIComponent(
    `Hello ${PARTNER_CONTACT_NAME}, humne ${model.name} ke baare mein suna hai and I want to know more. Please share details.`
  )}`;
