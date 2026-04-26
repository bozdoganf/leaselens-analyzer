import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import type { ReactNode } from "react";

export const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-center">
          <Logo size="large" />
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
