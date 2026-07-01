const Footer = () => (
  <footer className="bg-bark text-cream py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-2xl font-display font-bold text-gradient-golden mb-3">wellwith</h3>
          <p className="text-sm text-cream/60 leading-relaxed">
            The Original Sea Buckthorn Co.<br />
            Pure nutrition, directly from the hills of Ladakh to your home.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-cream/90 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><a href="/#products" className="hover:text-golden transition-colors">Products</a></li>
            <li><a href="/solution-finder" className="hover:text-golden transition-colors">Solution Finder</a></li>
            <li><a href="/#story" className="hover:text-golden transition-colors">Our Story</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-cream/90 mb-3">Contact</h4>
          <p className="text-sm text-cream/60">
            WhatsApp: +91 9266086554<br />
            The Original Sea Buckthorn Co.
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10 mt-12 pt-6 text-center text-xs text-cream/40">
        © 2026 WellWith Sea Buckthorn. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
