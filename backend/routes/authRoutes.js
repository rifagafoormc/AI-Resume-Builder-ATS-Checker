const express = require("express");
const { 
  signup, 
  login, 
  createAdmin, 
  getProfile, 
  updateProfile, 
  changePassword,
  forgotPassword
} = require("../controllers/authController");
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
// GET /api/auth/profile - Get current user's profile
router.get("/profile", authMiddleware, getProfile);

// PUT /api/auth/profile - Update current user's profile (name)
router.put("/profile", authMiddleware, updateProfile);

// PUT /api/auth/change-password - Change current user's password (Profile)
router.put("/change-password", authMiddleware, changePassword);

// Public route for forgot password
router.put("/forgot-password", forgotPassword);

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