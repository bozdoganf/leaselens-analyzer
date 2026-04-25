import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";

interface LogoProps {
  subtitle?: string;
  to?: string;
}

export const Logo = ({ subtitle, to = "/" }: LogoProps) => (
  <Link to={to} className="flex items-center gap-2.5 group">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary border border-primary/15 transition-base group-hover:scale-[1.03]">
      <ScanLine className="h-5 w-5" />
    </div>
    <div className="leading-tight">
      <div className="font-display text-lg font-extrabold tracking-tight text-foreground">
        LeaseLens
      </div>
      {subtitle && (
        <div className="text-[11px] font-medium text-primary -mt-0.5">{subtitle}</div>
      )}
    </div>
  </Link>
);
