import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-gradient-golden">wellwith</span>
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Sea Buckthorn</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Home</Link>
          <a href="/#products" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Products</a>
          <a href="/#story" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Our Story</a>
          <Link to="/expert" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Palak Luthra</Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            aria-label="Toggle night mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-foreground" /> : <Moon className="w-4 h-4 text-foreground" />}
          </button>
          <a
            href={`https://wa.me/919266086554?text=${encodeURIComponent("Namaste Palak! I want to know more about WellWith Sea Buckthorn products.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-golden text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Order Now
          </a>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            aria-label="Toggle night mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-foreground" /> : <Moon className="w-4 h-4 text-foreground" />}
          </button>
          <button className="text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 py-4 flex flex-col gap-4 animate-fade-in">
          <Link to="/" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground/80">Home</Link>
          <a href="/#products" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground/80">Products</a>
          <a href="/#story" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground/80">Our Story</a>
          <Link to="/expert" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground/80">Palak Luthra</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
