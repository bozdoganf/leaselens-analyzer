import { ShieldCheck, Wallet, MapPin, GraduationCap } from "lucide-react";
import type { ScoreBreakdown as ScoreBreakdownType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
}

function getTone(score: number) {
  if (score >= 80) return { bar: "bg-safe", text: "text-safe", soft: "bg-safe-soft" };
  if (score >= 60) return { bar: "bg-caution", text: "text-caution", soft: "bg-caution-soft" };
  return { bar: "bg-danger", text: "text-danger", soft: "bg-danger-soft" };
}

const items = [
  { key: "leaseSafety" as const, label: "Lease Safety", icon: ShieldCheck },
  { key: "affordability" as const, label: "Affordability", icon: Wallet },
  { key: "location" as const, label: "Location", icon: MapPin },
  { key: "studentFit" as const, label: "Student Fit", icon: GraduationCap },
];

export const ScoreBreakdown = ({ breakdown }: ScoreBreakdownProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(({ key, label, icon: Icon }, idx) => {
        const value = breakdown[key];
        const tone = getTone(value);
        return (
          <div
            key={key}
            className="rounded-2xl border border-border bg-card p-5 shadow-card transition-base hover:shadow-elevated hover:-translate-y-0.5 animate-fade-in-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", tone.soft)}>
                <Icon className={cn("h-4.5 w-4.5", tone.text)} />
              </div>
              <span className="font-display text-2xl font-extrabold text-foreground tabular-nums">
                {value}
                <span className="text-sm font-semibold text-muted-foreground"> / 100</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", tone.bar)}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
