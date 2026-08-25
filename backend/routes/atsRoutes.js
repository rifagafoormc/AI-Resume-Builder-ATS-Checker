const express = require("express");

const router = express.Router();

// Analyze resume
router.post("/analyze", (req, res) => {
  res.json({
    message: "ATS analysis route is working"
  });
});

// Get ATS analysis history
router.get("/history", (req, res) => {
  res.json({
    message: "ATS history route is working"
  });
});

// Get one ATS analysis
router.get("/:id", (req, res) => {
  res.json({
    message: `Get ATS analysis ${req.params.id} route is working`
  });
});

// Delete ATS analysis
router.delete("/:id", (req, res) => {
  res.json({
    message: `Delete ATS analysis ${req.params.id} route is working`
  });
});

module.exports = router;