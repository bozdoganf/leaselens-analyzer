import "dotenv/config"; // to read the api key
import { GoogleGenAI, createPartFromBase64 } from "@google/genai";
import { analysisSchema, type LeaseAnalysis } from "../schemas/analysisSchema";
import { buildLeaseAnalysisPrompt } from "../prompts/leaseAnalysisPrompt";


const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const ai = new GoogleGenAI({ apiKey });
const defaultModel = process.env.GEMMA_MODEL || "gemma-3-27b-it";
const fileExtractionModel =
  process.env.FILE_EXTRACTION_MODEL || "gemini-2.5-flash";

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
    model: defaultModel,
    contents: prompt,
  });

  const rawText = response.text ?? "";
  const parsed = parseModelJson(rawText);

  return analysisSchema.parse(parsed);
}

export async function extractLeaseTextFromFileWithGemma({
  base64Data,
  mimeType,
  fileName,
}: {
  base64Data: string;
  mimeType: string;
  fileName: string;
}) {
  const response = await ai.models.generateContent({
    model: fileExtractionModel,
    contents: [
      {
        text: `
Extract the complete readable lease text from the attached file.

File name: ${fileName}
File type: ${mimeType}

Rules:
- Return only the extracted lease text.
- Preserve section headings, numbered clauses, dates, addresses, rent amounts, fees, and signatures when visible.
- Do not analyze the lease.
- Do not summarize.
- If the file does not contain readable lease text, return an empty string.
`,
      },
      createPartFromBase64(base64Data, mimeType),
    ],
  });

  return (response.text ?? "").trim();
}
