import { cn } from "@/lib/utils";

interface ScoreCardProps {
  score: number;
  riskLabel: string;
  recommendation: string;
  summary: string;
}

function getTone(score: number) {
  if (score >= 80) return { label: "safe", ring: "hsl(var(--safe))", soft: "bg-safe-soft", text: "text-safe", grad: "from-safe to-emerald-500" };
  if (score >= 60) return { label: "caution", ring: "hsl(var(--caution))", soft: "bg-caution-soft", text: "text-caution", grad: "from-caution to-orange-500" };
  return { label: "danger", ring: "hsl(var(--danger))", soft: "bg-danger-soft", text: "text-danger", grad: "from-danger to-rose-500" };
}

export const ScoreCard = ({ score, riskLabel, recommendation, summary }: ScoreCardProps) => {
  const tone = getTone(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-card p-6 md:p-8 shadow-elevated animate-fade-in-up">
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 md:gap-8 items-center">
        <div className="relative h-44 w-44 mx-auto md:mx-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="14"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={tone.ring}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-5xl font-extrabold text-foreground tabular-nums">
              {score}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              / 100
            </span>
          </div>
        </div>

        <div className="space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                tone.soft,
                tone.text,
              )}
            >
              {riskLabel}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {recommendation}
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-foreground">
            Your housing risk overview
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};
