import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AnalysisResult, HousingDetails } from "@/lib/types";

const CURRENT_ANALYSIS_KEY = "currentLeaseAnalysis";

interface AnalysisContextValue {
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult | null) => void;
  details: HousingDetails | null;
  setDetails: (d: HousingDetails | null) => void;
  notes: string;
  setNotes: (notes: string) => void;
  reviewedQuestionKeys: string[];
  setReviewedQuestionKeys: (keys: string[]) => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeQuestionKeys(keys: unknown) {
  if (!Array.isArray(keys)) {
    return [];
  }

  return [
    ...new Set(
      keys.filter((key): key is string => typeof key === "string" && key.length > 0),
    ),
  ];
}

function getStoredCurrentAnalysis() {
  if (!isBrowser()) {
    return {
      result: null,
      details: null,
      notes: "",
      reviewedQuestionKeys: [],
    };
  }

  const raw = localStorage.getItem(CURRENT_ANALYSIS_KEY);

  if (!raw) {
    return {
      result: null,
      details: null,
      notes: "",
      reviewedQuestionKeys: [],
    };
  }

  try {
    const parsed = JSON.parse(raw);

    return {
      result: parsed.result ?? null,
      details: parsed.details ?? null,
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
      reviewedQuestionKeys: normalizeQuestionKeys(parsed.reviewedQuestionKeys),
    };
  } catch {
    return {
      result: null,
      details: null,
      notes: "",
      reviewedQuestionKeys: [],
    };
  }
}

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [initialAnalysis] = useState(getStoredCurrentAnalysis);
  const [result, setResult] = useState<AnalysisResult | null>(initialAnalysis.result);
  const [details, setDetails] = useState<HousingDetails | null>(initialAnalysis.details);
  const [notes, setNotes] = useState(initialAnalysis.notes);
  const [reviewedQuestionKeys, setReviewedQuestionKeys] = useState<string[]>(
    initialAnalysis.reviewedQuestionKeys,
  );

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    if (!result) {
      localStorage.removeItem(CURRENT_ANALYSIS_KEY);
      return;
    }

    localStorage.setItem(
      CURRENT_ANALYSIS_KEY,
      JSON.stringify({
        result,
        details,
        notes,
        reviewedQuestionKeys,
      }),
    );
  }, [details, notes, result, reviewedQuestionKeys]);

  return (
    <AnalysisContext.Provider
      value={{
        result,
        setResult,
        details,
        setDetails,
        notes,
        setNotes,
        reviewedQuestionKeys,
        setReviewedQuestionKeys,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within AnalysisProvider");
  return ctx;
};
