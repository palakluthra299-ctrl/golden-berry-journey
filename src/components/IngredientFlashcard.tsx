import { useState } from "react";
import { motion } from "framer-motion";
import type { Ingredient } from "@/data/products";

interface Props {
  ingredient: Ingredient;
  index: number;
}

const IngredientFlashcard = ({ ingredient, index }: Props) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="perspective-1000 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="relative w-full h-48 preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl bg-card border border-border/50 p-6 flex flex-col items-center justify-center gap-3 shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-4xl">{ingredient.icon}</span>
          <h4 className="font-semibold text-foreground text-center text-lg">{ingredient.name}</h4>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Tap to flip</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/30 p-6 flex flex-col items-center justify-center gap-2"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-2xl mb-1">{ingredient.icon}</span>
          <h4 className="font-semibold text-primary text-sm text-center">{ingredient.name}</h4>
          <p className="text-muted-foreground text-sm text-center leading-relaxed">{ingredient.benefit}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IngredientFlashcard;
