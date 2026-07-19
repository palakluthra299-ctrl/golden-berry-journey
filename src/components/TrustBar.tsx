import { Star, Users, Award, Truck, ShieldCheck, Leaf } from "lucide-react";

const items = [
  { icon: Users, text: "10,000+ Happy Customers" },
  { icon: Star, text: "4.9 / 5 Average Rating" },
  { icon: Award, text: "DRDO Verified Formula" },
  { icon: ShieldCheck, text: "Lab Tested Purity" },
  { icon: Leaf, text: "100% Natural Ingredients" },
  { icon: Truck, text: "Free Shipping Pan-India" },
];

const TrustBar = () => {
  const loop = [...items, ...items];
  return (
    <div className="relative border-y border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex whitespace-nowrap animate-marquee py-4">
        {loop.map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-2.5 px-8 text-sm text-foreground/80">
            <Icon className="w-4 h-4 text-primary" />
            <span className="font-medium">{text}</span>
            <span className="text-primary/40 ml-8">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;
