import type { LucideIcon } from "lucide-react";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  headline: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  accent?: "blue" | "green" | "orange";
}

const accents = {
  blue: { wrap: "bg-primary-soft text-primary", bar: "bg-primary" },
  green: { wrap: "bg-safe-soft text-safe", bar: "bg-safe" },
  orange: { wrap: "bg-caution-soft text-caution", bar: "bg-caution" },
};

export const InsightCard = ({
  icon: Icon,
  title,
  headline,
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  accent = "blue",
}: InsightCardProps) => {
  const a = accents[accent];
  return (
    <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card transition-base hover:shadow-elevated">
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.wrap}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{headline}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-secondary/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {primaryLabel}
          </p>
          <p className="font-display text-xl font-extrabold text-foreground">{primaryValue}</p>
        </div>
        <div className="rounded-xl bg-secondary/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {secondaryLabel}
          </p>
          <p className="font-display text-xl font-extrabold text-foreground">{secondaryValue}</p>
        </div>
      </div>
    </div>
  );
};
