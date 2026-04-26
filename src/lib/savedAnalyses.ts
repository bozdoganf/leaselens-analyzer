import type { AnalysisResult, SavedLeaseAnalysis } from "./types";
import { parseMonthlyBudget, recalculateAnalysisForBudget } from "./pricing";

const SAVED_ANALYSES_KEY = "savedLeaseAnalyses";

function isBrowser() {
  return typeof window !== "undefined";
}

function getFallbackName(result: AnalysisResult, count: number) {
  if (result.extracted.propertyAddress) {
    return result.extracted.propertyAddress;
  }

  if (result.priceInsight.rent) {
    return `${result.priceInsight.rent} lease option`;
  }

  return `Lease option ${count + 1}`;
}

function getAnalysisFingerprint(result: AnalysisResult) {
  return JSON.stringify({
    address: result.extracted.propertyAddress,
    rent: result.extracted.monthlyRent,
    leaseTerm: result.extracted.leaseTerm,
    summary: result.summary,
    riskTitles: result.riskFlags.map((flag) => flag.title),
  });
}

function normalizeQuestionKeys(keys: string[] = []) {
  return [...new Set(keys.filter(Boolean))];
}

function haveSameQuestionKeys(a: string[] = [], b: string[] = []) {
  const normalizedA = normalizeQuestionKeys(a);
  const normalizedB = normalizeQuestionKeys(b);

  if (normalizedA.length !== normalizedB.length) {
    return false;
  }

  const bKeys = new Set(normalizedB);
  return normalizedA.every((key) => bKeys.has(key));
}

export function getSavedAnalyses(): SavedLeaseAnalysis[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = localStorage.getItem(SAVED_ANALYSES_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const monthlyBudget = parseMonthlyBudget(localStorage.getItem("monthlyBudget"));
    return parsed.map((analysis) => ({
      ...analysis,
      notes: analysis.notes ?? "",
      reviewedQuestionKeys: normalizeQuestionKeys(analysis.reviewedQuestionKeys ?? []),
      result: recalculateAnalysisForBudget(analysis.result, monthlyBudget),
    }));
  } catch {
    return [];
  }
}

export function saveAnalysis(
  result: AnalysisResult,
  notes = "",
  reviewedQuestionKeys: string[] = [],
) {
  const saved = getSavedAnalyses();
  const fingerprint = getAnalysisFingerprint(result);
  const existing = saved.find(
    (analysis) => getAnalysisFingerprint(analysis.result) === fingerprint,
  );
  const normalizedReviewedQuestionKeys = normalizeQuestionKeys(reviewedQuestionKeys);

  if (existing) {
    const notesChanged = (existing.notes ?? "") !== notes;
    const reviewedQuestionsChanged = !haveSameQuestionKeys(
      existing.reviewedQuestionKeys,
      normalizedReviewedQuestionKeys,
    );

    if (notesChanged || reviewedQuestionsChanged) {
      const updatedAnalysis = {
        ...existing,
        notes,
        reviewedQuestionKeys: normalizedReviewedQuestionKeys,
      };
      const updated = saved.map((analysis) =>
        analysis.id === existing.id ? updatedAnalysis : analysis,
      );

      localStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify(updated));

      return {
        analysis: updatedAnalysis,
        status: notesChanged ? "notes-updated" as const : "questions-updated" as const,
      };
    }

    return {
      analysis: existing,
      status: "already-saved" as const,
    };
  }

  const analysis: SavedLeaseAnalysis = {
    id: crypto.randomUUID(),
    name: getFallbackName(result, saved.length),
    createdAt: new Date().toISOString(),
    notes,
    reviewedQuestionKeys: normalizedReviewedQuestionKeys,
    result,
  };

  localStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify([analysis, ...saved]));

  return {
    analysis,
    status: "created" as const,
  };
}

export function deleteSavedAnalysis(id: string) {
  const saved = getSavedAnalyses().filter((analysis) => analysis.id !== id);
  localStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify(saved));

  return saved;
}

export function recalculateSavedAnalysesForBudget(monthlyBudget: number) {
  const saved = getSavedAnalyses();
  const updated = saved.map((analysis) => ({
    ...analysis,
    result: recalculateAnalysisForBudget(analysis.result, monthlyBudget),
  }));

  localStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify(updated));

  return updated;
}
