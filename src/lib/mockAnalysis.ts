import type { AnalysisResult, CompareOption, HousingDetails } from "./types";

export const SAMPLE_LEASE_TEXT = `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Lease") is made between Sunset Ridge Property Management ("Landlord") and the undersigned Tenant.

1. TERM. The initial term of this Lease shall commence on August 15, 2025 and continue for twelve (12) months. This Lease shall automatically renew for successive twelve (12) month terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term.

2. RENT. Tenant agrees to pay $1,050 per month, due on the first (1st) day of each month. Any rent received after the 5th of the month shall incur a late fee of $75 plus $15 per day until paid in full.

3. UTILITIES. Tenant is responsible for utilities not otherwise specified. Landlord may, at its discretion, include or exclude certain utilities. Tenant should contact providers directly to set up service.

4. MAINTENANCE & REPAIRS. Tenant shall report needed repairs in writing. Landlord will address maintenance requests in a reasonable timeframe based on availability of contractors and severity as determined by Landlord.

5. SECURITY DEPOSIT. A security deposit of $1,500 is due upon signing. Deductions may be made for damages, cleaning, administrative processing, and other reasonable charges.

6. EARLY TERMINATION. Early termination requires payment of two (2) months' rent as a termination fee, plus forfeiture of the security deposit.

7. GUESTS. Guests may not stay more than three (3) consecutive nights without prior written approval from Landlord.

8. ENTRY. Landlord may enter the premises with reasonable notice for inspections, repairs, or showings.`;

export function getMockAnalysis(_text: string, _details: HousingDetails): AnalysisResult {
  return {
    overallScore: 74,
    riskLabel: "Medium Risk",
    recommendation: "Proceed with caution",
    summary:
      "This lease may be workable, but clarify renewal, maintenance, and fee language before signing.",
    extracted: {
      monthlyRent: 1050,
      propertyAddress: null,
      leaseTerm: "12 months",
    },
    breakdown: {
      leaseSafety: 65,
      affordability: 78,
      location: 82,
    },
    riskFlags: [
      {
        title: "Automatic Renewal Clause",
        severity: "high",
        category: "Renewal",
        explanation:
          "This lease may renew automatically unless you give notice far in advance.",
        studentAction:
          "Ask when notice is due and whether automatic renewal can be removed.",
      },
      {
        title: "Unclear Maintenance Timeline",
        severity: "medium",
        category: "Maintenance",
        explanation:
          "The lease does not clearly state how quickly repairs must be handled.",
        studentAction: "Ask for a written maintenance response timeline.",
      },
      {
        title: "Extra Utility Responsibility",
        severity: "medium",
        category: "Utilities",
        explanation:
          "Utility costs are not clearly included, which could increase monthly expenses.",
        studentAction:
          "Ask which utilities are included and estimate average monthly costs.",
      },
    ],
    priceInsight: {
      headline: "Rent appears slightly above the sample average for this area.",
      rent: "$1,050/month",
      areaAverage: "$950/month",
    },
    commuteInsight: {
      headline: "Commute is reasonable for campus access.",
      commute: "18 minutes to campus",
      transportNote: "Good option if biking, walking, or using transit is realistic.",
    },
    questions: [
      "Can you clarify whether the lease renews automatically?",
      "How many days before move-out do I need to give notice?",
      "Which utilities are included in rent?",
      "What is the written maintenance response timeline?",
      "Are there any move-in, cleaning, or administrative fees not shown here?",
    ],
    emailTemplate: {
      subject: "Questions about lease terms",
      body:
        "Hi, I am reviewing the lease and wanted to clarify the renewal terms, maintenance timeline, included utilities, and any additional move-in or move-out fees before signing. Thank you.",
    },
  };
}

export const COMPARE_OPTIONS: CompareOption[] = [
  {
    id: "house-a",
    name: "House A",
    score: 82,
    rent: "$875",
    commute: "14 min",
    mainRisk: "Unclear utilities",
    recommendation: "Best value",
  },
  {
    id: "apartment-b",
    name: "Apartment B",
    score: 61,
    rent: "$1,150",
    commute: "20 min",
    mainRisk: "Auto-renewal",
    recommendation: "Risky",
  },
  {
    id: "studio-c",
    name: "Studio C",
    score: 74,
    rent: "$950",
    commute: "28 min",
    mainRisk: "Far commute",
    recommendation: "Okay option",
  },
];
