import { AlertTriangle, AlertCircle, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskFlag } from "@/lib/types";

interface RiskFlagCardProps {
  flag: RiskFlag;
}

const severityConfig = {
  high: {
    label: "High",
    icon: AlertTriangle,
    badge: "bg-danger text-danger-foreground",
    border: "border-danger/30",
    iconWrap: "bg-danger-soft text-danger",
    accent: "bg-danger",
  },
  medium: {
    label: "Medium",
    icon: AlertCircle,
    badge: "bg-caution text-caution-foreground",
    border: "border-caution/30",
    iconWrap: "bg-caution-soft text-caution",
    accent: "bg-caution",
  },
  low: {
    label: "Low",
    icon: Info,
    badge: "bg-safe text-safe-foreground",
    border: "border-safe/30",
    iconWrap: "bg-safe-soft text-safe",
    accent: "bg-safe",
  },
};

export const RiskFlagCard = ({ flag }: RiskFlagCardProps) => {
  const cfg = severityConfig[flag.severity];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card p-5 shadow-card transition-base hover:shadow-elevated",
        cfg.border,
      )}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", cfg.accent)} />
      <div className="flex items-start gap-4">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", cfg.iconWrap)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="font-display text-base font-bold text-foreground">{flag.title}</h4>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", cfg.badge)}>
              {cfg.label}
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {flag.category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {flag.explanation}
          </p>
          <div className="flex items-start gap-2 rounded-lg bg-primary-soft/60 p-3">
            <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold text-primary">Student action:</span>{" "}
              {flag.studentAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
