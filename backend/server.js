// backend/server.js
require('dotenv').config(); // ← MUST BE FIRST - Load environment variables

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const atsRoutes = require("./routes/atsRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ✅ ADDED

// Debug: Check if GEMINI_API_KEY is loaded
console.log("🔑 GEMINI_API_KEY status:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ NOT LOADED");
if (process.env.GEMINI_API_KEY) {
  console.log("🔑 API Key starts with:", process.env.GEMINI_API_KEY.substring(0, 15) + "...");
} else {
  console.log("⚠️  Please add GEMINI_API_KEY to your .env file");
  console.log("📝 Example: GEMINI_API_KEY=AIzaSy...");
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware - logs all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/admin", adminRoutes); // ✅ ADDED

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Builder API is running",
    environment: process.env.NODE_ENV || "development",
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global error handler:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Start server locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`\n✨ Server ready!\n`);
  });
}

// Export Express app for Vercel
module.exports = app;