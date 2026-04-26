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
      result: recalculateAnalysisForBudget(analysis.result, monthlyBudget),
    }));
  } catch {
    return [];
  }
}

export function saveAnalysis(result: AnalysisResult, notes = "") {
  const saved = getSavedAnalyses();
  const fingerprint = getAnalysisFingerprint(result);
  const existing = saved.find(
    (analysis) => getAnalysisFingerprint(analysis.result) === fingerprint,
  );

  if (existing) {
    if ((existing.notes ?? "") !== notes) {
      const updatedAnalysis = {
        ...existing,
        notes,
      };
      const updated = saved.map((analysis) =>
        analysis.id === existing.id ? updatedAnalysis : analysis,
      );

      localStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify(updated));

      return {
        analysis: updatedAnalysis,
        status: "notes-updated" as const,
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
