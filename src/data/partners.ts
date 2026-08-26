export interface PartnerModel {
  id: string;
  name: string;
  /** one-line explanation shown on the card */
  tagline: string;
  /** what it means, in simple language */
  whatItMeans: string;
  /** why WellWith for this model (company-stated) */
  whyWellWith: string;
  /** 3-4 key benefits */
  benefits: string[];
  /** the "main baat" takeaway line */
  mainPoint: string;
  /** optional simple flow steps */
  flow?: string[];
  /** icon key rendered by the UI */
  icon: "community" | "franchise" | "b2b";
  /** audio file URL — replace anytime */
  audio: string | null;
  /** primary CTA label */
  ctaLabel: string;
  /** WhatsApp pre-filled message */
  whatsappMessage: string;
}

export const partnerIntroAudio = "/audio/community-partner.wav";

export const partnerModels: PartnerModel[] = [
  {
    id: "community_partner_audio",
    name: "Community Partner",
    tagline: "Start with your community and grow your wellness business.",
    whatItMeans:
      "Apne friends, family aur local community tak WellWith ke products pahunchakar wellness business ki shuruaat karein.",
    whyWellWith:
      "WellWith Business ke according is model mein koi previous experience zaroori nahi hai, low investment se shuruaat hoti hai, retail + incentive earning opportunities hain, aur training & mentorship available hai. Do community models bhi diye gaye hain — S2S (Student-to-Student) aur M2M (Mother-to-Mother).",
    benefits: [
      "No experience needed",
      "Low investment start",
      "Retail + incentive opportunities",
      "Training & mentorship (S2S / M2M)",
    ],
    mainPoint:
      "Agar aap apne network se shuruaat karna chahte hain, Community Partner simple entry point hai.",
    flow: ["Sign Up", "Train", "Earn", "Scale"],
    icon: "community",
    audio: "/audio/community-partner.wav",
    ctaLabel: "Become a Community Partner",
    whatsappMessage:
      "Hello Vandana, maine WellWith Community Partner ke baare mein suna hai and I want to know more. Please share details.",
  },
  {
    id: "franchise_owner_audio",
    name: "Franchise Owner",
    tagline: "Build a larger WellWith business in your city.",
    whatItMeans:
      "Agar aap apne city mein WellWith ka business larger scale par build karna chahte hain, to franchise model explore karein.",
    whyWellWith:
      "Franchise Owner page par WellWith Business territory rights, complete product portfolio, branding & marketing support, regional exclusivity, setup + training aur multiple revenue streams ko highlight karta hai. Ye company-stated benefits hain, guaranteed outcomes nahi.",
    benefits: [
      "Territory rights & regional exclusivity",
      "Full product portfolio access",
      "Branding & marketing support",
      "Setup + training assistance",
    ],
    mainPoint:
      "Agar aap apne city mein WellWith ko business level par build karna chahte hain, Franchise Owner option dekhein.",
    icon: "franchise",
    audio: "/audio/franchise-owner.wav",
    ctaLabel: "Franchise Query",
    whatsappMessage:
      "Hello Vandana, maine WellWith Franchise Owner opportunity ke baare mein suna hai and I want to know more. Please share details.",
  },
  {
    id: "b2b_partner_audio",
    name: "B2B Partner",
    tagline: "Connect WellWith with your existing business or organisation.",
    whatItMeans:
      "Agar aapka already business, company, institution ya professional network hai, to WellWith ke saath business collaboration explore karein.",
    whyWellWith:
      "B2B page par collaboration models listed hain — Bulk Supply, Private/White Label, Institutional Tie-ups aur R&D Collaboration. Saath hi broad Seabuckthorn portfolio, modern manufacturing & compliance aur government/corporate customers ka trust highlight kiya gaya hai.",
    benefits: [
      "Bulk supply",
      "Private / white label",
      "Institutional tie-ups",
      "R&D collaboration",
    ],
    mainPoint:
      "Agar aapka existing business hai, WellWith ke saath B2B collaboration ka option explore karein.",
    icon: "b2b",
    audio: "/audio/b2b-partner.wav",
    ctaLabel: "B2B Query",
    whatsappMessage:
      "Hello Vandana, maine WellWith B2B Partnership ke baare mein suna hai and I want to know more. Please share details.",
  },
];

export const partnerWhatsAppLink = (message: string) =>
  `https://wa.me/918299542169?text=${encodeURIComponent(message)}`;

export const whyWellWithReasons = [
  {
    title: "Strong Product Base",
    text: "Seabuckthorn-based wellness products with a portfolio built around different wellness needs.",
  },
  {
    title: "Established Scale",
    text: "WellWith describes itself as India's largest Seabuckthorn manufacturer.",
  },
  {
    title: "Research & Quality Focus",
    text: "The company says its portfolio is rigorously developed and verified by science, with purity ensured through lab certifications.",
  },
  {
    title: "Business Support",
    text: "Training, digital-first tools and established entrepreneurship models are available.",
  },
  {
    title: "Real Brand Reach",
    text: "WellWith states that it has over 1 million users across 15 nations.",
  },
];

export const trustRow = [
  { label: "1M+ Users", note: "across 15 nations, as stated by WellWith Business" },
  { label: "Ladakh Seabuckthorn", note: "handpicked from the valleys of Ladakh" },
  { label: "Research-Backed", note: "rigorously developed and verified by science" },
  { label: "Trusted by Experts", note: "endorsed and used by major hospitals and doctors nationwide" },
  { label: "Digital Support", note: "training and digital-first tools for entrepreneurs" },
  { label: "Made in India", note: "quality products manufactured locally" },
  { label: "Quick Incentives", note: "incentive programs and customer-centric service" },
];
