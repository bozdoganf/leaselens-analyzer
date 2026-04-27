import { Router } from "express";
import multer from "multer";
import {
  extractTextFromLeaseFile,
  isSupportedLeaseFile,
} from "../services/extractText";
import {
  extractPropertyAddressFromText,
  normalizePropertyAddress,
} from "../services/addressExtraction";
import { analyzeLeaseWithGemma } from "../services/gemini";
import { calculateLocationScoring } from "../services/locationScoring";

export const analyzeLeaseRouter = Router();

const DEFAULT_MONTHLY_BUDGET = 2000;
const MAX_LEASE_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_LEASE_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!isSupportedLeaseFile(file)) {
      cb(
        new Error(
          "Unsupported file type. Upload a PDF, screenshot, DOCX, or text file.",
        ),
      );
      return;
    }

    cb(null, true);
  },
});

function parseMoneyValue(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/[$,\s]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function getMonthlyBudget(details: unknown) {
  if (!details || typeof details !== "object" || !("monthlyBudget" in details)) {
    return DEFAULT_MONTHLY_BUDGET;
  }

  const monthlyBudget = parseMoneyValue(
    (details as { monthlyBudget?: unknown }).monthlyBudget,
  );

  return monthlyBudget && monthlyBudget > 0
    ? monthlyBudget
    : DEFAULT_MONTHLY_BUDGET;
}

function getUniversityId(details: unknown) {
  if (!details || typeof details !== "object" || !("universityId" in details)) {
    return undefined;
  }

  return (details as { universityId?: unknown }).universityId;
}

function parseDetails(details: unknown) {
  if (typeof details !== "string") {
    return details;
  }

  try {
    return JSON.parse(details);
  } catch {
    return {};
  }
}

function getBodyLeaseText(leaseText: unknown) {
  return typeof leaseText === "string" ? leaseText.trim() : "";
}

function extractMonthlyRentFromText(leaseText: string) {
  const rentBeforeMonthMatch = leaseText.match(
    /\$?\s*([\d,]+(?:\.\d{1,2})?)\s*(?:\/|\s+per\s+)?\s*(?:month|monthly)\b/i,
  );

  if (rentBeforeMonthMatch) {
    return parseMoneyValue(rentBeforeMonthMatch[1]);
  }

  const monthlyRentLabelMatch = leaseText.match(
    /\b(?:monthly\s+rent|rent)\s*:\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i,
  );

  if (monthlyRentLabelMatch) {
    return parseMoneyValue(monthlyRentLabelMatch[1]);
  }

  return null;
}

function calculateAffordabilityScore(monthlyRent: number | null, monthlyBudget: number) {
  if (!monthlyRent || monthlyRent <= 0 || monthlyBudget <= 0) {
    return 0;
  }

  const rentToBudgetRatio = monthlyRent / monthlyBudget;

  if (rentToBudgetRatio <= 0.5) {
    return 100;
  }

  if (rentToBudgetRatio <= 1) {
    return Math.round(100 - ((rentToBudgetRatio - 0.5) / 0.5) * 40);
  }

  if (rentToBudgetRatio <= 1.25) {
    return Math.round(60 - ((rentToBudgetRatio - 1) / 0.25) * 60);
  }

  return 0;
}

function calculateOverallScore(breakdown: {
  leaseSafety: number;
  affordability: number;
  location: number;
}) {
  return Math.round(
    (breakdown.leaseSafety +
      breakdown.affordability +
      breakdown.location) /
      3,
  );
}

analyzeLeaseRouter.post(
  "/",
  (req, res, next) => {
    upload.single("leaseFile")(req, res, (error) => {
      if (!error) {
        next();
        return;
      }

      const message =
        error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
          ? "Lease file must be 10MB or smaller."
          : error.message;

      res.status(400).json({ error: message });
    });
  },
  async (req, res) => {
    try {
      const details = parseDetails(req.body.details);
      const pastedLeaseText = getBodyLeaseText(req.body.leaseText);
      const uploadedLeaseText = !pastedLeaseText && req.file
        ? await extractTextFromLeaseFile(req.file)
        : "";
      const leaseText = pastedLeaseText || uploadedLeaseText;

      if (!leaseText) {
        return res.status(400).json({
          error:
            "Could not find readable lease text. Try a clearer screenshot, a PDF with selectable text, or paste the lease text.",
        });
      }

      console.log("Analyzing lease text length:", leaseText.length);

      const result = await analyzeLeaseWithGemma({
        leaseText,
        details,
      });

      const monthlyBudget = getMonthlyBudget(details);
      const monthlyRent =
        result.extracted.monthlyRent ?? extractMonthlyRentFromText(leaseText);
      const affordabilityScore = calculateAffordabilityScore(
        monthlyRent,
        monthlyBudget,
      );

      result.extracted.monthlyRent = monthlyRent;
      result.extracted.propertyAddress =
        normalizePropertyAddress(result.extracted.propertyAddress) ??
        extractPropertyAddressFromText(leaseText);
      result.breakdown.affordability = affordabilityScore;

      const locationScoring = await calculateLocationScoring({
        propertyAddress: result.extracted.propertyAddress,
        universityId: getUniversityId(details),
      });

      if (locationScoring.score !== null) {
        result.breakdown.location = locationScoring.score;
      }

      result.commuteInsight = locationScoring.commuteInsight;
      result.overallScore = calculateOverallScore(result.breakdown);

      console.log("Affordability scoring:", {
        monthlyRent,
        monthlyBudget,
        affordabilityScore,
      });
      console.log("Location scoring:", {
        propertyAddress: result.extracted.propertyAddress,
        universityId: getUniversityId(details),
        locationScore: locationScoring.score,
      });

      res.json(result);
    } catch (error) {
      console.error("Lease analysis failed:", error);

      if (
        error instanceof Error &&
        error.message.startsWith("Could not read text from this file")
      ) {
        return res.status(400).json({
          error: error.message,
        });
      }

      res.status(500).json({
        error: "Failed to analyze lease",
      });
    }
  },
);
