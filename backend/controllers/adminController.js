const User = require("../models/User");
const Resume = require("../models/Resume");
const ATSAnalysis = require("../models/ATSAnalysis");
const bcrypt = require("bcryptjs");

// ========================================
// ADMIN DASHBOARD
// ========================================
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      role: "user"
    });

    const totalResumes = await Resume.countDocuments();

    const totalATSAnalyses = await ATSAnalysis.countDocuments();

    // Calculate average ATS score
    const scoreResult = await ATSAnalysis.aggregate([
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: "$atsScore"
          }
        }
      }
    ]);

    const averageATSScore =
      scoreResult.length > 0
        ? Math.round(scoreResult[0].averageScore)
        : 0;

    // Recent users
    const recentUsers = await User.find({
      role: "user"
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalResumes,
        totalATSAnalyses,
        averageATSScore
      },
      recentUsers
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message
    });
  }
};


// ========================================
// GET ALL USERS
// ========================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user"
    })
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {

        const resumeCount = await Resume.countDocuments({
          user: user._id
        });

        const atsCount = await ATSAnalysis.countDocuments({
          user: user._id
        });

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          resumeCount,
          atsCount
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithStats
    });

  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};


// ========================================
// ADD USER
// ========================================
const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "user"
    });

    res.status(201).json({
      success: true,
      message: "User added successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Add user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add user",
      error: error.message
    });
  }
};


// ========================================
// DELETE USER
// ========================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Never allow an admin to be deleted
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin users cannot be deleted"
      });
    }

    // Delete all resumes belonging to this user
    await Resume.deleteMany({
      user: user._id
    });

    // Delete all ATS analyses belonging to this user
    await ATSAnalysis.deleteMany({
      user: user._id
    });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully"
    });

  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
};


// ========================================
// GET ALL ATS ANALYSES (UPDATED - ONLY COUNTS PER USER)
// ========================================
const getAllATSAnalyses = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("name")
      .sort({ name: 1 });

    const usersWithATSCounts = await Promise.all(
      users.map(async (user) => {
        const atsCount = await ATSAnalysis.countDocuments({
          user: user._id
        });

        return {
          id: user._id,
          name: user.name,
          atsCount
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithATSCounts
    });

  } catch (error) {
    console.error("Get ATS counts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch ATS analysis counts",
      error: error.message
    });
  }
};


// ========================================
// GET ALL RESUMES (UPDATED - ONLY COUNTS PER USER)
// ========================================
const getAllResumes = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("name email")
      .sort({ name: 1 });

    const usersWithResumeCounts = await Promise.all(
      users.map(async (user) => {
        const resumeCount = await Resume.countDocuments({
          user: user._id
        });

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          resumeCount
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithResumeCounts
    });

  } catch (error) {
    console.error("Get resume counts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume counts",
      error: error.message
    });
  }
};


module.exports = {
  getDashboardStats,
  getAllUsers,
  addUser,
  deleteUser,
  getAllATSAnalyses,
  getAllResumes
};
