export function buildLeaseAnalysisPrompt({
  leaseText,
  details,
}: {
  leaseText: string;
  details: unknown;
}) {
  return `
You are LeaseLens, an educational lease-risk analyzer for college students.

Analyze the lease text and housing details below. Find hidden clauses, risky obligations, confusing fees, and landlord negotiation points.

Focus especially on:
- automatic renewal
- vague maintenance timelines
- excessive late fees
- unclear utilities
- security deposit deductions
- early termination penalties
- guest restrictions
- landlord entry rights
- subleasing restrictions
- parking, towing, or vehicle rules
- admin, cleaning, or move-out fees
- clauses that are easy for a student tenant to miss

Housing details:
${JSON.stringify(details, null, 2)}

Lease text:
${leaseText}

Return ONLY valid JSON.
Do not wrap the JSON in markdown.
Do not include explanations outside the JSON.
Do not add extra keys.
Do not omit required keys.

Return JSON exactly in this shape:
{
  "overallScore": 0,
  "riskLabel": "",
  "recommendation": "",
  "summary": "",
  "extracted": {
    "monthlyRent": null,
    "propertyAddress": null,
    "leaseTerm": null
  },
  "breakdown": {
    "leaseSafety": 0,
    "affordability": 0,
    "location": 0,
    "studentFit": 0
  },
  "riskFlags": [
    {
      "title": "",
      "severity": "low",
      "category": "",
      "explanation": "",
      "studentAction": ""
    }
  ],
  "priceInsight": {
    "headline": "",
    "rent": "",
    "areaAverage": ""
  },
  "commuteInsight": {
    "headline": "",
    "commute": "",
    "transportNote": ""
  },
  "questions": [""],
  "emailTemplate": {
    "subject": "",
    "body": ""
  }
}

Rules:
- overallScore must be a number from 0 to 100.
- extracted.monthlyRent must be the monthly rent as a number only, with no dollar sign or text. Use null if the monthly rent is not found.
- extracted.propertyAddress should be the property address as a string. Use null if not found.
- extracted.leaseTerm should be the lease term as a string. Use null if not found.
- breakdown.leaseSafety must be a number from 0 to 100.
- breakdown.affordability must be a number from 0 to 100.
- breakdown.location must be a number from 0 to 100.
- breakdown.studentFit must be a number from 0 to 100.
- riskFlags must be an array of objects, not strings.
- riskFlags[].severity must be exactly one of: "low", "medium", "high".
- priceInsight must be an object, not a string.
- commuteInsight must be an object, not a string.
- emailTemplate must be an object with subject and body, not a string.
- emailTemplate.body should be a polite email the student can send to the landlord asking about the most important risky or unclear clauses.
- Use plain English.
- Make clear this is educational guidance, not legal advice.
`;
}
