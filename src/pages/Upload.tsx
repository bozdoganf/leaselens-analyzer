import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { UploadCard } from "@/components/UploadCard";
import { HousingDetailsForm } from "@/components/HousingDetailsForm";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import { getMockAnalysis, SAMPLE_LEASE_TEXT } from "@/lib/mockAnalysis";
import type { HousingDetails } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const defaultDetails: HousingDetails = {
  monthlyRent: "1050",
  neighborhood: "West Campus",
  bedrooms: "2",
  commuteMinutes: "18",
  utilitiesIncluded: "unknown",
  hasCar: false,
};

const Upload = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setResult, setDetails } = useAnalysis();
  const [leaseText, setLeaseText] = useState("");
  const [details, setLocalDetails] = useState<HousingDetails>(defaultDetails);

  useEffect(() => {
    if (params.get("sample") === "1") {
      setLeaseText(SAMPLE_LEASE_TEXT);
      toast.success("Sample lease loaded");
    }
  }, [params]);

  const handleSample = () => {
    setLeaseText(SAMPLE_LEASE_TEXT);
    toast.success("Sample lease loaded");
  };

  const handleAnalyze = () => {
    if (!leaseText.trim()) {
      toast.error("Add lease text first", {
        description: "Paste a lease or click 'Try Sample Lease' to continue.",
      });
      return;
    }
    // Persist details, navigate to loading screen which will produce results.
    setDetails(details);
    navigate("/analyzing", { state: { leaseText, details } });
    setTimeout(() => {
      const result = getMockAnalysis(leaseText, details);
      setResult(result);
    }, 0);
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
          <Button
            size="lg"
            variant="outline"
            onClick={handleSample}
            className="font-semibold rounded-full h-12 px-7 border-border bg-card text-foreground hover:bg-secondary"
          >
            Try Sample Lease
          </Button>
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-card">
            <div className="mb-5">
              <h2 className="font-display text-xl font-bold text-foreground">Upload Document</h2>
              <p className="text-sm text-muted-foreground mt-0.5">PDF, DOCX, or images up to 10MB.</p>
            </div>
            <UploadCard
              leaseText={leaseText}
              onLeaseTextChange={setLeaseText}
              onSampleClick={handleSample}
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-card">
            <div className="mb-5">
              <h2 className="font-display text-xl font-bold text-foreground">Housing Details</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Help us provide accurate market context.
              </p>
            </div>
            <HousingDetailsForm
              details={details}
              onChange={setLocalDetails}
              onSubmit={handleAnalyze}
            />
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Upload;
