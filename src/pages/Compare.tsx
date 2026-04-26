import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAnalysis } from "@/context/AnalysisContext";
import { deleteSavedAnalysis, getSavedAnalyses } from "@/lib/savedAnalyses";
import type { SavedLeaseAnalysis } from "@/lib/types";
import {
  AlertTriangle,
  Eye,
  GitCompareArrows,
  MapPin,
  NotebookPen,
  Plus,
  ShieldCheck,
  Trash2,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

function scoreTone(score: number) {
  if (score >= 80) return "text-safe";
  if (score >= 60) return "text-caution";
  return "text-danger";
}

function cardTone(score: number) {
  if (score >= 80) return "border-safe/30 bg-safe-soft/30";
  if (score >= 60) return "border-caution/30 bg-caution-soft/30";
  return "border-danger/30 bg-danger-soft/30";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRent(analysis: SavedLeaseAnalysis) {
  const rent = analysis.result.extracted.monthlyRent;

  if (rent) {
    return `$${rent.toLocaleString()}`;
  }

  return analysis.result.priceInsight.rent || "Unknown";
}

function formatCommute(analysis: SavedLeaseAnalysis) {
  return analysis.result.commuteInsight.commute || `${analysis.result.breakdown.location}/100`;
}

function getTopRisk(analysis: SavedLeaseAnalysis) {
  return (
    analysis.result.riskFlags.find((flag) => flag.severity === "high") ??
    analysis.result.riskFlags[0]
  );
}

function formatNotesPreview(notes: string) {
  const trimmed = notes.trim();

  if (!trimmed) {
    return "No notes";
  }

  return trimmed.length > 80 ? `${trimmed.slice(0, 80)}...` : trimmed;
}

const Compare = () => {
  const navigate = useNavigate();
  const { setResult, setNotes, setReviewedQuestionKeys } = useAnalysis();
  const [savedAnalyses, setSavedAnalyses] = useState<SavedLeaseAnalysis[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = getSavedAnalyses();
    setSavedAnalyses(saved);
    setSelectedIds(saved.slice(0, 3).map((analysis) => analysis.id));
  }, []);

  const selectedAnalyses = useMemo(
    () => savedAnalyses.filter((analysis) => selectedIds.includes(analysis.id)),
    [savedAnalyses, selectedIds],
  );

  const bestAnalysis = useMemo(() => {
    return [...savedAnalyses].sort(
      (a, b) => b.result.overallScore - a.result.overallScore,
    )[0];
  }, [savedAnalyses]);

  const toggleSelected = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const handleViewReport = (analysis: SavedLeaseAnalysis) => {
    setResult(analysis.result);
    setNotes(analysis.notes ?? "");
    setReviewedQuestionKeys(analysis.reviewedQuestionKeys ?? []);
    navigate("/results");
  };

  const handleDelete = (id: string) => {
    const updated = deleteSavedAnalysis(id);
    setSavedAnalyses(updated);
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
  };

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            Compare Saved Leases
          </h1>
          <p className="text-muted-foreground mt-1">
            Review saved reports side by side before choosing a lease.
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

      {savedAnalyses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <GitCompareArrows className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-extrabold text-foreground">
            No saved leases yet
          </h2>
          <p className="text-sm text-muted-foreground mt-2 mb-5">
            Analyze a lease, save the report, then compare it here.
          </p>
          <Button
            onClick={() => navigate("/upload")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 px-5 shadow-soft"
          >
            <Plus className="h-4 w-4 mr-2" />
            Analyze lease
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {bestAnalysis && (
            <section
              className={cn(
                "rounded-2xl border bg-card p-6 shadow-card",
                cardTone(bestAnalysis.result.overallScore),
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-safe-soft text-safe px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider mb-2">
                    Highest Score
                  </span>
                  <h2 className="font-display text-2xl font-extrabold text-foreground">
                    {bestAnalysis.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Saved {formatDate(bestAnalysis.createdAt)}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p
                    className={cn(
                      "font-display text-4xl font-extrabold tabular-nums",
                      scoreTone(bestAnalysis.result.overallScore),
                    )}
                  >
                    {bestAnalysis.result.overallScore}
                    <span className="text-base text-muted-foreground"> / 100</span>
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {bestAnalysis.result.riskLabel}
                  </p>
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-display text-xl font-extrabold text-foreground">
                Saved Reports
              </h2>
              <span className="text-sm text-muted-foreground">
                {savedAnalyses.length} saved
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/60 text-left">
                      <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                        Compare
                      </th>
                      <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                        Lease
                      </th>
                      <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                        Score
                      </th>
                      <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                        Rent
                      </th>
                      <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                        Affordability
                      </th>
                      <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                        Location
                      </th>
                      <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                        Top Risk
                      </th>
                      <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                        Notes
                      </th>
                      <th className="px-5 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedAnalyses.map((analysis) => {
                      const topRisk = getTopRisk(analysis);

                      return (
                        <tr
                          key={analysis.id}
                          className="border-t border-border transition-base hover:bg-primary-soft/30"
                        >
                          <td className="px-5 py-4">
                            <Checkbox
                              checked={selectedIds.includes(analysis.id)}
                              onCheckedChange={() => toggleSelected(analysis.id)}
                              aria-label={`Compare ${analysis.name}`}
                            />
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-display font-bold text-foreground">
                              {analysis.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(analysis.createdAt)}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "font-display text-xl font-extrabold tabular-nums",
                                scoreTone(analysis.result.overallScore),
                              )}
                            >
                              {analysis.result.overallScore}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground">
                              /100
                            </span>
                          </td>
                          <td className="px-5 py-4 font-semibold text-foreground tabular-nums">
                            {formatRent(analysis)}
                          </td>
                          <td className="px-5 py-4 font-semibold text-foreground tabular-nums">
                            {analysis.result.breakdown.affordability}/100
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {analysis.result.breakdown.location}/100
                            </span>
                            <span className="block text-xs">
                              {formatCommute(analysis)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {topRisk ? topRisk.title : "No major risk"}
                          </td>
                          <td className="px-5 py-4 text-muted-foreground max-w-xs">
                            {formatNotesPreview(analysis.notes ?? "")}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <Button
                                onClick={() => handleViewReport(analysis)}
                                size="sm"
                                variant="outline"
                                className="h-9 border-border bg-card text-foreground hover:bg-secondary"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1.5" />
                                View
                              </Button>
                              <Button
                                onClick={() => handleDelete(analysis.id)}
                                size="sm"
                                variant="ghost"
                                className="h-9 text-muted-foreground hover:text-danger hover:bg-danger-soft"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-display text-xl font-extrabold text-foreground">
                Side-by-Side
              </h2>
              <span className="text-sm text-muted-foreground">
                {selectedAnalyses.length} selected
              </span>
            </div>

            {selectedAnalyses.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-sm text-muted-foreground">
                Select saved reports above to compare them side by side.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {selectedAnalyses.map((analysis) => {
                  const topRisk = getTopRisk(analysis);

                  return (
                    <div
                      key={analysis.id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-card"
                    >
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div>
                          <h3 className="font-display text-lg font-extrabold text-foreground">
                            {analysis.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(analysis.createdAt)}
                          </p>
                        </div>
                        <p
                          className={cn(
                            "font-display text-2xl font-extrabold tabular-nums",
                            scoreTone(analysis.result.overallScore),
                          )}
                        >
                          {analysis.result.overallScore}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
                          <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Wallet className="h-4 w-4" />
                            Rent
                          </span>
                          <span className="font-bold text-foreground">{formatRent(analysis)}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
                          <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <ShieldCheck className="h-4 w-4" />
                            Lease Safety
                          </span>
                          <span className="font-bold text-foreground">
                            {analysis.result.breakdown.leaseSafety}/100
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
                          <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Wallet className="h-4 w-4" />
                            Affordability
                          </span>
                          <span className="font-bold text-foreground">
                            {analysis.result.breakdown.affordability}/100
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2">
                          <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            Location
                          </span>
                          <span className="text-right font-bold text-foreground">
                            {analysis.result.breakdown.location}/100
                            <span className="block text-xs font-semibold text-muted-foreground">
                              {formatCommute(analysis)}
                            </span>
                          </span>
                        </div>
                        <div className="rounded-xl bg-danger-soft/50 border border-danger/20 px-3 py-2">
                          <span className="flex items-center gap-2 text-sm font-semibold text-danger mb-1">
                            <AlertTriangle className="h-4 w-4" />
                            Top Risk
                          </span>
                          <p className="text-sm font-semibold text-foreground">
                            {topRisk ? topRisk.title : "No major risk"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-primary-soft/40 border border-primary/15 px-3 py-2">
                          <span className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
                            <NotebookPen className="h-4 w-4" />
                            Notes
                          </span>
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {(analysis.notes ?? "").trim() || "No notes yet."}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleViewReport(analysis)}
                        variant="outline"
                        className="mt-5 w-full h-10 border-border bg-card text-foreground hover:bg-secondary font-semibold"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View full report
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </AppLayout>
  );
};

export default Compare;
