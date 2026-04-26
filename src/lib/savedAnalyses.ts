import type { AnalysisResult, SavedLeaseAnalysis } from "./types";

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
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(result: AnalysisResult) {
  const saved = getSavedAnalyses();
  const fingerprint = getAnalysisFingerprint(result);
  const existing = saved.find(
    (analysis) => getAnalysisFingerprint(analysis.result) === fingerprint,
  );

  if (existing) {
    return {
      analysis: existing,
      alreadySaved: true,
    };
  }

  const analysis: SavedLeaseAnalysis = {
    id: crypto.randomUUID(),
    name: getFallbackName(result, saved.length),
    createdAt: new Date().toISOString(),
    result,
  };

  localStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify([analysis, ...saved]));

  return {
    analysis,
    alreadySaved: false,
  };
}

export function deleteSavedAnalysis(id: string) {
  const saved = getSavedAnalyses().filter((analysis) => analysis.id !== id);
  localStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify(saved));

  return saved;
}
