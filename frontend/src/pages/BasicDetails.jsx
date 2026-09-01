import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function BasicDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    jobTitle: "", // NEW: Job Title field
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
  });

  useEffect(() => {
    const savedDraft = JSON.parse(
      localStorage.getItem("resumeDraft") || "{}"
    );

    if (Object.keys(savedDraft).length > 0) {
      setFormData((previous) => ({
        ...previous,
        ...savedDraft,
        personalInfo: {
          ...previous.personalInfo,
          ...(savedDraft.personalInfo || {}),
        },
      }));
    }
  }, []);

  const handlePersonalInfoChange = (e) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    if (!formData.title.trim()) {
      alert("Please enter a resume title.");
      return;
    }

    if (!formData.personalInfo.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.personalInfo.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    const existingDraft = JSON.parse(
      localStorage.getItem("resumeDraft") || "{}"
    );

    const updatedDraft = {
      ...existingDraft,
      ...formData,
    };

    localStorage.setItem(
      "resumeDraft",
      JSON.stringify(updatedDraft)
    );

    navigate("/experience");
  };

  return (
    <div className="builder-page">
      <div className="builder-container">
        <div className="builder-header">
          <h1>Basic Details</h1>
          <p>Enter your personal and professional information.</p>
        </div>

        <div className="builder-form">
          <div className="form-group">
            <label>Resume Title</label>
            <input
              type="text"
              name="title"
              placeholder="Example: Software Developer Resume"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* NEW: Job Title Field */}
          <div className="form-group">
            <label>Job Title / Professional Headline</label>
            <input
              type="text"
              name="jobTitle"
              placeholder="e.g., Senior Full Stack Developer, Marketing Manager, Creative Director"
              value={formData.jobTitle}
              onChange={handleChange}
            />
            <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
              This will appear as your professional title beneath your name on the resume
            </small>
          </div>

          <div className="form-section-divider">
            <h2>Personal Information</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Your full name"
                value={formData.personalInfo.fullName}
                onChange={handlePersonalInfoChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.personalInfo.email}
                onChange={handlePersonalInfoChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.personalInfo.phone}
                onChange={handlePersonalInfoChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="Kozhikode, Kerala"
                value={formData.personalInfo.location}
                onChange={handlePersonalInfoChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn profile URL"
                value={formData.personalInfo.linkedin}
                onChange={handlePersonalInfoChange}
              />
            </div>

            <div className="form-group">
              <label>GitHub</label>
              <input
                type="text"
                name="github"
                placeholder="GitHub profile URL"
                value={formData.personalInfo.github}
                onChange={handlePersonalInfoChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Portfolio</label>
            <input
              type="text"
              name="portfolio"
              placeholder="Portfolio URL"
              value={formData.personalInfo.portfolio}
              onChange={handlePersonalInfoChange}
            />
          </div>

          <div className="form-group">
            <label>Professional Summary</label>
            <textarea
              name="summary"
              rows="6"
              placeholder="Write a short professional summary..."
              value={formData.summary}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="builder-actions">
          <button
            type="button"
            className="btn-back"
            onClick={() => navigate("/templates")}
          >
            ← Back
          </button>
          <button
            type="button"
            className="btn-continue"
            onClick={handleContinue}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default BasicDetails;