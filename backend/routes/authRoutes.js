const express = require("express");
const { signup, login } = require("../controllers/authController");
const {
  authMiddleware,
  requireUser,
  requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

// Signup
router.post("/signup", signup);

// Login - coming next
router.post("/login", login);

// Logout - coming next
router.post("/logout", (req, res) => {
  res.json({
    message: "Logout route is working"
  });
});

// Profile - coming next
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user
  });
});

router.get("/check-user", authMiddleware, requireUser, (req, res) => {
  res.json({
    message: "User authorization successful",
    user: req.user
  });
});

router.get("/check-admin", authMiddleware, requireAdmin, (req, res) => {
  res.json({
    message: "Admin authorization successful",
    user: req.user
  });
});

module.exports = router;