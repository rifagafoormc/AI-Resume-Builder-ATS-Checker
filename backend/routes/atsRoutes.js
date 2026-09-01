const express = require("express");

const {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis
} = require("../controllers/atsController");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// All ATS routes require authentication
router.use(authMiddleware);

// Analyze a resume
router.post("/analyze", analyzeResume);

// Get logged-in user's ATS analysis history
router.get("/history", getAnalysisHistory);

// Get one ATS analysis
router.get("/:id", getAnalysisById);

// Delete one ATS analysis
router.delete("/:id", deleteAnalysis);

module.exports = router;