import { motion } from "framer-motion";
import { products } from "@/data/products";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductListenExperience from "@/components/ProductListenExperience";

const Index = () => {
  const concentrates = products.filter((p) => p.category === "concentrate");
  const addons = products.filter((p) => p.category === "addon");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProductListenExperience />


      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Our Collection</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3">
              Liquid Concentrates
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Six powerful formulations, each crafted with Sea Buckthorn and time-tested Ayurvedic ingredients.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {concentrates.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Specialized</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3">
              Premium Add-ons
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Capsules, oils, and tisane — extending the golden berry's benefits across your daily routine.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addons.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Our Story</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 mb-8">
                The Golden Berry of Ladakh
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                At 11,500 feet above sea level, in the pristine valleys of Ladakh, grows a remarkable berry. 
                Sea Buckthorn — known as the "Wonder Berry" — has roots that plunge 200 feet deep into mineral-rich 
                Himalayan soil, absorbing extraordinary nutrition that no other fruit can match.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Trusted by DRDO for military nutrition and used by Russian cosmonauts in space, 
                Sea Buckthorn contains over 190 bioactive compounds including the rare Omega-7 fatty acid. 
                WellWith brings this ancient Himalayan treasure directly to your doorstep.
              </p>
              <div className="flex justify-center gap-12 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">190+</div>
                  <div className="text-sm text-muted-foreground mt-1">Bioactive Compounds</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">11,500</div>
                  <div className="text-sm text-muted-foreground mt-1">Feet Altitude</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">200ft</div>
                  <div className="text-sm text-muted-foreground mt-1">Deep Roots</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
