import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { products } from "@/data/products";

const showcaseProducts = products.filter((p) => p.category === "concentrate");
const AUTOPLAY_MS = 3500;

const ProductShowcase = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % showcaseProducts.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused]);

  const product = showcaseProducts[index];
  const waHref = `https://wa.me/919266086554?text=${encodeURIComponent(
    `Namaste Palak, I'm interested to buy ${product.name}`
  )}`;

  const go = (dir: number) =>
    setIndex((i) => (i + dir + showcaseProducts.length) % showcaseProducts.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section
      id="showcase"
      className="relative py-20 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, hsl(var(--emerald) / 0.18) 0%, hsl(var(--background)) 65%)",
      }}
    >
      {/* golden glow orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, hsl(var(--golden-glow)) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Product Showcase
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Meet the Golden Six
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Bottle */}
          <div className="relative h-[380px] md:h-[460px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={product.slug}
                src={product.image}
                alt={product.name}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                style={{ mixBlendMode: "normal" }}
              />
            </AnimatePresence>

            {/* Arrows */}
            <button
              onClick={() => go(-1)}
              aria-label="Previous product"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/70 backdrop-blur border border-border hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next product"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/70 backdrop-blur border border-border hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Details */}
          <div className="text-center md:text-left min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  {product.tagline}
                </span>
                <h3 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 max-w-md mx-auto md:mx-0">
                  {product.description}
                </p>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-primary-foreground transition-transform hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--emerald)) 0%, hsl(var(--golden)) 100%)",
                    boxShadow: "0 10px 30px -8px hsl(var(--golden-glow) / 0.6)",
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Buy Now
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Thumbnail / dot indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
          {showcaseProducts.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => setIndex(i)}
              aria-label={`Show ${p.name}`}
              className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                i === index
                  ? "border-primary scale-110 shadow-[0_0_20px_hsl(var(--golden-glow)/0.5)]"
                  : "border-border/40 opacity-60 hover:opacity-100"
              }`}
              style={{ width: 56, height: 56 }}
            >
              <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1 bg-card" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
