const mongoose = require("mongoose");

const atsAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Optional because uploaded files may not belong to a saved Resume document
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null
    },

    jobDescription: {
      type: String,
      required: true
    },

    atsScore: {
      type: Number,
      default: 0
    },

    weightedScore: {
      type: Number,
      default: 0
    },

    componentScores: {
      contentAndImpact: {
        score: {
          type: Number,
          default: 0
        },
        weight: {
          type: Number,
          default: 0.35
        },
        weightedContribution: {
          type: Number,
          default: 0
        },
        analysis: {
          type: String,
          default: ""
        }
      },

      keywordMatch: {
        score: {
          type: Number,
          default: 0
        },
        weight: {
          type: Number,
          default: 0.25
        },
        weightedContribution: {
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

        analysis: {
          type: String,
          default: ""
        }
      },

      skills: {
        score: {
          type: Number,
          default: 0
        },
        weight: {
          type: Number,
          default: 0.25
        },
        weightedContribution: {
          type: Number,
          default: 0
        },

        matchedSkills: [
          {
            type: String
          }
        ],

        missingSkills: [
          {
            type: String
          }
        ],

        analysis: {
          type: String,
          default: ""
        }
      },

      formatting: {
        score: {
          type: Number,
          default: 0
        },
        weight: {
          type: Number,
          default: 0.15
        },
        weightedContribution: {
          type: Number,
          default: 0
        },
        analysis: {
          type: String,
          default: ""
        }
      }
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
        category: {
          type: String,
          default: ""
        },

        priority: {
          type: String,
          default: ""
        },

        suggestion: {
          type: String,
          default: ""
        }
      }
    ],

    summary: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ATSAnalysis", atsAnalysisSchema);

