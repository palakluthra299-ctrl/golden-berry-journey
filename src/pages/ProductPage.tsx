import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { products, getWhatsAppLink } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import IngredientFlashcard from "@/components/IngredientFlashcard";
import JuiceMakingAnimation from "@/components/JuiceMakingAnimation";

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 },
};

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className="pt-20"
      >
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-10">
          <Link
            to="/#products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-cream-dark rounded-3xl p-8 relative overflow-hidden">
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-6 text-5xl"
                >
                  {product.animationIcon}
                </motion.div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-w-md mx-auto object-contain"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {product.category === "concentrate" ? "Liquid Concentrate" : "Specialized Add-on"}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-3">
                {product.name}
              </h1>
              <p className="text-xl text-primary font-display italic mb-6">{product.tagline}</p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">{product.description}</p>

              <a
                href={getWhatsAppLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-golden text-primary-foreground px-8 py-4 rounded-full font-semibold inline-flex items-center gap-3 hover:opacity-90 transition-opacity text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </a>
            </motion.div>
          </div>
        </div>

        {/* Ingredient Flashcards Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                What's Inside
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Key Ingredients
              </h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                Tap any card to discover the benefit of each ingredient
              </p>
            </motion.div>

            <div className={`grid gap-5 max-w-4xl mx-auto ${
              product.ingredientsList.length <= 2 
                ? "sm:grid-cols-2" 
                : product.ingredientsList.length <= 3 
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}>
              {product.ingredientsList.map((ing, i) => (
                <IngredientFlashcard key={ing.name} ingredient={ing} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Juice Making Animation */}
        <JuiceMakingAnimation />

        {/* Why This Product */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-6xl mb-6 block">{product.animationIcon}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why {product.name}?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                {product.description}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <div className="bg-card rounded-xl px-6 py-4 border border-border/50">
                  <div className="text-sm font-semibold text-foreground">100% Natural</div>
                  <div className="text-xs text-muted-foreground">No synthetic additives</div>
                </div>
                <div className="bg-card rounded-xl px-6 py-4 border border-border/50">
                  <div className="text-sm font-semibold text-foreground">Ladakh Sourced</div>
                  <div className="text-xs text-muted-foreground">11,500 ft altitude</div>
                </div>
                <div className="bg-card rounded-xl px-6 py-4 border border-border/50">
                  <div className="text-sm font-semibold text-foreground">DRDO Trusted</div>
                  <div className="text-xs text-muted-foreground">Scientific validation</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
      <Footer />
      <WhatsAppButton productName={product.name} />
    </div>
  );
};

export default ProductPage;
