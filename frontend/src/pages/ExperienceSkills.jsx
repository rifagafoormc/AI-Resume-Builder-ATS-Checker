import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import LivePreview from "./LivePreview";

function ExperienceSkills() {
  const navigate = useNavigate();

  const [experience, setExperience] = useState([
    {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ]);

  const [skills, setSkills] = useState([""]);

  const [baseDraft, setBaseDraft] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  // State to track which experience description is currently being enhanced
  const [enhancingIndex, setEnhancingIndex] = useState(null);

  useEffect(() => {
    const savedDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const template = localStorage.getItem("selectedTemplate") || "professional";
    setSelectedTemplate(template);

    const { experience: savedExperience, skills: savedSkills, ...rest } = savedDraft;
    setBaseDraft(rest);

    if (savedExperience) setExperience(savedExperience);
    if (savedSkills) setSkills(savedSkills);
  }, []);

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    if (experience.length > 1) {
      setExperience(experience.filter((_, i) => i !== index));
    }
  };

  const updateSkill = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  // New function to handle AI enhancement for Experience Description
  const handleAIEnhance = (index) => {
    if (!experience[index].description.trim()) {
      alert("Please write a brief description first so the AI can enhance it.");
      return;
    }

    setEnhancingIndex(index);

    // Simulate AI API call delay
    setTimeout(() => {
      const currentDesc = experience[index].description;
      const enhancedDescription = `Spearheaded key initiatives focused on ${currentDesc}. Leveraged cross-functional collaboration and data-driven strategies to optimize workflows, improve efficiency, and deliver measurable results that exceeded stakeholder expectations.`;

      const updated = [...experience];
      updated[index] = { ...updated[index], description: enhancedDescription };
      setExperience(updated);
      
      setEnhancingIndex(null);
    }, 1500);
    
    // Note: Replace the setTimeout block above with your actual fetch/axios call to your AI backend
  };

  const handleContinue = () => {
    const existingDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const updatedDraft = {
      ...existingDraft,
      experience,
      skills: skills.filter((skill) => skill.trim() !== ""),
    };
    localStorage.setItem("resumeDraft", JSON.stringify(updatedDraft));
    navigate("/projects");
  };

  const handleBack = () => {
    const savedDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    
    if (savedDraft._id) {
      navigate(`/basic-details/${savedDraft._id}`);
    } else {
      navigate("/basic-details");
    }
  };

  // FIXED: Only add current section, all other data flows from baseDraft
  const previewData = {
    ...baseDraft,
    experience,
    skills: skills.filter((skill) => skill.trim() !== ""),
  };

  return (
    <div className="builder-page split" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
      <div className="builder-form-half">
        <div className="builder-container" style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 50px rgba(0, 0, 0, 0.06)" }}>
          <div className="builder-header">
            {/* Forced to Green */}
            <h1 style={{ color: "#199E72 !important", WebkitTextFillColor: "#199E72 !important" }}>💼 Work Experience & Skills</h1>
            <p style={{ color: "#4A5568" }}>Add your professional experience and key skills.</p>
            <div className="progress-steps">
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step active" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>3</span>
              <span className="step-line"></span>
              <span className="step">4</span>
              <span className="step-line"></span>
              <span className="step">5</span>
            </div>
          </div>

          <div className="builder-form">
            {/* EXPERIENCE SECTION */}
            <div className="form-section-divider">
              <h2 style={{ color: "#165B6D" }}>Work Experience</h2>
            </div>

            {experience.map((item, index) => (
              <div key={index} className="repeatable-card" style={{ backgroundColor: "#E6F2F0", border: "1px solid #D5F5E3", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                <div className="card-header">
                  <span className="card-number" style={{ backgroundColor: "#D5F5E3", color: "#165B6D", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "50px" }}>#{index + 1}</span>
                  {experience.length > 1 && (
                    <button className="remove-btn" onClick={() => removeExperience(index)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "18px", cursor: "pointer", padding: "4px 8px" }}>
                      ✕
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Company</label>
                    <input
                      type="text"
                      placeholder="e.g., Google"
                      value={item.company}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
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
                    <label style={{ color: "#165B6D" }}>Position</label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Developer"
                      value={item.position}
                      onChange={(e) => updateExperience(index, "position", e.target.value)}
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

                <div className="form-group">
                  <label style={{ color: "#165B6D" }}>Location</label>
                  <input
                    type="text"
                    placeholder="e.g., San Francisco, CA (Remote)"
                    value={item.location || ""}
                    onChange={(e) => updateExperience(index, "location", e.target.value)}
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

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Start Date</label>
                    <input
                      type="month"
                      value={item.startDate}
                      onChange={(e) => updateExperience(index, "startDate", e.target.value)}
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
                      onChange={(e) => updateExperience(index, "endDate", e.target.value)}
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
                      onChange={(e) => updateExperience(index, "current", e.target.checked)}
                      style={{ accentColor: "#199E72" }}
                    />
                    I currently work here
                  </label>
                </div>

                {/* DESCRIPTION SECTION WITH AI BUTTON */}
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ margin: 0, color: "#165B6D" }}>Description</label>
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
                    placeholder="Describe your responsibilities, achievements, and impact..."
                    rows="4"
                    value={item.description}
                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                    style={{
                      padding: "12px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "14px",
                      color: "#1a1a2e",
                      background: "#fafbfc",
                      width: "100%",
                      resize: "vertical",
                      minHeight: "100px",
                      fontFamily: "inherit",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#199E72"; e.target.style.boxShadow = "0 0 0 4px rgba(25, 158, 114, 0.1)"; e.target.style.background = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
                  />
                </div>

              </div>
            ))}

            <button className="add-btn" onClick={addExperience} style={{ background: "transparent", color: "#165B6D", border: "2px dashed #199E72", padding: "12px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", width: "100%", marginBottom: "20px", transition: "all 0.3s ease" }}>
              + Add Experience
            </button>

            {/* SKILLS SECTION */}
            <div className="form-section-divider">
              <h2 style={{ color: "#165B6D" }}>🛠️ Skills</h2>
            </div>

            <div className="skills-container">
              {skills.map((skill, index) => (
                <div className="skill-item" key={index}>
                  <input
                    type="text"
                    placeholder="Enter a skill"
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
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
                  {skills.length > 1 && (
                    <button className="remove-skill-btn" onClick={() => removeSkill(index)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "18px", cursor: "pointer", padding: "4px 8px" }}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button className="add-btn" onClick={addSkill} style={{ background: "transparent", color: "#165B6D", border: "2px dashed #199E72", padding: "12px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", width: "100%", marginBottom: "20px", transition: "all 0.3s ease" }}>
              + Add Skill
            </button>

            <div className="builder-actions">
              <button type="button" className="btn-back" onClick={handleBack} style={{ background: "transparent", color: "#165B6D", border: "2px solid #165B6D", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }}>
                ← Back
              </button>
              <button type="button" className="btn-continue" onClick={handleContinue} style={{ background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)", color: "#ffffff", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 15px rgba(22, 91, 109, 0.3)", transition: "all 0.3s ease" }}>
                Continue to Projects →
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

export default ExperienceSkills;