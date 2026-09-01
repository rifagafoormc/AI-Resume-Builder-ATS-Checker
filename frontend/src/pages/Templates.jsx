import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Fixed: Changed from "./App.css" to "../App.css"

// Fixed: Correct image imports
import modernResume from "../assets/images/modern_resume.png";
import professionalResume from "../assets/images/professional_resume.jpg";
import creativeResume from "../assets/images/creative_resume.jpg";

function Templates() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: "professional",
      name: "Professional",
      description:
        "Clean and professional design suitable for corporate jobs.",
      icon: "💼",
      color: "#667eea",
      image: professionalResume, // Fixed: Using imported variable
    },
    {
      id: "modern",
      name: "Modern",
      description:
        "Modern layout with a fresh and attractive appearance.",
      icon: "✨",
      color: "#764ba2",
      image: modernResume, // Fixed: Using imported variable
    },
    {
      id: "creative",
      name: "Creative",
      description:
        "Creative design for portfolios and innovative roles.",
      icon: "🎨",
      color: "#f093fb",
      image: creativeResume, // Fixed: Using imported variable
    },
  ];

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);

    // Save selected template
    localStorage.setItem("selectedTemplate", templateId);

    // Also save it in the resume draft
    const existingDraft = JSON.parse(
      localStorage.getItem("resumeDraft") || "{}"
    );

    const updatedDraft = {
      ...existingDraft,
      template: templateId,
    };

    localStorage.setItem(
      "resumeDraft",
      JSON.stringify(updatedDraft)
    );
  };

  const handleContinue = () => {
    if (!selectedTemplate) {
      alert("Please select a template first.");
      return;
    }

    navigate("/basic-details");
  };

  return (
    <div className="templates-page">
      <div className="templates-container">
        {/* Header */}
        <div className="templates-header">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
          <h1>Choose Your Template</h1>
          <p>
            Select a template for your professional resume.
          </p>
        </div>

        {/* Template Grid */}
        <div className="templates-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`template-card ${
                selectedTemplate === template.id
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleSelectTemplate(template.id)
              }
            >
              {/* Image Preview */}
              <div className="template-preview-wrapper">
                <div className="template-preview">
                  <img
                    src={template.image}
                    alt={`${template.name} resume template`}
                    className="template-image"
                  />
                </div>

                {/* Selected Badge */}
                {selectedTemplate === template.id && (
                  <div className="selected-badge">
                    ✓ Selected
                  </div>
                )}
              </div>

              {/* Template Information */}
              <div className="template-info">
                <div
                  className="template-icon"
                  style={{
                    background: template.color,
                  }}
                >
                  {template.icon}
                </div>

                <div className="template-text">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              </div>

              {/* Select Button */}
              <button
                type="button"
                className={`select-button ${
                  selectedTemplate === template.id
                    ? "selected"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTemplate(template.id);
                }}
              >
                {selectedTemplate === template.id
                  ? "✓ Selected"
                  : "Select"}
              </button>
            </div>
          ))}
        </div>

        {/* Continue */}
        {selectedTemplate && (
          <div className="continue-section">
            <button
              type="button"
              className="continue-button"
              onClick={handleContinue}
            >
              Continue to Basic Details →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Templates;