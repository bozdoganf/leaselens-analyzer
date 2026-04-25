import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { CompareTable } from "@/components/CompareTable";
import { Button } from "@/components/ui/button";
import { COMPARE_OPTIONS } from "@/lib/mockAnalysis";
import { Plus, MapPin, AlertTriangle, DollarSign, Car } from "lucide-react";
import { cn } from "@/lib/utils";

const Compare = () => {
  const navigate = useNavigate();
  const best = [...COMPARE_OPTIONS].sort((a, b) => b.score - a.score)[0];
  const scoreTone = best.score >= 80 ? "safe" : best.score >= 60 ? "caution" : "danger";

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Compare Options</h1>
          <p className="text-muted-foreground mt-1">
            Evaluate your top lease choices to find the best fit for your student lifestyle.
          </p>
        </div>
        <Button
          onClick={() => navigate("/upload")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 shadow-soft"
        >
          <Plus className="h-4 w-4 mr-2" />
          Analyze new lease
        </Button>
      </div>

      {/* Best Match Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card p-6 md:p-7 mb-8">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-safe" />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start pl-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-safe-soft text-safe px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider mb-3">
              ★ Best Match
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-foreground">
              {best.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              123 College Ave.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              <div className="rounded-xl bg-primary-soft/60 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Monthly Rent
                  </span>
                </div>
                <p className="font-display text-xl font-extrabold text-foreground">{best.rent}</p>
              </div>
              <div className="rounded-xl bg-primary-soft/60 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Car className="h-4 w-4 text-primary" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Commute
                  </span>
                </div>
                <p className="font-display text-xl font-extrabold text-foreground">{best.commute}</p>
              </div>
              <div className="rounded-xl bg-caution-soft p-4 border border-caution/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="h-4 w-4 text-caution" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-caution">
                    Main Risk
                  </span>
                </div>
                <p className="font-display text-base font-extrabold text-foreground">{best.mainRisk}</p>
              </div>
            </div>
          </div>

          {/* Lease Health gauge */}
          <div className="flex flex-col items-center justify-center md:pr-2 mx-auto md:mx-0">
            <div
              className={cn(
                "relative h-24 w-24 rounded-full border-4 flex items-center justify-center",
                scoreTone === "safe" && "border-safe text-safe",
                scoreTone === "caution" && "border-caution text-caution",
                scoreTone === "danger" && "border-danger text-danger",
              )}
            >
              <span className="font-display text-3xl font-extrabold tabular-nums">{best.score}</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-2">Lease Health</p>
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-extrabold text-foreground mb-4">
        Detailed Comparison
      </h2>
      <CompareTable options={COMPARE_OPTIONS} />

      <p className="text-xs text-center text-muted-foreground pt-6">
        Sample comparison data shown for demo purposes.
      </p>
    </AppLayout>
  );
};

export default Compare;
