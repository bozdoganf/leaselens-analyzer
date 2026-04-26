import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";

interface LogoProps {
  subtitle?: string;
  to?: string;
  size?: "default" | "large";
}

export const Logo = ({ subtitle, to = "/my-leases", size = "default" }: LogoProps) => {
  const isLarge = size === "large";

  return (
  <Link to={to} className={`flex items-center group ${isLarge ? "gap-3" : "gap-2.5"}`}>
    <div className={`flex items-center justify-center rounded-lg bg-primary-soft text-primary border border-primary/15 transition-base group-hover:scale-[1.03] ${isLarge ? "h-12 w-12" : "h-9 w-9"}`}>
      <ScanLine className={isLarge ? "h-6 w-6" : "h-5 w-5"} />
    </div>
    <div className="leading-tight">
      <div className={`font-display font-extrabold tracking-tight text-foreground ${isLarge ? "text-2xl" : "text-lg"}`}>
        LeaseLens
      </div>
      {subtitle && (
        <div className="text-[11px] font-medium text-primary -mt-0.5">{subtitle}</div>
      )}
    </div>
  </Link>
  );
};
