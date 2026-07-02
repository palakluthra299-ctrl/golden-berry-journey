import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, ArrowLeft, Search, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThinkingDots from "@/components/ThinkingDots";
import {
  concerns as CONCERNS,
  findConcern,
  suggestions,
  type ConcernCategory,
  type SolutionProduct,
} from "@/data/solutionFinder";

type Step = "input" | "thinking" | "result" | "printing" | "bill";

interface BillGroup {
  concernKey: string;
  concernLabel: string;
  products: SolutionProduct[];
}

const QUICK_CHIPS = [
  "Skin",
  "Hair",
  "Joint Pain",
  "Gut Health",
  "Diabetes",
  "Weight Management",
  "Men's Wellness",
  "Female Wellness",
];

// ---------- Audio helpers (Web Audio) ----------
const useAudioCtx = () => {
  const ref = useRef<AudioContext | null>(null);
  const get = () => {
    if (!ref.current) {
      const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      if (AC) ref.current = new AC();
    }
    return ref.current;
  };
  return get;
};

const playPrinterHum = (ctx: AudioContext, durationSec: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.value = 90;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 22;
  lfoGain.gain.value = 12;
  lfo.connect(lfoGain).connect(osc.frequency);
  gain.gain.value = 0.03;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  lfo.start();
  const stopAt = ctx.currentTime + durationSec;
  gain.gain.setValueAtTime(0.03, stopAt - 0.3);
  gain.gain.linearRampToValueAtTime(0, stopAt);
  osc.stop(stopAt);
  lfo.stop(stopAt);
};

const playPaperTear = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 0.35;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1200;
  const gain = ctx.createGain();
  gain.gain.value = 0.15;
  noise.connect(hp).connect(gain).connect(ctx.destination);
  noise.start();
};

// ---------- Voice ----------
const speakBill = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const pick =
      voices.find((v) => /hi-IN/i.test(v.lang) && /female/i.test(v.name)) ||
      voices.find((v) => /hi-IN/i.test(v.lang)) ||
      voices.find((v) => /en-IN/i.test(v.lang)) ||
      voices.find((v) => /female/i.test(v.name)) ||
      voices[0];
    if (pick) utter.voice = pick;
    utter.rate = 0.95;
    utter.pitch = 1.05;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  } catch {
    // no-op
  }
};

// ---------- Bill helpers ----------
const genRef = () => `#${Math.floor(1000 + Math.random() * 9000)}`;
const formatDate = () => new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const buildWhatsAppMessage = (groups: BillGroup[], ref: string) => {
  const lines = ["Namaste! I'd like to place an order based on my wellness check.", ""];
  groups.forEach((g) => {
    lines.push(`${g.concernLabel}:`);
    g.products.forEach((p) => lines.push(`- ${p.name}`));
    lines.push("");
  });
  lines.push(`Order Ref: ${ref}`);
  lines.push("");
  lines.push("Please confirm availability, pricing, and delivery details.");
  return lines.join("\n");
};

