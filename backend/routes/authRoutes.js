const express = require("express");

const router = express.Router();

// Signup
router.post("/signup", (req, res) => {
  res.json({
    message: "Signup route is working"
  });
});

// Login
router.post("/login", (req, res) => {
  res.json({
    message: "Login route is working"
  });
});

// Logout
router.post("/logout", (req, res) => {
  res.json({
    message: "Logout route is working"
  });
});

// Profile
router.get("/profile", (req, res) => {
  res.json({
    message: "Profile route is working"
  });
});

// Check user
router.get("/check-user", (req, res) => {
  res.json({
    message: "User authorization route is working"
  });
});

// Check admin
router.get("/check-admin", (req, res) => {
  res.json({
    message: "Admin authorization route is working"
  });
});

module.exports = router;