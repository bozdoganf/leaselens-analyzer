import type { AnalysisResult, ScoreBreakdown } from "./types";

export const DEFAULT_MONTHLY_BUDGET = 2000;

export function parseMonthlyBudget(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_MONTHLY_BUDGET;
  }

  if (typeof value !== "string") {
    return DEFAULT_MONTHLY_BUDGET;
  }

  const parsed = Number(value.replace(/[$,\s]/g, ""));

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MONTHLY_BUDGET;
}

export function calculateAffordabilityScore(
  monthlyRent: number | null,
  monthlyBudget: number,
) {
  if (!monthlyRent || monthlyRent <= 0 || monthlyBudget <= 0) {
    return 0;
  }

  const rentToBudgetRatio = monthlyRent / monthlyBudget;

  if (rentToBudgetRatio <= 0.5) {
    return 100;
  }

  if (rentToBudgetRatio <= 1) {
    return Math.round(100 - ((rentToBudgetRatio - 0.5) / 0.5) * 40);
  }

  if (rentToBudgetRatio <= 1.25) {
    return Math.round(60 - ((rentToBudgetRatio - 1) / 0.25) * 60);
  }

  return 0;
}

export function calculateOverallScore(breakdown: ScoreBreakdown) {
  return Math.round(
    (breakdown.leaseSafety +
      breakdown.affordability +
      breakdown.location +
      breakdown.studentFit) /
      4,
  );
}

export function recalculateAnalysisForBudget(
  result: AnalysisResult,
  monthlyBudget: number,
) {
  const monthlyRent = result.extracted?.monthlyRent ?? null;

  if (!monthlyRent) {
    return result;
  }

  const breakdown = {
    ...result.breakdown,
    affordability: calculateAffordabilityScore(monthlyRent, monthlyBudget),
  };

  return {
    ...result,
    breakdown,
    overallScore: calculateOverallScore(breakdown),
  };
}
