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
      required: true
    },

    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String
    },

    summary: {
      type: String
    },

    experience: [
      {
        jobTitle: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String
      }
    ],

    education: [
      {
        degree: String,
        institution: String,
        startDate: String,
        endDate: String
      }
    ],

    skills: [
      {
        type: String
      }
    ],

    projects: [
      {
        title: String,
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

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;