import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import LivePreview from "./LivePreview";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([
    {
      name: "",
      description: "",
      technologies: "",
      link: "",
    },
  ]);

  const [baseDraft, setBaseDraft] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  // State to track which project description is currently being enhanced
  const [enhancingIndex, setEnhancingIndex] = useState(null);

  useEffect(() => {
    const savedDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const template = localStorage.getItem("selectedTemplate") || "professional";
    setSelectedTemplate(template);

    const { projects: savedProjects, ...rest } = savedDraft;
    setBaseDraft(rest);

    if (savedProjects) setProjects(savedProjects);
  }, []);

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: "",
        description: "",
        technologies: "",
        link: "",
      },
    ]);
  };

  const removeProject = (index) => {
    if (projects.length > 1) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  // New function to handle AI enhancement for Project Description
  const handleAIEnhance = (index) => {
    if (!projects[index].description.trim()) {
      alert("Please write a brief description first so the AI can enhance it.");
      return;
    }

    setEnhancingIndex(index);

    // Simulate AI API call delay
    setTimeout(() => {
      const currentDesc = projects[index].description;
      const enhancedDescription = `Designed and developed a scalable solution focused on ${currentDesc}. Implemented best practices to ensure high performance, user-friendly interfaces, and robust functionality, significantly improving user engagement and delivering a successful end-to-end product.`;

      const updated = [...projects];
      updated[index] = { ...updated[index], description: enhancedDescription };
      setProjects(updated);
      
      setEnhancingIndex(null);
    }, 1500);
    
    // Note: Replace the setTimeout block above with your actual fetch/axios call to your AI backend
  };

  const handleContinue = () => {
    const existingDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const updatedDraft = {
      ...existingDraft,
      projects,
    };
    localStorage.setItem("resumeDraft", JSON.stringify(updatedDraft));
    navigate("/certifications-languages");
  };

  const handleBack = () => {
    navigate("/experience-skills");
  };

  // FIXED: Removed empty arrays, baseDraft contains all previous data
  const previewData = {
    ...baseDraft,
    projects,
  };

  return (
    <div className="builder-page split" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
      <div className="builder-form-half">
        <div className="builder-container" style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 50px rgba(0, 0, 0, 0.06)" }}>
          <div className="builder-header">
            {/* Forced to Green */}
            <h1 style={{ color: "#199E72 !important", WebkitTextFillColor: "#199E72 !important" }}>📁 Projects</h1>
            <p style={{ color: "#4A5568" }}>Add your personal or professional projects.</p>
            <div className="progress-steps">
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step active" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>4</span>
              <span className="step-line"></span>
              <span className="step">5</span>
            </div>
          </div>

          <div className="builder-form">
            {projects.map((project, index) => (
              <div key={index} className="repeatable-card" style={{ backgroundColor: "#E6F2F0", border: "1px solid #D5F5E3", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                <div className="card-header">
                  <span className="card-number" style={{ backgroundColor: "#D5F5E3", color: "#165B6D", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "50px" }}>#{index + 1}</span>
                  {projects.length > 1 && (
                    <button className="remove-btn" onClick={() => removeProject(index)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "18px", cursor: "pointer", padding: "4px 8px" }}>
                      ✕
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Project Name</label>
                    <input
                      type="text"
                      placeholder="e.g., E-Commerce Platform"
                      value={project.name}
                      onChange={(e) => updateProject(index, "name", e.target.value)}
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
                    <label style={{ color: "#165B6D" }}>Technologies</label>
                    <input
                      type="text"
                      placeholder="e.g., React, Node.js, MongoDB"
                      value={project.technologies}
                      onChange={(e) => updateProject(index, "technologies", e.target.value)}
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

                {/* DESCRIPTION SECTION WITH AI BUTTON */}
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", marginTop: "10px" }}>
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
                        gap: "5px",
                        marginTop: "14px" 
                      }}
                    >
                      {enhancingIndex === index ? "✨ Enhancing..." : "✨ AI Enhance"}
                    </button>
                  </div>
                  <textarea
                    placeholder="Describe the project, your role, and key achievements..."
                    rows="4"
                    value={project.description}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
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

                <div className="form-group">
                  <label style={{ color: "#165B6D" }}>Project Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/yourproject"
                    value={project.link || ""}
                    onChange={(e) => updateProject(index, "link", e.target.value)}
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
            ))}

            <button className="add-btn" onClick={addProject} style={{ background: "transparent", color: "#165B6D", border: "2px dashed #199E72", padding: "12px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", width: "100%", marginBottom: "20px", transition: "all 0.3s ease" }}>
              + Add Project
            </button>

            <div className="builder-actions">
              <button type="button" className="btn-back" onClick={handleBack} style={{ background: "transparent", color: "#165B6D", border: "2px solid #165B6D", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }}>
                ← Back
              </button>
              <button type="button" className="btn-continue" onClick={handleContinue} style={{ background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)", color: "#ffffff", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 15px rgba(22, 91, 109, 0.3)", transition: "all 0.3s ease" }}>
                Continue to Certifications →
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

export default Projects;