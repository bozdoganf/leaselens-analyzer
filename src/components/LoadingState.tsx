import { FileSearch, ScanLine } from "lucide-react";

export const LoadingState = () => {
  const steps = [
    "Reading lease language...",
    "Checking clauses for risk...",
    "Comparing rent to area average...",
    "Estimating location context...",
  ];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in-up">
      <div className="relative w-64 h-80 rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
        <div className="absolute inset-0 p-5 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-md bg-primary/20" />
            <div className="h-2.5 w-20 rounded-full bg-secondary" />
          </div>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-secondary"
              style={{ width: `${60 + ((i * 13) % 35)}%` }}
            />
          ))}
        </div>
        <div className="scan-line" />
        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <ScanLine className="h-4 w-4 text-primary-foreground animate-pulse" />
        </div>
      </div>

      <div className="mt-8 text-center max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-bold uppercase tracking-wider mb-3">
          <FileSearch className="h-3.5 w-3.5" />
          Working
        </div>
        <h3 className="font-display text-2xl font-extrabold text-foreground mb-2">
          Analyzing lease language...
        </h3>
        <p className="text-sm text-muted-foreground">
          Checking clauses, price, and location.
        </p>
        <ul className="mt-6 space-y-2 text-left">
          {steps.map((s, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-sm text-muted-foreground"
              style={{ animation: `fade-in-up 0.5s ${i * 0.25}s both` }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
