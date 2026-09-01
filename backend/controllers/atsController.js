const ATSAnalysis = require("../models/ATSAnalysis");
const Resume = require("../models/Resume");

// Analyze resume against job description
const analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    // Check required fields
    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        message: "Resume ID and job description are required"
      });
    }

    // Find the resume belonging to the logged-in user
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.userId
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    // Combine resume information into text
    const resumeText = [
      resume.title,
      resume.summary,
      ...resume.skills,
      ...resume.experience.map(
        (item) =>
          `${item.position || ""} ${item.company || ""} ${item.description || ""}`
      ),
      ...resume.projects.map(
        (item) =>
          `${item.name || ""} ${item.description || ""} ${item.technologies || ""}`
      )
    ]
      .join(" ")
      .toLowerCase();

    // Extract words from job description
    const words = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2);

    // Remove duplicate words
    const keywords = [...new Set(words)];

    // Find matched and missing keywords
    const matchedKeywords = keywords.filter((keyword) =>
      resumeText.includes(keyword)
    );

    const missingKeywords = keywords.filter(
      (keyword) => !resumeText.includes(keyword)
    );

    // Calculate ATS score
    const atsScore =
      keywords.length > 0
        ? Math.round((matchedKeywords.length / keywords.length) * 100)
        : 0;

    // Generate basic suggestions
    const suggestions = [];

    if (atsScore < 50) {
      suggestions.push(
        "Add more relevant skills and keywords from the job description."
      );
    }

    if (resume.summary && resume.summary.length < 50) {
      suggestions.push(
        "Consider writing a more detailed professional summary."
      );
    }

    if (missingKeywords.length > 0) {
      suggestions.push(
        `Consider adding relevant missing keywords: ${missingKeywords
          .slice(0, 5)
          .join(", ")}.`
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Your resume has good keyword coverage for this job description."
      );
    }

    // Save analysis to MongoDB
    const analysis = await ATSAnalysis.create({
      user: req.user.userId,
      resume: resumeId,
      jobDescription,
      atsScore,
      matchedKeywords,
      missingKeywords,
      suggestions
    });

    res.status(201).json({
      message: "ATS analysis completed successfully",
      analysis
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to analyze resume",
      error: error.message
    });
  }
};


// Get ATS analysis history
const getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await ATSAnalysis.find({
      user: req.user.userId
    })
      .populate("resume", "title")
      .sort({ createdAt: -1 });

    res.json({
      analyses
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ATS analysis history",
      error: error.message
    });
  }
};


// Get one ATS analysis
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await ATSAnalysis.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate("resume", "title");

    if (!analysis) {
      return res.status(404).json({
        message: "ATS analysis not found"
      });
    }

    res.json({
      analysis
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ATS analysis",
      error: error.message
    });
  }
};


// Delete ATS analysis
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await ATSAnalysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!analysis) {
      return res.status(404).json({
        message: "ATS analysis not found"
      });
    }

    res.json({
      message: "ATS analysis deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ATS analysis",
      error: error.message
    });
  }
};


module.exports = {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis
};