import { Link, useNavigate } from "react-router-dom";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  GaugeCircle,
  ListChecks,
  Sparkles,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="container pt-16 md:pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-soft px-3 py-1 mb-6 animate-fade-in-up">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">
            AI lease analyzer for college students
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5 max-w-3xl mx-auto leading-[1.05] animate-fade-in-up">
          Scan your lease before you sign.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up">
          Upload your residential lease to instantly flag risky clauses,
          understand your obligations, and receive a comprehensive housing score.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up">
          <Button
            size="lg"
            onClick={() => navigate("/upload")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-7 rounded-full shadow-soft"
          >
            Start Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* How it works */}
      <section className="container pb-24">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-foreground mb-2">
            How LeaseLens works
          </h2>
          <p className="text-muted-foreground">Three steps. Less than a minute.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: FileCheck2,
              title: "1. Upload or paste",
              text: "Drop a lease PDF, screenshot, or paste the listing text.",
            },
            {
              icon: GaugeCircle,
              title: "2. Add housing details",
              text: "Rent, neighborhood, commute, utilities — the basics.",
            },
            {
              icon: ListChecks,
              title: "3. Get a clear score",
              text: "Risk score, flagged clauses, and questions to ask.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-base hover:shadow-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary mb-4">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Index;
