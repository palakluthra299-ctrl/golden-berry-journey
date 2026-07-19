import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const facts = [
  "Sea Buckthorn — 190+ bioactive nutrients in one berry",
  "Rich in Omega 3, 6, 7 & 9 — a rare combo found in no other fruit",
  "Packed with more Vitamin C than oranges",
  "Grown wild at 11,500 ft in the Himalayas of Ladakh",
  "Used by Russian cosmonauts for radiation recovery",
  "Trusted by DRDO for high-altitude immunity support",
];

const TYPE_SPEED_MS = 45;
const PAUSE_MS = 2800;
const ERASE_SPEED_MS = 22;

type Phase = "typing" | "paused" | "erasing";

const RotatingFactStrip = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const currentFact = facts[index];

    const clear = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    if (phase === "typing") {
      if (displayText.length < currentFact.length) {
        timeoutRef.current = window.setTimeout(() => {
          setDisplayText(currentFact.slice(0, displayText.length + 1));
        }, TYPE_SPEED_MS);
      } else {
        setPhase("paused");
      }
    } else if (phase === "paused") {
      timeoutRef.current = window.setTimeout(() => {
        setPhase("erasing");
      }, PAUSE_MS);
    } else if (phase === "erasing") {
      if (displayText.length > 0) {
        timeoutRef.current = window.setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, ERASE_SPEED_MS);
      } else {
        setIndex((prev) => (prev + 1) % facts.length);
        setPhase("typing");
      }
    }

    return clear;
  }, [displayText, index, phase, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="min-h-[2.5rem] md:min-h-[3rem] flex items-center mb-6">
        <span className="text-base md:text-xl font-medium text-golden-light">
          {facts[0]}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-[2.5rem] md:min-h-[3rem] flex items-center mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={index + phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center"
        >
          <span className="text-base md:text-xl font-medium text-golden-light">
            {displayText}
          </span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block w-0.5 h-5 md:h-6 bg-golden-light ml-1 align-middle"
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingFactStrip;
