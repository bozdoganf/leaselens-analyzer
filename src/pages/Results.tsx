import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ScoreCard } from "@/components/ScoreCard";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { RiskFlagCard } from "@/components/RiskFlagCard";
import { LandlordQuestionsChecklist } from "@/components/LandlordQuestionsChecklist";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import { AlertTriangle, GitCompareArrows, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const Results = () => {
  const navigate = useNavigate();
  const { result } = useAnalysis();

  useEffect(() => {
    if (!result) navigate("/upload", { replace: true });
  }, [result, navigate]);

  if (!result) return null;

  const handleDownload = () => {
    const lines = [
      "LeaseLens — Housing Risk Summary",
      "==================================",
      `Overall Score: ${result.overallScore}/100 (${result.riskLabel})`,
      `Recommendation: ${result.recommendation}`,
      "",
      `Summary: ${result.summary}`,
      "",
      "Score Breakdown:",
      `  Lease Safety:   ${result.breakdown.leaseSafety}/100`,
      `  Affordability:  ${result.breakdown.affordability}/100`,
      `  Location:       ${result.breakdown.location}/100`,
      `  Student Fit:    ${result.breakdown.studentFit}/100`,
      "",
      "Risky Clauses:",
      ...result.riskFlags.flatMap((f) => [
        `  • [${f.severity.toUpperCase()}] ${f.title} (${f.category})`,
        `      ${f.explanation}`,
        `      Action: ${f.studentAction}`,
      ]),
      "",
      "Questions to Ask Landlord:",
      ...result.questions.map((q) => `  - ${q}`),
      "",
      "LeaseLens is an educational tool and does not provide legal advice.",
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leaselens-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded");
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-foreground">Lease Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Your full housing risk report. Review flags before signing.
        </p>
      </div>

      <div className="space-y-8">
        <ScoreCard
          score={result.overallScore}
          riskLabel={result.riskLabel}
          recommendation={result.recommendation}
          summary={result.summary}
        />

        <section>
          <h2 className="font-display text-xl font-extrabold text-foreground mb-4">
            Score breakdown
          </h2>
          <ScoreBreakdown breakdown={result.breakdown} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-extrabold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-caution" />
              Risky clauses found
            </h2>
            <span className="text-sm text-muted-foreground">
              {result.riskFlags.length} flag{result.riskFlags.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {result.riskFlags.map((flag, i) => (
              <RiskFlagCard key={i} flag={flag} />
            ))}
          </div>
        </section>

        <section>
          <LandlordQuestionsChecklist questions={result.questions} />
        </section>

        <section className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => navigate("/compare")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 px-5 shadow-soft"
          >
            <GitCompareArrows className="h-4 w-4 mr-2" />
            Compare Another Option
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="font-semibold rounded-lg h-11 px-5 border-border bg-card hover:bg-secondary text-foreground"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Summary
          </Button>
          <Button
            onClick={() => navigate("/upload")}
            variant="ghost"
            className="font-semibold rounded-lg h-11 px-5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start New Analysis
          </Button>
        </section>

        <p className="text-xs text-center text-muted-foreground pt-2">
          LeaseLens is an educational tool and does not provide legal advice.
        </p>
      </div>
    </AppLayout>
  );
};

export default Results;
