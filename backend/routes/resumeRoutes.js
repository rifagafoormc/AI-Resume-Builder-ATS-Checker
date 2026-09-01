const express = require("express");

const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume
} = require("../controllers/resumeController");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// All resume routes require authentication
router.use(authMiddleware);

// Create resume
router.post("/", createResume);

// Get all resumes
router.get("/", getResumes);

// Get one resume
router.get("/:id", getResume);

// Update resume
router.put("/:id", updateResume);

// Delete resume
router.delete("/:id", deleteResume);

module.exports = router;