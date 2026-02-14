import { motion } from "framer-motion";

const steps = [
  {
    icon: "🏔️",
    title: "Harvested in Ladakh",
    desc: "Hand-picked from pristine bushes at 11,500 ft altitude in the Himalayas.",
  },
  {
    icon: "🌿",
    title: "Cold-Pressed Extraction",
    desc: "Berries are cold-pressed within hours to preserve 190+ bioactive compounds.",
  },
  {
    icon: "🧪",
    title: "Lab Tested & Purified",
    desc: "Every batch is tested for purity — no synthetic additives, ever.",
  },
  {
    icon: "🍶",
    title: "Bottled Fresh",
    desc: "Sealed in amber glass to protect nutrients. From hills to your home.",
  },
];

const JuiceMakingAnimation = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            The Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
            From Berry to Bottle
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Every drop of WellWith goes through a meticulous journey to ensure maximum purity and nutrition.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />

          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } flex-row`}
              >
                {/* Dot on timeline */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full gradient-golden border-4 border-background -translate-x-1/2 mt-1 z-10" />

                {/* Content card */}
                <div
                  className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                    isLeft ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
                  >
                    <span className="text-3xl block mb-2">{step.icon}</span>
                    <h3 className="font-bold text-foreground text-lg mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                    <div className="mt-3 text-xs font-semibold text-primary uppercase tracking-wider">
                      Step {i + 1}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JuiceMakingAnimation;
