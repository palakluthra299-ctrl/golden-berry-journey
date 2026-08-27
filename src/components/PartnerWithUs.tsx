import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Handshake,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Users,
  X,
} from "lucide-react";
import {
  PARTNER_CONTACT_NAME,
  PARTNER_CONTACT_PHONE,
  partnerEnquiryLink,
  partnerModels,
  whyWellWith,
  type PartnerModel,
} from "@/data/partnerModels";

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

  // audio starts only after the user clicked "Listen About This"
  useEffect(() => {
    if (!active) return;
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [active]);

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
      <div className="container mx-auto px-4 max-w-6xl">
        <div
          className="rounded-3xl border border-border/70 p-6 sm:p-10 md:p-14"
          style={{
            background:
              "linear-gradient(160deg, hsl(var(--emerald) / 0.14) 0%, hsl(var(--card) / 0.75) 45%, hsl(var(--golden) / 0.1) 100%)",
            boxShadow: "0 24px 70px -32px hsl(var(--golden-glow) / 0.45)",
          }}
        >
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Partner With Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
              Build your journey with WellWith
            </h2>
            <p className="text-foreground/80 mt-3 text-base md:text-lg">
              Choose the partnership model that fits you.
            </p>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Join a Seabuckthorn-focused wellness brand with products, entrepreneurship models and
              digital support.
            </p>
          </div>

          {/* Why WellWith */}
          <div className="mt-10 md:mt-12 rounded-2xl border border-border/60 bg-background/50 p-5 sm:p-7">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground text-center">
              Why Choose WellWith?
            </h3>
            <p className="text-muted-foreground text-sm md:text-base text-center mt-3 max-w-2xl mx-auto">
              WellWith gives you more than a product to work with — it gives you a wellness
              portfolio plus different ways to build a business around it.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
              {whyWellWith.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/60 bg-card/60 p-4 text-left"
                >
                  <div className="text-sm font-bold text-primary">{item.title}</div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partner cards */}
          <div className="grid md:grid-cols-3 gap-5 md:gap-6 mt-8 md:mt-10">
            {partnerModels.map((model, i) => (
              <motion.article
                key={model.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex flex-col rounded-2xl border border-border/70 bg-card/80 p-5 sm:p-6 transition-colors hover:border-primary/50"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--emerald) / 0.9) 0%, hsl(var(--golden) / 0.9) 100%)",
                  }}
                >
                  {iconFor(model.icon, "w-8 h-8 text-primary-foreground")}
                </div>

                <h3 className="font-display text-xl font-bold text-foreground mt-4">{model.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{model.tagline}</p>

                <ul className="mt-4 space-y-2 flex-1">
                  {model.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    stopAudio();
                    setActive(model);
                  }}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 min-h-[52px] rounded-full font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--emerald)) 0%, hsl(var(--golden)) 100%)",
                    boxShadow: "0 12px 30px -12px hsl(var(--golden-glow) / 0.6)",
                  }}
                >
                  <Headphones className="w-5 h-5" />
                  Listen About This
                </button>
              </motion.article>
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
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`About ${active.name}`}
              initial={{ y: 36, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="relative w-full sm:max-w-[480px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl"
            >
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 w-9 h-9 rounded-full border border-border bg-background/70 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--emerald) / 0.9) 0%, hsl(var(--golden) / 0.9) 100%)",
                }}
              >
                {iconFor(active.icon, "w-7 h-7 text-primary-foreground")}
              </div>

              <h3 className="font-display text-2xl font-bold text-foreground mt-4">{active.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{active.message}</p>

              <div className="mt-5">
                <h4 className="text-sm font-semibold text-foreground">
                  Why choose WellWith for this model?
                </h4>
                <ul className="mt-3 space-y-2">
                  {active.why.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Audio player */}
              <div className="mt-5 rounded-2xl border border-border/70 bg-background/60 p-4">
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
              </div>

              <div className="mt-5 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={close}
                  className="flex-1 min-h-[52px] rounded-full border border-border bg-background/60 font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Close
                </button>
                <a
                  href={partnerEnquiryLink(active)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[52px] rounded-full inline-flex items-center justify-center gap-2 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--emerald)) 0%, hsl(var(--golden)) 100%)",
                    boxShadow: "0 12px 30px -12px hsl(var(--golden-glow) / 0.6)",
                  }}
                >
                  <Handshake className="w-5 h-5" />
                  Explore Partnership
                </a>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-3">
                Enquiries handled by {PARTNER_CONTACT_NAME} — {PARTNER_CONTACT_PHONE}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PartnerWithUs;
