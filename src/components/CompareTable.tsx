import type { CompareOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface CompareTableProps {
  options: CompareOption[];
}

function recommendationTone(rec: string) {
  const r = rec.toLowerCase();
  if (r.includes("best")) return "bg-safe-soft text-safe";
  if (r.includes("risky")) return "bg-danger-soft text-danger";
  return "bg-caution-soft text-caution";
}

function scoreTone(score: number) {
  if (score >= 80) return "text-safe";
  if (score >= 60) return "text-caution";
  return "text-danger";
}

export const CompareTable = ({ options }: CompareTableProps) => {
  const best = [...options].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-safe/30 bg-gradient-to-br from-safe-soft to-background p-6 shadow-card">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-safe/10 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-safe text-safe-foreground shadow-card">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-safe text-safe-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2">
              Best Match
            </span>
            <h3 className="font-display text-2xl font-extrabold text-foreground">{best.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Strong score, lower rent, and manageable commute.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/60 text-left">
                <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Option</th>
                <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Overall Score</th>
                <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Rent</th>
                <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Commute</th>
                <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Main Risk</th>
                <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {options.map((opt) => {
                const isBest = opt.id === best.id;
                return (
                  <tr
                    key={opt.id}
                    className={cn(
                      "border-t border-border transition-base hover:bg-primary-soft/30",
                      isBest && "bg-safe-soft/40",
                    )}
                  >
                    <td className="px-5 py-4 font-display font-bold text-foreground">
                      {opt.name}
                      {isBest && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-safe">
                          ★ Top
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("font-display text-xl font-extrabold tabular-nums", scoreTone(opt.score))}>
                        {opt.score}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">/100</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground tabular-nums">{opt.rent}</td>
                    <td className="px-5 py-4 text-foreground tabular-nums">{opt.commute}</td>
                    <td className="px-5 py-4 text-muted-foreground">{opt.mainRisk}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2.5 py-1 text-xs font-bold",
                          recommendationTone(opt.recommendation),
                        )}
                      >
                        {opt.recommendation}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
