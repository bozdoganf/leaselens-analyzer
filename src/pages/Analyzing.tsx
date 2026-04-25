import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import { FileText, ScanLine } from "lucide-react";

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
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-foreground">Analysis Status</h1>
        <p className="text-muted-foreground mt-1">Reviewing document states within the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* State 1 */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            State 1: Processing
          </p>
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
              Checking clauses, price, location, and student fit.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary">
              <ScanLine className="h-3.5 w-3.5 animate-pulse" />
              {result ? "Finalizing report…" : "Working…"}
            </div>
          </div>
        </div>

        {/* State 2 */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            State 2: Awaiting Input
          </p>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-5">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="font-display text-xl font-extrabold text-foreground mb-2">
              Upload a lease or listing to get started.
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Drag and drop your PDF or copy-paste text for instant analysis.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/upload?sample=1")}
              className="rounded-lg border-border bg-card hover:bg-secondary text-foreground font-semibold"
            >
              Try Sample Lease
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analyzing;
