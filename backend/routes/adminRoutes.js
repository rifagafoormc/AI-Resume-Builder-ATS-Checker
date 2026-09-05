const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  addUser,
  deleteUser,
  getAllATSAnalyses,
  getAllResumes
} = require("../controllers/adminController");

const {
  authMiddleware,
  requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// ADMIN DASHBOARD
// ========================================

// GET /api/admin/dashboard
router.get(
  "/dashboard",
  authMiddleware,
  requireAdmin,
  getDashboardStats
);


// ========================================
// USER MANAGEMENT
// ========================================

// GET /api/admin/users
router.get(
  "/users",
  authMiddleware,
  requireAdmin,
  getAllUsers
);

// POST /api/admin/users
router.post(
  "/users",
  authMiddleware,
  requireAdmin,
  addUser
);

// DELETE /api/admin/users/:id
router.delete(
  "/users/:id",
  authMiddleware,
  requireAdmin,
  deleteUser
);


// ========================================
// ATS ANALYSIS
// ========================================

// GET /api/admin/ats
router.get(
  "/ats",
  authMiddleware,
  requireAdmin,
  getAllATSAnalyses
);


// ========================================
// RESUMES
// ========================================

// GET /api/admin/resumes
router.get(
  "/resumes",
  authMiddleware,
  requireAdmin,
  getAllResumes
);


module.exports = router;