const express = require("express");

const router = express.Router();

// Create a resume
router.post("/", (req, res) => {
  res.json({
    message: "Create resume route is working"
  });
});

// Get all resumes
router.get("/", (req, res) => {
  res.json({
    message: "Get all resumes route is working"
  });
});

// Get one resume
router.get("/:id", (req, res) => {
  res.json({
    message: `Get resume ${req.params.id} route is working`
  });
});

// Update a resume
router.put("/:id", (req, res) => {
  res.json({
    message: `Update resume ${req.params.id} route is working`
  });
});

// Delete a resume
router.delete("/:id", (req, res) => {
  res.json({
    message: `Delete resume ${req.params.id} route is working`
  });
});

module.exports = router;