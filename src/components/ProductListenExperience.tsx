import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Headphones, Pause, Play, RotateCcw, X, MessageCircle } from "lucide-react";
import { listenProducts, listenOrderLink } from "@/data/listenProducts";

const ProductListenExperience = () => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const product = listenProducts[index];
  const isFirst = index === 0;
  const isLast = index === listenProducts.length - 1;

  const stopAudio = () => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setPlaying(false);
  };

  const closeModal = () => {
    stopAudio();
    setOpen(false);
  };

  const openModal = () => {
    stopAudio();
    setOpen(true);
  };

  // start playback once the modal audio element mounts
  useEffect(() => {
    if (!open) return;
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [open, product.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const replay = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const go = (dir: number) => {
    stopAudio();
    setIndex((i) => Math.min(listenProducts.length - 1, Math.max(0, i + dir)));
  };

  return (
    <section
      id="showcase"
      className="relative py-16 md:py-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 25%, hsl(var(--emerald) / 0.16) 0%, hsl(var(--background)) 68%)",
      }}
    >
      <div className="container mx-auto px-4 relative max-w-3xl">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Listen &amp; Discover
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
            Know Your Product in 30 Seconds
          </h2>
        </div>

        {/* Product card */}
        <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur p-6 md:p-8 shadow-[0_18px_50px_-20px_hsl(var(--golden-glow)/0.35)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              <div className="h-52 sm:h-64 md:h-72 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="max-h-full w-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)]"
                />
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-5">
                {product.name}
              </h3>
              <p className="text-muted-foreground mt-2 max-w-md text-sm md:text-base">
                {product.purpose}
              </p>

              <button
                onClick={openModal}
                className="mt-6 inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.99] min-h-[52px]"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--emerald)) 0%, hsl(var(--golden)) 100%)",
                  boxShadow: "0 12px 32px -10px hsl(var(--golden-glow) / 0.6)",
                }}
              >
                <Headphones className="w-5 h-5" />
                Listen About This
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 mt-8">
            <button
              onClick={() => go(-1)}
              disabled={isFirst}
              aria-label="Previous product"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full border border-border bg-background/60 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed min-h-[48px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="text-sm font-semibold text-muted-foreground tabular-nums">
              {index + 1} / {listenProducts.length}
            </span>

            <button
              onClick={() => go(1)}
              disabled={isLast}
              aria-label="Next product"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full border border-border bg-background/60 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed min-h-[48px]"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={closeModal}
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`About ${product.name}`}
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full sm:max-w-[460px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl"
            >
              <button
                onClick={closeModal}
                aria-label="Close"
                className="absolute right-4 top-4 w-9 h-9 rounded-full border border-border bg-background/70 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="h-36 sm:h-40 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
                />
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground text-center mt-4">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm text-center mt-2">
                {product.description}
              </p>

              {/* Audio player */}
              <div className="mt-5 rounded-2xl border border-border/70 bg-background/60 p-4">
                {product.audio ? (
                  <>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        aria-label={playing ? "Pause audio" : "Play audio"}
                        className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-primary-foreground"
                        style={{
                          background:
                            "linear-gradient(135deg, hsl(var(--emerald)) 0%, hsl(var(--golden)) 100%)",
                        }}
                      >
                        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>

                      {/* playing indicator */}
                      <div className="flex items-end gap-1 h-8 flex-1">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <motion.span
                            key={i}
                            className="flex-1 rounded-full bg-primary/70"
                            animate={
                              playing
                                ? { height: ["25%", "100%", "40%"] }
                                : { height: "22%" }
                            }
                            transition={
                              playing
                                ? {
                                    duration: 0.7 + i * 0.08,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                  }
                                : { duration: 0.2 }
                            }
                            style={{ height: "22%" }}
                          />
                        ))}
                      </div>

                      <button
                        onClick={replay}
                        aria-label="Replay audio"
                        className="w-10 h-10 shrink-0 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground mt-3">
                      {playing ? "Playing audio…" : "Tap play to listen"}
                    </p>

                    <audio
                      ref={audioRef}
                      src={product.audio}
                      preload="auto"
                      onEnded={() => setPlaying(false)}
                      onPause={() => setPlaying(false)}
                      onPlay={() => setPlaying(true)}
                    />
                  </>
                ) : (
                  <p className="text-sm text-center text-muted-foreground">
                    Audio coming soon for this product.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 min-h-[52px] rounded-full border border-border bg-background/60 font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Close
                </button>
                <a
                  href={listenOrderLink(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[52px] rounded-full inline-flex items-center justify-center gap-2 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--emerald)) 0%, hsl(var(--golden)) 100%)",
                    boxShadow: "0 12px 30px -10px hsl(var(--golden-glow) / 0.6)",
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Order Now
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductListenExperience;
