const Resume = require("../models/Resume");

// Create resume
const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      user: req.user.userId
    });

    res.status(201).json({
      message: "Resume created successfully",
      resume
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create resume",
      error: error.message
    });
  }
};

// Get all resumes of logged-in user
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.userId
    }).sort({ createdAt: -1 });

    res.json({
      resumes
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resumes",
      error: error.message
    });
  }
};

// Get one resume
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    res.json({
      resume
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resume",
      error: error.message
    });
  }
};

// Update resume
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    res.json({
      message: "Resume updated successfully",
      resume
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update resume",
      error: error.message
    });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    res.json({
      message: "Resume deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete resume",
      error: error.message
    });
  }
};

module.exports = {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume
};