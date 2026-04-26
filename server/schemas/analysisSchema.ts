import { z } from "zod";

export const analysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  riskLabel: z.string(),
  recommendation: z.string(),
  summary: z.string(),

  breakdown: z.object({
    leaseSafety: z.number().min(0).max(100),
    affordability: z.number().min(0).max(100),
    location: z.number().min(0).max(100),
    studentFit: z.number().min(0).max(100),
  }),

  riskFlags: z.array(
    z.object({
      title: z.string(),
      severity: z.enum(["low", "medium", "high"]),
      category: z.string(),
      explanation: z.string(),
      studentAction: z.string(),
    }),
  ),

  priceInsight: z.object({
    headline: z.string(),
    rent: z.string(),
    areaAverage: z.string(),
  }),

  commuteInsight: z.object({
    headline: z.string(),
    commute: z.string(),
    transportNote: z.string(),
  }),

  questions: z.array(z.string()),

  emailTemplate: z.object({
    subject: z.string(),
    body: z.string(),
  }),
});

export type LeaseAnalysis = z.infer<typeof analysisSchema>;


// what does this do: 