import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Handshake,
  Headphones,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
  Users,
  X,
} from "lucide-react";
import {
  partnerModels,
  partnerWhatsAppLink,
  trustRow,
  whyWellWithReasons,
  type PartnerModel,
} from "@/data/partners";

const iconFor = (icon: PartnerModel["icon"], className: string) => {
  if (icon === "community") return <Users className={className} />;
  if (icon === "franchise") return <Building2 className={className} />;
  return <Handshake className={className} />;
};

const PartnerWithUs = () => {
  const [active, setActive] = useState<PartnerModel | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setPlaying(false);
  };

  const close = () => {
    stopAudio();
    setActive(null);
  };

  useEffect(() => {
    if (!active) return;
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [active?.id]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

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

  return (
    <section id="partner" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div
          className="rounded-3xl border border-primary/25 p-6 md:p-12"
          style={{
            background:
              "radial-gradient(ellipse at 15% 0%, hsl(var(--golden) / 0.14) 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, hsl(var(--emerald) / 0.16) 0%, transparent 55%), hsl(var(--card) / 0.6)",
            boxShadow: "0 24px 70px -28px hsl(var(--golden-glow) / 0.45)",
          }}
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.35em] text-primary">
              Partner With Us
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
              Why Partner With WellWith?
            </h2>
            <p className="text-foreground/85 mt-4 text-base md:text-lg">
              Build your journey with WellWith. Choose the partnership model that fits you.
            </p>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              A Seabuckthorn-based wellness brand with established products, entrepreneurship
              models and digital support.
            </p>
          </div>

          {/* Why WellWith */}
          <div className="mt-10 md:mt-14 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
              Why WellWith?
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mt-4 text-center">
              WellWith is an India-focused Seabuckthorn wellness platform that combines wellness
              products with entrepreneurship opportunities. The WellWith Business website says it is
              India's largest Seabuckthorn manufacturer and highlights a science-backed product
              portfolio, expert trust, established entrepreneurship models, digital support, local
              manufacturing and an ethical, transparent process. It also states that the brand has
              over 1 million users across 15 nations and that its Seabuckthorn is handpicked from
              the valleys of Ladakh.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {whyWellWithReasons.map((r) => (
                <div
                  key={r.title}
                  className="rounded-2xl border border-border/60 bg-background/50 p-5"
                >
                  <div className="font-semibold text-foreground">{r.title}</div>
                  <p className="text-sm text-muted-foreground mt-1.5">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center font-display text-lg md:text-xl text-foreground mt-10 md:mt-14">
            Ab aap WellWith ke saath 3 simple tarikon se jud sakte hain:
          </p>

          {/* Partner cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {partnerModels.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl border border-border/70 bg-card/80 p-6 md:p-7 flex flex-col transition-transform hover:-translate-y-1 hover:border-primary/50"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--emerald) / 0.9) 0%, hsl(var(--golden) / 0.9) 100%)",
                  }}
                >
                  {iconFor(p.icon, "w-7 h-7 text-primary-foreground")}
                </div>

                <h4 className="font-display text-xl md:text-2xl font-bold text-foreground mt-5">
                  {p.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-2">{p.tagline}</p>

                <p className="text-sm text-foreground/80 mt-4">{p.whatItMeans}</p>

                <ul className="mt-4 space-y-2">
                  {p.benefits.map((b) => (
                    <li key={b} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      {b}
                    </li>
                  ))}
                </ul>

                {p.flow && (
                  <p className="text-xs uppercase tracking-[0.18em] text-primary mt-4 font-semibold">
                    {p.flow.join(" → ")}
                  </p>
                )}

                <p className="text-sm italic text-foreground/70 mt-4">{p.mainPoint}</p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      stopAudio();
                      setActive(p);
                    }}
                    className="inline-flex items-center justify-center gap-2 min-h-[52px] rounded-full border border-primary/60 bg-background/60 font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <Headphones className="w-5 h-5 text-primary" />
                    Listen About This
                  </button>
                  <a
                    href={partnerWhatsAppLink(p.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[52px] rounded-full font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--emerald)) 0%, hsl(var(--golden)) 100%)",
                      boxShadow: "0 12px 30px -10px hsl(var(--golden-glow) / 0.6)",
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    {p.ctaLabel}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 md:mt-14">
            {trustRow.map((t) => (
              <div
                key={t.label}
                className="rounded-2xl border border-border/50 bg-background/40 p-5 text-center"
              >
                <div className="font-display text-lg font-bold text-primary">{t.label}</div>
                <p className="text-xs text-muted-foreground mt-1.5">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`About ${active.name}`}
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full sm:max-w-[480px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl"
            >
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 w-9 h-9 rounded-full border border-border bg-background/70 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--emerald)) 0%, hsl(var(--golden)) 100%)",
                  }}
                >
                  {iconFor(active.icon, "w-8 h-8 text-primary-foreground")}
                </div>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground text-center mt-4">
                {active.name}
              </h3>
              <p className="text-muted-foreground text-sm text-center mt-2">{active.whatItMeans}</p>

              <div className="mt-4 rounded-2xl border border-border/60 bg-background/50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Why WellWith
                </div>
                <p className="text-sm text-muted-foreground mt-2">{active.whyWellWith}</p>
              </div>

              {/* Audio player */}
              <div className="mt-5 rounded-2xl border border-border/70 bg-background/60 p-4">
                {active.audio ? (
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

                      <div className="flex items-end gap-1 h-8 flex-1">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <motion.span
                            key={i}
                            className="flex-1 rounded-full bg-primary/70"
                            animate={playing ? { height: ["25%", "100%", "40%"] } : { height: "22%" }}
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
                      src={active.audio}
                      preload="auto"
                      onEnded={() => setPlaying(false)}
                      onPause={() => setPlaying(false)}
                      onPlay={() => setPlaying(true)}
                    />
                  </>
                ) : (
                  <p className="text-sm text-center text-muted-foreground">
                    Audio coming soon for this model.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={close}
                  className="flex-1 min-h-[52px] rounded-full border border-border bg-background/60 font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Close
                </button>
                <a
                  href={partnerWhatsAppLink(active.whatsappMessage)}
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
                  Explore Partnership
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PartnerWithUs;
