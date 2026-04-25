import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import { Plus, FileText, AlertTriangle, ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";
import { COMPARE_OPTIONS } from "@/lib/mockAnalysis";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { result } = useAnalysis();

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-1">
            Here's a snapshot of your housing search.
          </p>
        </div>
        <Button
          onClick={() => navigate("/upload")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 shadow-soft"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: FileText,
            label: "Leases analyzed",
            value: result ? "1" : "0",
            tone: "primary",
          },
          {
            icon: AlertTriangle,
            label: "Active risk flags",
            value: result ? String(result.riskFlags.length) : "0",
            tone: "caution",
          },
          {
            icon: ShieldCheck,
            label: "Latest score",
            value: result ? `${result.overallScore}/100` : "—",
            tone: "safe",
          },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  s.tone === "primary"
                    ? "bg-primary-soft text-primary"
                    : s.tone === "caution"
                      ? "bg-caution-soft text-caution"
                      : "bg-safe-soft text-safe"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display text-2xl font-extrabold text-foreground tabular-nums">
              {s.value}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Latest analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground">Latest analysis</h2>
            {result && (
              <Link
                to="/results"
                className="text-sm font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1"
              >
                View report <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          {result ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{result.summary}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {result.riskFlags.slice(0, 3).map((f, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-semibold rounded-full px-2.5 py-1 ${
                      f.severity === "high"
                        ? "bg-danger-soft text-danger"
                        : f.severity === "medium"
                          ? "bg-caution-soft text-caution"
                          : "bg-safe-soft text-safe"
                    }`}
                  >
                    {f.title}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <p className="font-display font-bold text-foreground mb-1">No analysis yet</p>
              <p className="text-sm text-muted-foreground mb-5">
                Upload your first lease to see results here.
              </p>
              <Button
                onClick={() => navigate("/upload")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
              >
                Start Analysis
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Top option</h2>
          </div>
          <p className="font-display text-xl font-extrabold text-foreground">
            {COMPARE_OPTIONS[0].name}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">123 College Ave.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">Score</p>
              <p className="font-display text-lg font-extrabold text-safe tabular-nums">
                {COMPARE_OPTIONS[0].score}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">Rent</p>
              <p className="font-display text-lg font-extrabold text-foreground">
                {COMPARE_OPTIONS[0].rent}
              </p>
            </div>
          </div>
          <Link
            to="/compare"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
          >
            Compare all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
