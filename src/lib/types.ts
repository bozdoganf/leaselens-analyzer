// LeaseLens type definitions

export type Severity = "low" | "medium" | "high";
export type UtilitiesIncluded = "yes" | "no" | "unknown";

export interface HousingDetails {
  monthlyRent: string;
  neighborhood: string;
  bedrooms: string;
  commuteMinutes: string;
  utilitiesIncluded: UtilitiesIncluded;
  hasCar: boolean;
}

export interface RiskFlag {
  title: string;
  severity: Severity;
  category: string;
  explanation: string;
  studentAction: string;
}

export interface ScoreBreakdown {
  leaseSafety: number;
  affordability: number;
  location: number;
  studentFit: number;
}

export interface AnalysisResult {
  overallScore: number;
  riskLabel: string;
  recommendation: string;
  summary: string;
  breakdown: ScoreBreakdown;
  riskFlags: RiskFlag[];
  priceInsight: {
    headline: string;
    rent: string;
    areaAverage: string;
  };
  commuteInsight: {
    headline: string;
    commute: string;
    transportNote: string;
  };
  questions: string[];
  emailTemplate: { // new emailTemplate class
    subject: string;
    body: string;
  };
}

export interface CompareOption {
  id: string;
  name: string;
  score: number;
  rent: string;
  commute: string;
  mainRisk: string;
  recommendation: string;
}



