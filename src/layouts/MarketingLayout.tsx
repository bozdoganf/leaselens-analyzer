import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const navLinks = [
  { label: "My Leases", to: "/my-leases" },
  { label: "Help", to: "/help" },
];

export const MarketingLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "px-3.5 py-2 text-sm font-medium rounded-md transition-base",
                    isActive
                      ? "text-primary bg-primary-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/sign-in"
              className="hidden sm:inline text-sm font-semibold text-foreground hover:text-primary transition-base"
            >
              Sign In
            </Link>
            <Button
              onClick={() => navigate("/upload")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-10 px-5 shadow-soft"
            >
              Upload Lease
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/70 bg-background">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LeaseLens AI. Built for students.</p>
          <div className="flex items-center gap-5">
            <Link to="/help" className="hover:text-foreground transition-base">Privacy Policy</Link>
            <Link to="/help" className="hover:text-foreground transition-base">Terms of Service</Link>
            <Link to="/support" className="hover:text-foreground transition-base">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
