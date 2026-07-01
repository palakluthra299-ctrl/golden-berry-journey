import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ThinkingDotsProps {
  messages?: string[];
  intervalMs?: number;
  className?: string;
}

const DEFAULT_MESSAGES = [
  "Reading your symptoms...",
  "Matching nature's best...",
  "Almost there...",
];

const ThinkingDots = ({
  messages = DEFAULT_MESSAGES,
  intervalMs = 800,
  className = "",
}: ThinkingDotsProps) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % messages.length), intervalMs);
    return () => clearInterval(id);
  }, [messages, intervalMs]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 px-6 py-4 rounded-full bg-card border border-border/60 shadow-md">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-primary"
            animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-sm text-muted-foreground"
      >
        {messages[idx]}
      </motion.p>
    </div>
  );
};

export default ThinkingDots;
