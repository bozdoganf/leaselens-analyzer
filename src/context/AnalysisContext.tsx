import { createContext, useContext, useState, type ReactNode } from "react";
import type { AnalysisResult, HousingDetails } from "@/lib/types";

interface AnalysisContextValue {
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult | null) => void;
  details: HousingDetails | null;
  setDetails: (d: HousingDetails | null) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [details, setDetails] = useState<HousingDetails | null>(null);
  const [notes, setNotes] = useState("");
  return (
    <AnalysisContext.Provider
      value={{ result, setResult, details, setDetails, notes, setNotes }}
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
