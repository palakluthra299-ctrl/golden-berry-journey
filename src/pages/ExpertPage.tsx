import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Award, Heart, Leaf, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import palakImg from "@/assets/palak-luthra.jpg";

const credentials = [
{ icon: Leaf, title: "Sea Buckthorn Specialist", desc: "Deep expertise in Ladakh's golden superfruit and its 190+ bioactive compounds." },
{ icon: Heart, title: "Holistic Wellness", desc: "Integrating Ayurvedic wisdom with modern nutritional science for total well-being." },
{ icon: Award, title: "DRDO-Backed Research", desc: "Working with formulations validated by India's Defence Research & Development Organisation." },
{ icon: BookOpen, title: "Product Formulator", desc: "Creator of WellWith's 9-product range — from Pulp to Tisane — each rooted in clinical-grade ingredients." }];


const ExpertPage = () => {
  const consultLink = `https://wa.me/918299542169?text=${encodeURIComponent("Namaste Palak! I visited your profile on WellWith. I'd love a personal consultation on Sea Buckthorn products for my health needs.")}`;


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-20">

        {/* Hero */}
        <section className="container mx-auto px-4 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10">

            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center">

              <div className="relative">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl">
                  <img

                    alt="Palak Luthra — Health & Wellness Expert"
                    className="w-full h-full object-cover" src="/lovable-uploads/82761f4a-351c-4d2a-a73c-ce9953e21ea6.jpg" />

                </div>
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-2 -right-2 gradient-golden text-primary-foreground rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg">

                  🌿 Health Expert
                </motion.div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}>

              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Meet Your Guide</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-2">Palak Luthra</h1>
              <p className="text-xl text-primary font-display italic mb-6">
                Health &amp; Wellness Expert · Founder, WellWith Sea Buckthorn
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">Palak Luthra is a passionate health expert who has dedicated her time to unlocking the extraordinary potential of Sea Buckthorn — the "Wonder Berry" of the Himalayas. With years of hands-on experience sourcing directly from Ladakh's pristine valleys at 11,500 feet, she has built WellWith into a trusted name in natural nutrition.




              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Her mission is simple: bring pure, scientifically validated Himalayan superfoods 
                to every Indian household — no synthetics, no compromises, just nature's best.
              </p>

              <a
                href={consultLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-golden text-primary-foreground px-8 py-4 rounded-full font-semibold inline-flex items-center gap-3 hover:opacity-90 transition-opacity text-lg">
                <MessageCircle className="w-5 h-5" />
                Book a Free Consultation
              </a>
            </motion.div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14">

              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Expertise</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Why Trust Palak?</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {credentials.map((cred, i) =>
              <motion.div
                key={cred.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50">

                  <cred.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground text-lg mb-1">{cred.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{cred.desc}</p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Start Your Wellness Journey?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Speak directly with Palak for personalised guidance on which Sea Buckthorn products 
                are right for your health goals.
              </p>
              <a
                href={consultLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-golden text-primary-foreground px-8 py-4 rounded-full font-semibold inline-flex items-center gap-3 hover:opacity-90 transition-opacity text-lg">
                <MessageCircle className="w-5 h-5" />
                Chat with Palak on WhatsApp
              </a>
            </motion.div>
          </div>
        </section>
      </motion.div>
      <Footer />
      <WhatsAppButton />
    </div>);

};

export default ExpertPage;