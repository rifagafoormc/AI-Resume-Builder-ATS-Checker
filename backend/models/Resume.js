const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    template: {
      type: String,
      default: "professional"
    },

    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      portfolio: String
    },

    summary: {
      type: String,
      default: ""
    },

    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String
      }
    ],

    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String
      }
    ],

    skills: [
      {
        type: String
      }
    ],

    projects: [
      {
        name: String,
        description: String,
        technologies: String
      }
    ],

    certifications: [
      {
        name: String,
        organization: String,
        date: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Resume", resumeSchema);