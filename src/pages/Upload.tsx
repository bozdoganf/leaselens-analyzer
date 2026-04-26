import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { UploadCard } from "@/components/UploadCard";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import type { HousingDetails } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_MONTHLY_BUDGET = "2000";

function getSavedMonthlyBudget() {
  return localStorage.getItem("monthlyBudget") || DEFAULT_MONTHLY_BUDGET;
}

const Upload = () => {
  const navigate = useNavigate();
  const { setResult, setDetails } = useAnalysis();
  const [leaseText, setLeaseText] = useState("");

  const handleAnalyze = async () => {
    if (!leaseText.trim()) {
      toast.error("Add lease text first", {
        description: "Paste lease text or upload a text file to continue.",
      });
      return;
    }

    const detailsForAnalysis: HousingDetails = {
      monthlyBudget: getSavedMonthlyBudget(),
    };

    setDetails(detailsForAnalysis);
    setResult(null);
    navigate("/analyzing", {
      state: { leaseText, details: detailsForAnalysis },
    });

    try {
      const response = await fetch("/api/analyze-lease", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaseText,
          details: detailsForAnalysis,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis request failed");
      }

      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed", {
        description: "The lease could not be analyzed. Try again.",
      });
      navigate("/upload");
    }
  };

  return (
    <MarketingLayout>
      <section className="container pt-12 pb-8 text-center">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Scan your lease before you sign.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-7">
          Upload your residential lease to instantly flag risky clauses, understand
          your obligations, and receive a comprehensive housing score.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={handleAnalyze}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full h-12 px-7 shadow-soft"
          >
            Start Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="container pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-card">
            <div className="mb-5">
              <h2 className="font-display text-xl font-bold text-foreground">
                Upload Document
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                PDF, DOCX, or images up to 10MB.
              </p>
            </div>
            <UploadCard
              leaseText={leaseText}
              onLeaseTextChange={setLeaseText}
            />
            <Button
              onClick={handleAnalyze}
              className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 shadow-soft"
            >
              Analyze Lease
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Upload;
