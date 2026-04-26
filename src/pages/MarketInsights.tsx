import { MarketingLayout } from "@/layouts/MarketingLayout";
import { TrendingUp, MapPin, Wallet, AlertTriangle } from "lucide-react";

const stats = [
  { icon: Wallet, label: "Avg. student rent (2BR)", value: "$1,025", note: "in college zones" },
  { icon: TrendingUp, label: "Year-over-year change", value: "+4.2%", note: "moderate increase" },
  { icon: MapPin, label: "Most-flagged neighborhood", value: "West Campus", note: "auto-renewal clauses" },
  { icon: AlertTriangle, label: "Common high-risk flags", value: "3.4", note: "per analyzed lease" },
];

const MarketInsights = () => (
  <MarketingLayout>
    <section className="container py-12">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
        Market Insights
      </h1>
      <p className="text-muted-foreground mt-1 max-w-2xl">
        Aggregated trends from leases analyzed by LeaseLens. Use this to benchmark
        your lease before signing.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary mb-4">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-2xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-sm font-semibold text-foreground mt-1">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
        <h2 className="font-display text-xl font-extrabold text-foreground mb-2">
          What we see most often
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          The risky clauses students encounter the most in their lease agreements.
        </p>
        <ul className="space-y-3">
          {[
            { title: "Automatic renewal clauses", pct: "62%" },
            { title: "Vague utility responsibility", pct: "47%" },
            { title: "Unclear maintenance timelines", pct: "39%" },
            { title: "High late fees", pct: "31%" },
          ].map((row) => (
            <li key={row.title} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-foreground">{row.title}</span>
                  <span className="text-sm font-semibold text-muted-foreground tabular-nums">{row.pct}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: row.pct }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </MarketingLayout>
);

export default MarketInsights;
