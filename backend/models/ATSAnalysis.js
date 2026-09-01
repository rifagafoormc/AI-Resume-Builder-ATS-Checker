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
      default: 0
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

module.exports = mongoose.model("ATSAnalysis", atsAnalysisSchema);