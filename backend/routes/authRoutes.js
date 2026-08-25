const express = require("express");
const { signup, login, createAdmin } = require("../controllers/authController");
const {
  authMiddleware,
  requireUser,
  requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Admin creation route (protected by admin secret)
router.post("/create-admin", createAdmin);

// Logout route (client-side token removal)
router.post("/logout", (req, res) => {
  res.json({
    message: "Logout successful"
  });
});

// Protected routes
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user
  });
});

// User-only route
router.get("/check-user", authMiddleware, requireUser, (req, res) => {
  res.json({
    message: "User authorization successful",
    user: req.user
  });
});

// Admin-only route
router.get("/check-admin", authMiddleware, requireAdmin, (req, res) => {
  res.json({
    message: "Admin authorization successful",
    user: req.user
  });
});

module.exports = router;