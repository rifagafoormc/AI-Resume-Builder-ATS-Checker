const mongoose = require("mongoose");

const atsAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume"
    },

    jobDescription: {
      type: String,
      required: true
    },

    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    matchedKeywords: [
      {
        type: String
      }
    ],

    missingKeywords: [
      {
        type: String
      }
    ],

    suggestions: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const ATSAnalysis = mongoose.model("ATSAnalysis", atsAnalysisSchema);

module.exports = ATSAnalysis;