import "dotenv/config"; // to read the api key
import { GoogleGenAI } from "@google/genai";
import { analysisSchema, type LeaseAnalysis } from "../schemas/analysisSchema";
import { buildLeaseAnalysisPrompt } from "../prompts/leaseAnalysisPrompt";


const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const ai = new GoogleGenAI({ apiKey });

function parseModelJson(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

export async function analyzeLeaseWithGemma({
  leaseText,
  details,
}: {
  leaseText: string;
  details: unknown;
}): Promise<LeaseAnalysis> {
  const prompt = buildLeaseAnalysisPrompt({ leaseText, details });

  const response = await ai.models.generateContent({
    model: process.env.GEMMA_MODEL || "gemma-3-27b-it",
    contents: prompt,
  });

  const rawText = response.text ?? "";
  const parsed = parseModelJson(rawText);

  return analysisSchema.parse(parsed);
}
