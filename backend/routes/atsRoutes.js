const express = require("express");
const multer = require("multer");

const {
  analyzeResume,
  analyzeUploadedResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis
} = require("../controllers/atsController");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ----------------------------------------
// Multer configuration
// ----------------------------------------
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only PDF, DOCX, and TXT files are supported."),
        false
      );
    }
  }
});

// ----------------------------------------
// All ATS routes require authentication
// ----------------------------------------
router.use(authMiddleware);

// ----------------------------------------
// Analyze an already saved resume
// ----------------------------------------
router.post("/analyze", analyzeResume);

// ----------------------------------------
// Analyze an uploaded resume file
// ----------------------------------------
router.post(
  "/analyze-upload",
  upload.single("resume"),
  analyzeUploadedResume
);

// ----------------------------------------
// Get logged-in user's ATS analysis history
// ----------------------------------------
router.get("/history", getAnalysisHistory);

// ----------------------------------------
// Get one ATS analysis
// ----------------------------------------
router.get("/:id", getAnalysisById);

// ----------------------------------------
// Delete one ATS analysis
// ----------------------------------------
router.delete("/:id", deleteAnalysis);

module.exports = router;

