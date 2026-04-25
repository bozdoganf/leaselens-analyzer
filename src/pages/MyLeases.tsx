import { Link } from "react-router-dom";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import { FileText, Plus, ArrowRight } from "lucide-react";

const MyLeases = () => {
  const { result } = useAnalysis();
  return (
    <MarketingLayout>
      <section className="container py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">My Leases</h1>
            <p className="text-muted-foreground mt-1">Every lease you've analyzed, in one place.</p>
          </div>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11"
          >
            <Link to="/upload"><Plus className="h-4 w-4 mr-2" /> Upload Lease</Link>
          </Button>
        </div>

        {result ? (
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="flex items-center justify-between p-5 hover:bg-secondary/40 transition-base">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-bold text-foreground">Lease analysis</p>
                  <p className="text-sm text-muted-foreground">
                    {result.riskFlags.length} flags · {result.riskLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl font-extrabold text-foreground tabular-nums">
                  {result.overallScore}
                </span>
                <Link
                  to="/results"
                  className="text-sm font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1"
                >
                  View <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <p className="font-display text-lg font-bold text-foreground mb-1">No leases yet</p>
            <p className="text-sm text-muted-foreground mb-5">
              Upload your first lease to start a portfolio of analyzed properties.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg">
              <Link to="/upload">Upload Lease</Link>
            </Button>
          </div>
        )}
      </section>
    </MarketingLayout>
  );
};

export default MyLeases;
