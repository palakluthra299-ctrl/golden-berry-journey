import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = `text-sm font-medium transition-colors ${
    scrolled ? "text-foreground/80 hover:text-primary" : "text-primary-foreground/90 hover:text-golden-light"
  }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/60 shadow-[0_4px_20px_rgba(0,0,0,0.25)] h-14"
          : "bg-transparent backdrop-blur-sm h-16"
      }`}
    >
      <div className={`container mx-auto px-4 h-full flex items-center justify-between`}>
        <Link to="/" className="flex items-center gap-2">
          <span className={`font-display font-bold text-gradient-golden transition-all ${scrolled ? "text-xl" : "text-2xl"}`}>wellwith</span>
          <span className={`text-xs tracking-widest uppercase ${scrolled ? "text-muted-foreground" : "text-primary-foreground/70"}`}>Sea Buckthorn</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={linkCls}>Home</Link>
          <a href="/#products" className={linkCls}>Products</a>
          <Link to="/solution-finder" className={linkCls}>Solution Finder</Link>
          <a href="/#story" className={linkCls}>Our Story</a>
          <Link to="/expert" className={linkCls}>Palak Luthra</Link>
          <a
            href={`https://wa.me/919266086554?text=${encodeURIComponent("Namaste Palak! I want to know more about WellWith Sea Buckthorn products.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-golden text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Order Now
          </a>
        </div>

        <button
          className={`md:hidden ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 py-4 flex flex-col gap-4 animate-fade-in">
          <Link to="/" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground/80">Home</Link>
          <a href="/#products" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground/80">Products</a>
          <Link to="/solution-finder" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground/80">Solution Finder</Link>
          <a href="/#story" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground/80">Our Story</a>
          <Link to="/expert" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground/80">Palak Luthra</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
