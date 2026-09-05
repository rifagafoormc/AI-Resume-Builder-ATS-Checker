import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import LivePreview from "./LivePreview";

function Education() {
  const navigate = useNavigate();

  const [education, setEducation] = useState([
    {
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ]);

  const [baseDraft, setBaseDraft] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  // State to track if we are enhancing a specific description
  const [enhancingIndex, setEnhancingIndex] = useState(null);

  useEffect(() => {
    const savedDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const template = localStorage.getItem("selectedTemplate") || "professional";
    setSelectedTemplate(template);

    const { education: savedEducation, ...rest } = savedDraft;
    setBaseDraft(rest);

    if (savedEducation) setEducation(savedEducation);
  }, []);

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  // New function to handle AI enhancement for Description
  const handleAIEnhance = (index) => {
    if (!education[index].description.trim()) {
      alert("Please write a brief description first so the AI can enhance it.");
      return;
    }

    setEnhancingIndex(index);

    // Simulate AI API call delay
    setTimeout(() => {
      const currentDesc = education[index].description;
      const enhancedDescription = `Pursued rigorous coursework and hands-on projects in ${currentDesc}. Demonstrated strong analytical, problem-solving, and collaborative skills through active participation in academic and extracurricular activities.`;

      const updated = [...education];
      updated[index] = { ...updated[index], description: enhancedDescription };
      setEducation(updated);
      
      setEnhancingIndex(null);
    }, 1500);
    
    // Note: Replace the setTimeout block above with your actual fetch/axios call to your AI backend
  };

  const handleContinue = () => {
    const existingDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const updatedDraft = {
      ...existingDraft,
      education,
    };
    localStorage.setItem("resumeDraft", JSON.stringify(updatedDraft));
    navigate("/experience-skills");
  };

  const handleBack = () => {
    const savedDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    
    if (savedDraft._id) {
      navigate(`/basic-details/${savedDraft._id}`);
    } else {
      navigate("/basic-details");
    }
  };

  // FIXED: No more empty arrays, previous data is preserved
  const previewData = {
    ...baseDraft,
    education,
  };

  return (
    <div className="builder-page split" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
      <div className="builder-form-half">
        <div className="builder-container" style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 50px rgba(0, 0, 0, 0.06)" }}>
          <div className="builder-header">
            {/* Forced to Green with !important */}
            <h1 style={{ color: "#199E72 !important", WebkitTextFillColor: "#199E72 !important" }}>🎓 Education</h1>
            <p style={{ color: "#4A5568" }}>Add your educational background.</p>
            <div className="progress-steps">
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step active" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>2</span>
              <span className="step-line"></span>
              <span className="step">3</span>
              <span className="step-line"></span>
              <span className="step">4</span>
              <span className="step-line"></span>
              <span className="step">5</span>
            </div>
          </div>

          <div className="builder-form">
            {education.map((item, index) => (
              <div key={index} className="repeatable-card" style={{ backgroundColor: "#E6F2F0", border: "1px solid #D5F5E3", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                <div className="card-header">
                  <span className="card-number" style={{ backgroundColor: "#D5F5E3", color: "#165B6D", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "50px" }}>#{index + 1}</span>
                  {education.length > 1 && (
                    <button className="remove-btn" onClick={() => removeEducation(index)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "18px", cursor: "pointer", padding: "4px 8px" }}>
                      ✕
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Institution</label>
                    <input
                      type="text"
                      placeholder="e.g., Stanford University"
                      value={item.institution}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      style={{
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "14px",
                        color: "#1a1a2e",
                        background: "#fafbfc",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#199E72"; e.target.style.boxShadow = "0 0 0 4px rgba(25, 158, 114, 0.1)"; e.target.style.background = "#fff"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Degree</label>
                    <input
                      type="text"
                      placeholder="e.g., Bachelor of Science"
                      value={item.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      style={{
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "14px",
                        color: "#1a1a2e",
                        background: "#fafbfc",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#199E72"; e.target.style.boxShadow = "0 0 0 4px rgba(25, 158, 114, 0.1)"; e.target.style.background = "#fff"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Field of Study</label>
                    <input
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={item.field}
                      onChange={(e) => updateEducation(index, "field", e.target.value)}
                      style={{
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "14px",
                        color: "#1a1a2e",
                        background: "#fafbfc",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#199E72"; e.target.style.boxShadow = "0 0 0 4px rgba(25, 158, 114, 0.1)"; e.target.style.background = "#fff"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Location</label>
                    <input
                      type="text"
                      placeholder="e.g., San Francisco, CA"
                      value={item.location || ""}
                      onChange={(e) => updateEducation(index, "location", e.target.value)}
                      style={{
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "14px",
                        color: "#1a1a2e",
                        background: "#fafbfc",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#199E72"; e.target.style.boxShadow = "0 0 0 4px rgba(25, 158, 114, 0.1)"; e.target.style.background = "#fff"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Start Date</label>
                    <input
                      type="month"
                      value={item.startDate}
                      onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                      style={{
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "14px",
                        color: "#1a1a2e",
                        background: "#fafbfc",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#199E72"; e.target.style.boxShadow = "0 0 0 4px rgba(25, 158, 114, 0.1)"; e.target.style.background = "#fff"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>End Date</label>
                    <input
                      type="month"
                      value={item.endDate}
                      onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                      disabled={item.current}
                      style={{
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "14px",
                        color: "#1a1a2e",
                        background: "#fafbfc",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#199E72"; e.target.style.boxShadow = "0 0 0 4px rgba(25, 158, 114, 0.1)"; e.target.style.background = "#fff"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label style={{ color: "#165B6D" }}>
                    <input
                      type="checkbox"
                      checked={item.current || false}
                      onChange={(e) => updateEducation(index, "current", e.target.checked)}
                      style={{ accentColor: "#199E72" }}
                    />
                    Currently studying here
                  </label>
                </div>

                {/* DESCRIPTION SECTION WITH AI BUTTON */}
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ margin: 0, color: "#165B6D" }}>Description (Optional)</label>
                    <button
                      type="button"
                      className="ai-enhance-btn"
                      onClick={() => handleAIEnhance(index)}
                      disabled={enhancingIndex === index}
                      style={{
                        backgroundColor: "#E6F2F0",
                        color: "#165B6D",
                        border: "1px solid #199E72",
                        borderRadius: "6px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      {enhancingIndex === index ? "✨ Enhancing..." : "✨ AI Enhance"}
                    </button>
                  </div>
                  <textarea
                    placeholder="Brief description of your studies, achievements, or activities..."
                    rows="3"
                    value={item.description || ""}
                    onChange={(e) => updateEducation(index, "description", e.target.value)}
                    style={{
                      padding: "12px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "14px",
                      color: "#1a1a2e",
                      background: "#fafbfc",
                      width: "100%",
                      resize: "vertical",
                      minHeight: "80px",
                      fontFamily: "inherit",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#199E72"; e.target.style.boxShadow = "0 0 0 4px rgba(25, 158, 114, 0.1)"; e.target.style.background = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
                  />
                </div>

              </div>
            ))}

            <button className="add-btn" onClick={addEducation} style={{ background: "transparent", color: "#165B6D", border: "2px dashed #199E72", padding: "12px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", width: "100%", marginBottom: "20px", transition: "all 0.3s ease" }}>
              + Add Education
            </button>

            <div className="builder-actions">
              <button type="button" className="btn-back" onClick={handleBack} style={{ background: "transparent", color: "#165B6D", border: "2px solid #165B6D", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }}>
                ← Back
              </button>
              <button type="button" className="btn-continue" onClick={handleContinue} style={{ background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)", color: "#ffffff", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 15px rgba(22, 91, 109, 0.3)", transition: "all 0.3s ease" }}>
                Continue to Experience →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="builder-preview-half">
        <LivePreview data={previewData} template={selectedTemplate} />
      </div>
    </div>
  );
}

export default Education;