import { Router } from "express";
import { analyzeLeaseWithGemma } from "../services/gemini";

export const analyzeLeaseRouter = Router();

analyzeLeaseRouter.post("/", async (req, res) => {
  try {
    const { leaseText, details } = req.body;

    if (!leaseText || typeof leaseText !== "string") {
      return res.status(400).json({
        error: "leaseText is required",
      });
    }

    console.log("Analyzing lease text length:", leaseText.length);

    const result = await analyzeLeaseWithGemma({
      leaseText,
      details,
    });

    res.json(result);
  } catch (error) {
    console.error("Lease analysis failed:", error);

    res.status(500).json({
      error: "Failed to analyze lease",
    });
  }
});
