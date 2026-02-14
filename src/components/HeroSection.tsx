import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-end pb-20 pt-16 overflow-hidden">
      <img
        src={heroBg}
        alt="Sea Buckthorn berries in Ladakh mountains"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="gradient-hero absolute inset-0" />

      <div className="container mx-auto px-4 relative z-10">
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
            className="inline-block text-golden-light text-sm font-semibold uppercase tracking-[0.3em] mb-4"
          >
            From the Himalayas of Ladakh
          </motion.span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Nature's{" "}
            <span className="text-gradient-golden">Golden</span>
            <br />
            Super Fruit
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-lg mb-8 font-body">
            Pure Sea Buckthorn wellness from 11,500 ft above sea level. 
            Trusted by DRDO scientists and Russian cosmonauts. Now, from our hills to your home.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="gradient-golden text-primary-foreground px-8 py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-block"
            >
              Explore Products
            </a>
            <a
              href={`https://wa.me/919266086554?text=${encodeURIComponent("Namaste Palak! I want to learn more about WellWith Sea Buckthorn products.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary-foreground/30 text-primary-foreground px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-primary-foreground/10 transition-colors inline-block"
            >
              Chat with Us
            </a>
          </div>
        </motion.div>
      </div>

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
