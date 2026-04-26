import { Router } from "express";
import { analyzeLeaseWithGemma } from "../services/gemini";

export const analyzeLeaseRouter = Router();

const DEFAULT_MONTHLY_BUDGET = 2000;

function parseMoneyValue(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/[$,\s]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function getMonthlyBudget(details: unknown) {
  if (!details || typeof details !== "object" || !("monthlyBudget" in details)) {
    return DEFAULT_MONTHLY_BUDGET;
  }

  const monthlyBudget = parseMoneyValue(
    (details as { monthlyBudget?: unknown }).monthlyBudget,
  );

  return monthlyBudget && monthlyBudget > 0
    ? monthlyBudget
    : DEFAULT_MONTHLY_BUDGET;
}

function extractMonthlyRentFromText(leaseText: string) {
  const rentBeforeMonthMatch = leaseText.match(
    /\$?\s*([\d,]+(?:\.\d{1,2})?)\s*(?:\/|\s+per\s+)?\s*(?:month|monthly)\b/i,
  );

  if (rentBeforeMonthMatch) {
    return parseMoneyValue(rentBeforeMonthMatch[1]);
  }

  const monthlyRentLabelMatch = leaseText.match(
    /\b(?:monthly\s+rent|rent)\s*:\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i,
  );

  if (monthlyRentLabelMatch) {
    return parseMoneyValue(monthlyRentLabelMatch[1]);
  }

  return null;
}

function calculateAffordabilityScore(monthlyRent: number | null, monthlyBudget: number) {
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

function calculateOverallScore(breakdown: {
  leaseSafety: number;
  affordability: number;
  location: number;
}) {
  return Math.round(
    (breakdown.leaseSafety +
      breakdown.affordability +
      breakdown.location) /
      3,
  );
}

analyzeLeaseRouter.post("/", async (req, res) => {
  try {
    const { leaseText, details } = req.body;

    if (!leaseText || typeof leaseText !== "string") {
      return res.status(400).json({
        error: "leaseText is required",
      });
    }

    console.log("Analyzing lease text length:", leaseText.length);

    const result = await analyzeLeaseWithGemma({
      leaseText,
      details,
    });

    const monthlyBudget = getMonthlyBudget(details);
    const monthlyRent =
      result.extracted.monthlyRent ?? extractMonthlyRentFromText(leaseText);
    const affordabilityScore = calculateAffordabilityScore(
      monthlyRent,
      monthlyBudget,
    );

    result.extracted.monthlyRent = monthlyRent;
    result.breakdown.affordability = affordabilityScore;
    result.overallScore = calculateOverallScore(result.breakdown);

    console.log("Affordability scoring:", {
      monthlyRent,
      monthlyBudget,
      affordabilityScore,
    });

    res.json(result);
  } catch (error) {
    console.error("Lease analysis failed:", error);

    res.status(500).json({
      error: "Failed to analyze lease",
    });
  }
});
