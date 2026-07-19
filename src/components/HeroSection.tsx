import { motion, useScroll, useTransform } from "framer-motion";
import { Mountain, ShieldCheck, Leaf, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import SolutionFinderCTA from "@/components/SolutionFinderCTA";

const trustBadges = [
  { icon: Mountain, label: "11,500 ft Altitude" },
  { icon: ShieldCheck, label: "DRDO Verified" },
  { icon: Leaf, label: "100% Natural" },
  { icon: Sparkles, label: "No Preservatives" },
];

const HeroSection = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 120]);
  const bgScale = useTransform(scrollY, [0, 600], [1.05, 1.2]);
  const contentY = useTransform(scrollY, [0, 600], [0, -40]);

  return (
    <section className="relative min-h-screen flex items-end pb-20 pt-16 overflow-hidden">
      <motion.img
        src={heroBg}
        alt="Sea Buckthorn berries in Ladakh mountains"
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 w-full h-full object-cover will-change-transform brightness-90 md:brightness-100"
      />
      <div className="gradient-hero absolute inset-0" />
      {/* Extra readability veil behind text on mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent md:from-background/70" />

      <motion.div style={{ y: contentY }} className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block text-golden-light text-sm font-semibold uppercase tracking-[0.3em] mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          >
            From the Himalayas of Ladakh
          </motion.span>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-[1.02] tracking-tight mb-6"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.55)" }}
          >
            Nature's{" "}
            <span className="text-gradient-golden">Golden</span>
            <br />
            Super Fruit
          </h1>
          <p
            className="text-lg md:text-xl text-primary-foreground/90 max-w-lg mb-8 font-body leading-relaxed"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            Pure Sea Buckthorn wellness from 11,500 ft above sea level.
            Trusted by DRDO scientists and Russian cosmonauts. Now, from our hills to your home.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="gradient-golden primary-pulse text-primary-foreground px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_hsl(var(--golden)/0.55)] inline-block"
            >
              Explore Products
            </a>
            <SolutionFinderCTA variant="hero" />
            <a
              href={`https://wa.me/919266086554?text=${encodeURIComponent("Namaste Palak! I want to learn more about WellWith Sea Buckthorn products.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary-foreground/40 bg-background/10 backdrop-blur-sm text-primary-foreground px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-primary-foreground/15 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] inline-block"
            >
              Chat with Us
            </a>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-2.5"
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-primary-foreground/90 bg-background/30 backdrop-blur-md border border-primary-foreground/15"
              >
                <Icon className="w-3.5 h-3.5 text-golden-light" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating berries decoration */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-10 text-5xl hidden lg:block"
      >
        🍊
      </motion.div>
      <motion.div
        animate={{ y: [5, -8, 5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-52 right-32 text-3xl hidden lg:block"
      >
        🍊
      </motion.div>
    </section>
  );
};

export default HeroSection;
