import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { UploadCard } from "@/components/UploadCard";
import { HousingDetailsForm } from "@/components/HousingDetailsForm";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import { getMockAnalysis, SAMPLE_LEASE_TEXT } from "@/lib/mockAnalysis";
import type { HousingDetails } from "@/lib/types";
import { ArrowRight, ShieldCheck, ScanSearch, Sparkles, FileCheck2, ListChecks, GaugeCircle } from "lucide-react";
import { toast } from "sonner";

const defaultDetails: HousingDetails = {
  monthlyRent: "1050",
  neighborhood: "West Campus",
  bedrooms: "2",
  commuteMinutes: "18",
  utilitiesIncluded: "unknown",
  hasCar: false,
};

const Index = () => {
  const navigate = useNavigate();
  const { setResult, setDetails } = useAnalysis();
  const [leaseText, setLeaseText] = useState("");
  const [details, setLocalDetails] = useState<HousingDetails>(defaultDetails);
  const [loading, setLoading] = useState(false);

  const scrollToAnalyze = () => {
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSample = () => {
    setLeaseText(SAMPLE_LEASE_TEXT);
    toast.success("Sample lease loaded", {
      description: "Scroll down and click Analyze Housing Risk.",
    });
    scrollToAnalyze();
  };

  const handleAnalyze = () => {
    if (!leaseText.trim()) {
      toast.error("Add lease text first", {
        description: "Paste a lease or click 'Try Sample Lease' to continue.",
      });
      return;
    }
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      const result = getMockAnalysis(leaseText, details);
      setResult(result);
      setDetails(details);
      setLoading(false);
      navigate("/results");
    }, 1600);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <main className="container py-12">
          <LoadingState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      {/* Hero */}
      <section className="container pt-12 md:pt-20 pb-10 md:pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 mb-6 animate-fade-in-up">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">
            AI lease analyzer for college students
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-5 max-w-4xl mx-auto leading-[1.05] animate-fade-in-up">
          Scan your lease{" "}
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            before you sign.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up">
          Upload a lease, rental listing, or screenshot. LeaseLens flags risky clauses,
          explains housing tradeoffs, and gives you a student-friendly housing score.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up">
          <Button
            size="lg"
            onClick={scrollToAnalyze}
            className="bg-gradient-primary hover:opacity-95 text-primary-foreground font-semibold h-12 px-7 shadow-elevated"
          >
            Start Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleSample}
            className="font-semibold h-12 px-7 border-primary/30 text-primary hover:bg-primary-soft hover:text-primary"
          >
            Try Sample Lease
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-safe" />
            No account needed
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-safe" />
            Free to use
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-safe" />
            Built for students
          </div>
        </div>
      </section>

      {/* How it works strip */}
      <section id="how-it-works" className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: FileCheck2,
              title: "1. Upload or paste",
              text: "Drop in a lease PDF, screenshot, or paste the listing text.",
            },
            {
              icon: GaugeCircle,
              title: "2. Add housing details",
              text: "Rent, neighborhood, commute, utilities — the basics.",
            },
            {
              icon: ListChecks,
              title: "3. Get a clear score",
              text: "Risk score, flagged clauses, and questions to ask the landlord.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur p-5 shadow-soft transition-base hover:shadow-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary mb-3">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analyze section */}
      <section id="analyze" className="container pb-20 scroll-mt-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider mb-3">
            <ScanSearch className="h-3.5 w-3.5" />
            Lease Scanner
          </div>
          <h2 id="demo" className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
            Run your housing risk check
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Upload your lease and tell us a bit about the place. Results in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
            <UploadCard
              leaseText={leaseText}
              onLeaseTextChange={setLeaseText}
              onSampleClick={handleSample}
            />
            {!leaseText && (
              <div className="mt-6">
                <EmptyState onSampleClick={handleSample} />
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
            <HousingDetailsForm
              details={details}
              onChange={setLocalDetails}
              onSubmit={handleAnalyze}
            />
          </div>
        </div>
      </section>

      <footer id="about" className="border-t border-border bg-background/60 backdrop-blur">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            <span className="font-display font-bold text-foreground">LeaseLens</span> · Before you sign, scan it.
          </p>
          <p className="text-xs">
            Educational tool only. Not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
