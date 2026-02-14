import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 premium-card"
      >
        <div className="aspect-square overflow-hidden bg-cream-dark relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 text-2xl animate-float">
            {product.animationIcon}
          </div>
        </div>
        <div className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {product.category === "concentrate" ? "Liquid Concentrate" : "Specialized Add-on"}
          </span>
          <h3 className="font-display text-lg font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{product.tagline}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