// ---------- Component ----------
const SolutionFinder = () => {
  const [step, setStep] = useState<Step>("input");
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [currentMatch, setCurrentMatch] = useState<ConcernCategory | null>(null);
  const [bill, setBill] = useState<BillGroup[]>([]);
  const [orderRef, setOrderRef] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [tearing, setTearing] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const getAudioCtx = useAudioCtx();

  // Warm up voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // Force scroll-to-top on every step transition and drawer open
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [step, drawerOpen]);


  const canSearch = query.trim().length > 0 || !!activeChip;

  const runSearch = (raw: string) => {
    const match = findConcern(raw) || CONCERNS.find((c) => c.label === raw) || null;
    setCurrentMatch(match);
    setStep("thinking");
    setTimeout(() => {
      if (match) setStep("result");
      else setStep("result"); // still show result but empty state
    }, 2200);
  };

  const handleFind = () => {
    if (!canSearch) return;
    runSearch(query || activeChip || "");
  };

  const handleChip = (chip: string) => {
    setActiveChip(chip);
    setQuery(chip);
  };

  const startPrintAnimation = (isFirstAdd: boolean, groupsAfter: BillGroup[]) => {
    // scroll fix first
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    if (!isFirstAdd) {
      // subsequent adds: skip animation, just go to bill
      setStep("bill");
      setDrawerOpen(true);
      return;
    }

    setStep("printing");
    setTearing(false);
    setShowButtons(false);

    const ctx = getAudioCtx();
    if (ctx) {
      try {
        if (ctx.state === "suspended") ctx.resume();
        playPrinterHum(ctx, 7.5);
      } catch {}
    }

    // Voice
    const productNames = groupsAfter.flatMap((g) => g.products.map((p) => p.name));
    const spoken = `Namaste, yaha hai aapki list — ${productNames.slice(0, 6).join(", ")}.`;
    // slight delay so audio ctx resumes
    setTimeout(() => speakBill(spoken), 400);

    // Tear at ~8s
    setTimeout(() => {
      setTearing(true);
      if (ctx) {
        try { playPaperTear(ctx); } catch {}
      }
    }, 8000);

    // Buttons at ~9.5s
    setTimeout(() => setShowButtons(true), 9500);
  };

  const handleAddToCart = () => {
    if (!currentMatch) return;
    const isFirstAdd = bill.length === 0;
    const alreadyAdded = bill.some((b) => b.concernKey === currentMatch.key);
    const newGroups = alreadyAdded
      ? bill
      : [...bill, { concernKey: currentMatch.key, concernLabel: currentMatch.label, products: currentMatch.products }];
    if (!alreadyAdded) setBill(newGroups);
    if (isFirstAdd) setOrderRef(genRef());
    startPrintAnimation(isFirstAdd, newGroups);
  };

  const resetToInput = () => {
    setStep("input");
    setQuery("");
    setActiveChip(null);
    setCurrentMatch(null);
    // preserve bill (per spec)
  };

  const removeGroup = (key: string) => {
    setBill((b) => b.filter((g) => g.concernKey !== key));
    setConfirmRemove(null);
  };

  const itemCount = bill.reduce((n, g) => n + g.products.length, 0);

  const waHref = useMemo(() => {
    if (bill.length === 0) return "#";
    const msg = buildWhatsAppMessage(bill, orderRef);
    return `https://wa.me/919266086554?text=${encodeURIComponent(msg)}`;
  }, [bill, orderRef]);

  const isFullscreen = step === "printing";

  return (
    <div className="min-h-screen bg-background">
      {!isFullscreen && <Navbar />}

      {/* Persistent cart tab */}
      {!isFullscreen && itemCount > 0 && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 gradient-golden text-primary-foreground px-3 py-4 rounded-l-2xl shadow-lg flex flex-col items-center gap-1"
          aria-label="Open bill drawer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs font-bold">{itemCount}</span>
        </button>
      )}

      {!isFullscreen && (
        <main className="pt-24 pb-16 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4 max-w-4xl">
            <AnimatePresence mode="wait">
              {step === "input" && (
                <motion.section
                  key="input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    <Sparkles className="w-4 h-4" /> Solution Finder
                  </span>
                  <h1 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground">
                    What are you struggling with today?
                  </h1>
                  <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                    Tell us your concern — we'll match it instantly to the right Wellwith wellness set.
                  </p>

                  <div className="mt-10 max-w-xl mx-auto">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        list="sf-suggestions"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setActiveChip(null); }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleFind(); }}
                        placeholder="e.g. acne, joint pain, low energy..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border/60 focus:border-primary/60 focus:outline-none text-foreground shadow-sm"
                      />
                      <datalist id="sf-suggestions">
                        {suggestions.map((s) => (
                          <option key={s} value={s} />
                        ))}
                      </datalist>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                      {QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => handleChip(chip)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                            activeChip === chip
                              ? "gradient-golden text-primary-foreground border-transparent"
                              : "bg-card border-border/60 text-foreground hover:border-primary/50"
                          }`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleFind}
                      disabled={!canSearch}
                      className="mt-8 gradient-golden text-primary-foreground px-8 py-4 rounded-full font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed transition-transform hover:scale-105"
                    >
                      Find My Product
                    </button>
                  </div>
                </motion.section>
              )}

              {step === "thinking" && (
                <motion.section
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-20"
                >
                  <ThinkingDots />
                </motion.section>
              )}

              {step === "result" && (
                <motion.section
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {!currentMatch ? (
                    <div className="text-center py-16">
                      <h2 className="text-2xl font-display font-bold text-foreground">
                        Hmm, we couldn't quite match that.
                      </h2>
                      <p className="text-muted-foreground mt-2">Try a chip below or describe it differently.</p>
                      <button
                        onClick={resetToInput}
                        className="mt-6 gradient-golden text-primary-foreground px-6 py-3 rounded-full font-semibold"
                      >
                        Try again
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                          Match Found {currentMatch.emoji}
                        </span>
                        <h2 className="mt-3 text-2xl md:text-4xl font-display font-bold text-foreground">
                          Your {currentMatch.label} wellness set
                        </h2>
                        <p className="text-muted-foreground mt-2">This complete set works together — no picking required.</p>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 mb-32 perspective-1000">
                        {currentMatch.products.map((p, i) => (
                          <motion.div
                            key={p.name}
                            initial={{ opacity: 0, rotateY: -25, rotateX: 15, y: 40 }}
                            animate={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0 }}
                            transition={{ delay: i * 0.12, type: "spring", stiffness: 120, damping: 14 }}
                            className="bg-card rounded-2xl border border-border/60 p-7 shadow-md premium-card flex flex-col items-center text-center"
                          >
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                              <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-display font-bold text-foreground text-lg leading-snug">{p.name}</h3>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.why}</p>
                            <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                              {p.tags.map((t) => (
                                <span key={t} className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="fixed bottom-6 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleAddToCart}
                          className="proceed-pulse pointer-events-auto px-10 py-5 rounded-full text-white font-bold text-lg tracking-wide"
                          style={{ background: "linear-gradient(135deg,#ff4d8d,#ff2d6f)" }}
                          aria-label="Click to proceed"
                        >
                          Click to Proceed →
                        </motion.button>
                      </div>

                    </>
                  )}
                </motion.section>
              )}

              {step === "bill" && (
                <motion.section
                  key="bill"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-4"
                >
                  <BillPaperView bill={bill} orderRef={orderRef} torn />
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 rounded-full font-semibold text-white shadow-lg"
                      style={{ background: "hsl(142 70% 42%)" }}
                    >
                      Order Now via WhatsApp
                    </a>
                    <button onClick={resetToInput} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <ArrowLeft className="w-4 h-4" /> Not now, go back
                    </button>
                  </div>

                  {/* Add another concern */}
                  <div className="mt-14 max-w-xl mx-auto text-center">
                    <p className="text-foreground font-semibold">Want help with anything else? <span className="text-muted-foreground font-normal">(skin, hair, immunity, joints...)</span></p>
                    <div className="mt-5">
                      <input
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setActiveChip(null); }}
                        onKeyDown={(e) => { if (e.key === "Enter" && (query || activeChip)) runSearch(query || activeChip || ""); }}
                        placeholder="Type another concern..."
                        className="w-full px-4 py-3 rounded-2xl bg-card border border-border/60 focus:border-primary/60 focus:outline-none text-foreground"
                      />
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {QUICK_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => { handleChip(chip); runSearch(chip); }}
                            className="px-3 py-1.5 rounded-full text-xs font-medium border bg-card border-border/60 text-foreground hover:border-primary/50"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            <p className="mt-16 text-center text-xs text-muted-foreground max-w-xl mx-auto">
              Wellwith products are wellness supplements, not medical treatments. Please consult a doctor for diagnosis or serious conditions.
            </p>
          </div>
        </main>
      )}

      {!isFullscreen && <Footer />}

      {/* Fullscreen print takeover */}
      <AnimatePresence>
        {step === "printing" && (
          <PrintingOverlay
            bill={bill}
            orderRef={orderRef}
            tearing={tearing}
            showButtons={showButtons}
            waHref={waHref}
            onWhatsApp={() => {
              setStep("bill");
              setDrawerOpen(true);
            }}
            onBack={() => {
              setStep("bill");
            }}
          />
        )}
      </AnimatePresence>

      {/* Side drawer bill */}
      <AnimatePresence>
        {drawerOpen && !isFullscreen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-card z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg">Your Bill</h3>
                  <p className="text-xs text-muted-foreground">Order Ref: {orderRef}</p>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-6">
                {bill.length === 0 && <p className="text-sm text-muted-foreground">No items yet.</p>}
                {bill.map((g) => (
                  <div key={g.concernKey}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-primary">── {g.concernLabel} ──</h4>
                      <button
                        onClick={() => setConfirmRemove(g.concernKey)}
                        className="p-1 hover:bg-destructive/10 rounded-full"
                        aria-label={`Remove ${g.concernLabel}`}
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm">
                      {g.products.map((p) => (
                        <li key={p.name} className="text-foreground/90">• {p.name}</li>
                      ))}
                    </ul>
                    {confirmRemove === g.concernKey && (
                      <div className="mt-2 p-3 bg-destructive/10 rounded-lg text-sm">
                        <p className="text-foreground">Remove {g.concernLabel} and its products?</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => removeGroup(g.concernKey)}
                            className="px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold"
                          >
                            Yes, remove
                          </button>
                          <button
                            onClick={() => setConfirmRemove(null)}
                            className="px-3 py-1 rounded-full bg-muted text-foreground text-xs font-semibold"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {bill.length > 0 && (
                <div className="p-5 border-t border-border/50 sticky bottom-0 bg-card">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center px-6 py-3 rounded-full font-semibold text-white"
                    style={{ background: "hsl(142 70% 42%)" }}
                  >
                    Order via WhatsApp
                  </a>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- Bill paper (reused static + printing) ----------
const BillPaperView = ({
  bill,
  orderRef,
  torn,
}: {
  bill: BillGroup[];
  orderRef: string;
  torn?: boolean;
}) => {
  const concernList = bill.map((g) => g.concernLabel).join(", ");
  const style: React.CSSProperties = {
    backgroundColor: "#fdfaf2",
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px), radial-gradient(circle at 20% 30%, rgba(0,0,0,0.03), transparent 40%)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 30px rgba(80,255,120,0.15)",
    color: "#1a1a1a",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    clipPath: torn
      ? "polygon(0 0, 100% 0, 100% 100%, 96% 98%, 92% 100%, 88% 97%, 84% 99%, 80% 97%, 76% 100%, 72% 98%, 68% 99%, 64% 97%, 60% 100%, 56% 98%, 52% 99%, 48% 97%, 44% 100%, 40% 98%, 36% 99%, 32% 97%, 28% 100%, 24% 98%, 20% 99%, 16% 97%, 12% 100%, 8% 98%, 4% 99%, 0 97%)"
      : undefined,
  };
  return (
    <div className="mx-auto max-w-sm p-6 rounded-sm" style={style}>
      <div className="text-center border-b border-dashed border-black/40 pb-3 mb-3">
        <div className="text-2xl font-black tracking-widest">WELLWITH</div>
        <div className="text-[10px] tracking-widest">SEA BUCKTHORN CO.</div>
      </div>
      <div className="text-[11px] flex justify-between">
        <span>{formatDate()}</span>
        <span>Ref: {orderRef}</span>
      </div>
      {concernList && (
        <div className="text-[11px] mt-1">Concern: {concernList}</div>
      )}
      <div className="border-t border-dashed border-black/40 my-3" />
      {bill.map((g) => (
        <div key={g.concernKey} className="mb-3">
          <div className="text-center text-[11px] tracking-widest">── {g.concernLabel.toUpperCase()} ──</div>
          {g.products.map((p) => (
            <div key={p.name} className="text-[12px] mt-1">{p.name}</div>
          ))}
        </div>
      ))}
      <div className="border-t border-dashed border-black/40 my-3" />
      <div className="text-center text-[11px]">Thank you for choosing Wellwith.</div>
    </div>
  );
};

// ---------- Fullscreen printing overlay ----------
const PrintingOverlay = ({
  bill,
  orderRef,
  tearing,
  showButtons,
  waHref,
  onWhatsApp,
  onBack,
}: {
  bill: BillGroup[];
  orderRef: string;
  tearing: boolean;
  showButtons: boolean;
  waHref: string;
  onWhatsApp: () => void;
  onBack: () => void;
}) => {
  const allLines = useMemo(() => {
    const lines: string[] = ["WELLWITH", "SEA BUCKTHORN CO.", formatDate(), `Ref: ${orderRef}`];
    lines.push(`Concern: ${bill.map((b) => b.concernLabel).join(", ")}`);
    bill.forEach((g) => {
      lines.push(`── ${g.concernLabel.toUpperCase()} ──`);
      g.products.forEach((p) => lines.push(p.name));
    });
    lines.push("Thank you for choosing Wellwith.");
    return lines;
  }, [bill, orderRef]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, hsl(142 80% 30%) 0%, hsl(142 90% 12%) 50%, #04140a 100%)",
      }}
    >
      {/* Machine */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
        className="relative"
      >
        <motion.div
          animate={{ boxShadow: ["0 0 40px rgba(100,255,140,0.4)", "0 0 70px rgba(120,255,160,0.7)", "0 0 40px rgba(100,255,140,0.4)"] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="w-72 h-40 rounded-2xl relative"
          style={{
            background: "linear-gradient(180deg,#eafff0 0%,#a9f3c1 40%,#5cd484 100%)",
            border: "3px solid rgba(255,255,255,0.4)",
          }}
        >
          <div className="absolute top-3 left-4 flex items-center gap-2">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_red]"
            />
            <span className="text-[10px] font-mono text-green-900/70">PRINTING</span>
          </div>
          <div className="absolute inset-x-6 top-16 h-14 rounded-lg bg-black/70 flex items-center justify-center">
            <div className="text-green-300 font-mono text-xs tracking-widest">WELLWITH</div>
          </div>
          {/* Slot */}
          <div className="absolute bottom-0 inset-x-8 h-3 bg-black rounded-b-lg shadow-inner" />
        </motion.div>

        {/* Paper emerging */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: tearing ? 380 : 380, opacity: 1 }}
          transition={{ duration: 7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 -translate-x-1/2 top-full w-64 overflow-hidden"
          style={{ filter: "drop-shadow(0 0 20px rgba(120,255,160,0.4))" }}
        >
          <motion.div
            animate={tearing ? { y: 20, rotate: -2 } : {}}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="w-full p-5 text-black"
            style={{
              backgroundColor: "#fdfaf2",
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              clipPath: tearing
                ? "polygon(0 4%, 4% 0, 8% 3%, 12% 0, 16% 3%, 20% 0, 24% 3%, 28% 0, 32% 3%, 36% 0, 40% 3%, 44% 0, 48% 3%, 52% 0, 56% 3%, 60% 0, 64% 3%, 68% 0, 72% 3%, 76% 0, 80% 3%, 84% 0, 88% 3%, 92% 0, 96% 3%, 100% 0, 100% 100%, 96% 98%, 92% 100%, 88% 97%, 84% 99%, 80% 97%, 76% 100%, 72% 98%, 68% 99%, 64% 97%, 60% 100%, 56% 98%, 52% 99%, 48% 97%, 44% 100%, 40% 98%, 36% 99%, 32% 97%, 28% 100%, 24% 98%, 20% 99%, 16% 97%, 12% 100%, 8% 98%, 4% 99%, 0 97%)"
                : "polygon(0 4%, 4% 0, 8% 3%, 12% 0, 16% 3%, 20% 0, 24% 3%, 28% 0, 32% 3%, 36% 0, 40% 3%, 44% 0, 48% 3%, 52% 0, 56% 3%, 60% 0, 64% 3%, 68% 0, 72% 3%, 76% 0, 80% 3%, 84% 0, 88% 3%, 92% 0, 96% 3%, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <div className="text-center text-lg font-black tracking-widest">WELLWITH</div>
            <div className="text-center text-[9px] tracking-widest mb-2">SEA BUCKTHORN CO.</div>
            {allLines.slice(2).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.35, duration: 0.2 }}
                className="text-[11px] leading-tight text-center"
              >
                {line}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hand */}
        <AnimatePresence>
          {tearing && (
            <motion.div
              initial={{ x: 300, opacity: 0, rotate: -10 }}
              animate={{ x: 60, opacity: 1, rotate: -10 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 18 }}
              className="absolute top-[110%] left-1/2 z-10 pointer-events-none"
              style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.5))" }}
            >
              <svg width="140" height="120" viewBox="0 0 140 120">
                <defs>
                  <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f4c9a0" />
                    <stop offset="60%" stopColor="#d9a075" />
                    <stop offset="100%" stopColor="#a06c48" />
                  </linearGradient>
                </defs>
                {/* palm */}
                <path
                  d="M20,60 Q10,40 30,30 Q50,15 75,25 L100,35 Q125,45 120,70 Q118,95 90,105 Q55,115 30,95 Q15,80 20,60 Z"
                  fill="url(#skin)"
                  stroke="#7a4a2a"
                  strokeWidth="1"
                />
                {/* thumb */}
                <path d="M75,25 Q80,10 95,15 Q105,22 100,35 Z" fill="url(#skin)" stroke="#7a4a2a" strokeWidth="1" />
                {/* nail hint on thumb */}
                <ellipse cx="94" cy="18" rx="4" ry="2.5" fill="#f9dcc0" opacity="0.7" />
                {/* finger creases */}
                <path d="M40,55 Q60,60 85,55" stroke="#a06c48" strokeWidth="1" fill="none" opacity="0.5" />
                <path d="M35,75 Q60,80 90,75" stroke="#a06c48" strokeWidth="1" fill="none" opacity="0.4" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* End buttons */}
      <AnimatePresence>
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 px-4"
          >
            <motion.a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsApp}
              animate={{ boxShadow: ["0 0 20px rgba(80,220,120,0.5)", "0 0 40px rgba(80,220,120,0.9)", "0 0 20px rgba(80,220,120,0.5)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-8 py-4 rounded-full text-white font-semibold text-base"
              style={{ background: "hsl(142 70% 42%)" }}
            >
              Order Now via WhatsApp
            </motion.a>
            <button onClick={onBack} className="text-white/70 text-sm hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Not now, go back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SolutionFinder;
