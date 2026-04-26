import { ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "How it works", to: "/#how-it-works" },
  { label: "Demo", to: "/#demo" },
  { label: "About", to: "/#about" },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchor = (to: string) => (e: React.MouseEvent) => {
    if (to.startsWith("/#")) {
      e.preventDefault();
      const id = to.slice(2);
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 80);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/my-leases" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-base group-hover:scale-105">
            <ScanSearch className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
            LeaseLens
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs font-medium text-muted-foreground">
            Before you sign, scan it.
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              onClick={handleAnchor(link.to)}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-secondary transition-base"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/compare"
            className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-secondary transition-base"
          >
            Compare
          </Link>
        </nav>

        <Button
          onClick={() => {
            if (location.pathname !== "/") navigate("/");
            setTimeout(() => {
              document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });
            }, 80);
          }}
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-card"
        >
          Analyze Lease
        </Button>
      </div>
    </header>
  );
};
