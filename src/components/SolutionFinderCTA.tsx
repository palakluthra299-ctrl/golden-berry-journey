import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface Props {
  variant?: "hero" | "default";
  className?: string;
}

const SolutionFinderCTA = ({ variant = "default", className = "" }: Props) => {
  const sizeClasses =
    variant === "hero"
      ? "px-8 py-3.5 text-sm"
      : "px-6 py-2.5 text-sm";

  return (
    <Link
      to="/solution-finder"
      aria-label="Open Solution Finder"
      className={`sf-cta group inline-flex items-center gap-2 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 ${sizeClasses} ${className}`}
    >
      <Sparkles className="w-4 h-4" />
      Find My Solution
    </Link>
  );
};

export default SolutionFinderCTA;
