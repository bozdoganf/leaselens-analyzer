import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { useAnalysis } from "@/context/AnalysisContext";
import { ScanLine } from "lucide-react";

const Analyzing = () => {
  const navigate = useNavigate();
  const { result } = useAnalysis();

  useEffect(() => {
    // When result becomes available, give the user a moment to see the scan, then go.
    if (result) {
      const t = setTimeout(() => navigate("/results"), 1400);
      return () => clearTimeout(t);
    }
  }, [result, navigate]);

  return (
    <AppLayout>
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-foreground">Analysis Status</h1>
        <p className="text-muted-foreground mt-1">
          Reviewing your lease for risky clauses and affordability.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card flex flex-col items-center text-center">
            <div className="relative w-44 h-56 rounded-xl border border-border bg-secondary/40 overflow-hidden mb-6">
              <div className="absolute inset-0 p-4 space-y-1.5">
                <div className="h-2 w-12 rounded-full bg-primary/20" />
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full bg-primary/15"
                    style={{ width: `${55 + ((i * 13) % 35)}%` }}
                  />
                ))}
              </div>
              <div className="scan-line" />
            </div>
            <h3 className="font-display text-xl font-extrabold text-foreground mb-1.5">
              Analyzing lease language…
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Checking clauses, price, and location.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary">
              <ScanLine className="h-3.5 w-3.5 animate-pulse" />
              {result ? "Finalizing report…" : "Working…"}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analyzing;
