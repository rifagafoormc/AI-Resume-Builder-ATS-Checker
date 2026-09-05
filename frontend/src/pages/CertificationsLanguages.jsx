import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import LivePreview from "./LivePreview";

function CertificationsLanguages() {
  const navigate = useNavigate();

  const [certifications, setCertifications] = useState([
    {
      name: "",
      organization: "",
      date: "",
    },
  ]);

  const [languages, setLanguages] = useState([
    {
      name: "",
      proficiency: "",
    },
  ]);

  const [baseDraft, setBaseDraft] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  useEffect(() => {
    const savedDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const template = localStorage.getItem("selectedTemplate") || "professional";
    setSelectedTemplate(template);

    const { certifications: savedCerts, languages: savedLangs, ...rest } = savedDraft;
    setBaseDraft(rest);

    if (savedCerts) setCertifications(savedCerts);
    if (savedLangs) setLanguages(savedLangs);
  }, []);

  const updateCertification = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: "",
        organization: "",
        date: "",
      },
    ]);
  };

  const removeCertification = (index) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
  };

  const addLanguage = () => {
    setLanguages([
      ...languages,
      {
        name: "",
        proficiency: "",
      },
    ]);
  };

  const removeLanguage = (index) => {
    if (languages.length > 1) {
      setLanguages(languages.filter((_, i) => i !== index));
    }
  };

  const handleContinue = () => {
    const existingDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const updatedDraft = {
      ...existingDraft, // Keeps jobTitle, summary, personalInfo, experience, education, projects, etc.
      certifications,
      languages: languages.filter((lang) => lang.name.trim() !== ""),
    };
    localStorage.setItem("resumeDraft", JSON.stringify(updatedDraft));
    navigate("/resume-preview");
  };

  const handleBack = () => {
    navigate("/projects");
  };

  // FIXED: Removed empty arrays, baseDraft contains all previous data (including jobTitle!)
  const previewData = {
    ...baseDraft,
    certifications,
    languages: languages.filter((lang) => lang.name.trim() !== ""),
  };

  return (
    <div className="builder-page split" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
      <div className="builder-form-half">
        <div className="builder-container" style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 50px rgba(0, 0, 0, 0.06)" }}>
          <div className="builder-header">
            {/* Forced to Green */}
            <h1 style={{ color: "#199E72 !important", WebkitTextFillColor: "#199E72 !important" }}>🏆 Certifications & Languages</h1>
            <p style={{ color: "#4A5568" }}>Add your certifications and language proficiencies.</p>
            <div className="progress-steps">
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step done" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>✓</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>
              <span className="step active" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important" }}>5</span>
            </div>
          </div>

          <div className="builder-form">
            {/* CERTIFICATIONS SECTION */}
            <div className="form-section-divider">
              <h2 style={{ color: "#165B6D" }}>Certifications</h2>
            </div>

            {certifications.map((cert, index) => (
              <div key={index} className="repeatable-card" style={{ backgroundColor: "#E6F2F0", border: "1px solid #D5F5E3", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                <div className="card-header">
                  <span className="card-number" style={{ backgroundColor: "#D5F5E3", color: "#165B6D", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "50px" }}>#{index + 1}</span>
                  {certifications.length > 1 && (
                    <button className="remove-btn" onClick={() => removeCertification(index)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "18px", cursor: "pointer", padding: "4px 8px" }}>
                      ✕
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Certification Name</label>
                    <input
                      type="text"
                      placeholder="e.g., AWS Certified Solutions Architect"
                      value={cert.name}
                      onChange={(e) => updateCertification(index, "name", e.target.value)}
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
                    <label style={{ color: "#165B6D" }}>Organization</label>
                    <input
                      type="text"
                      placeholder="e.g., Amazon Web Services"
                      value={cert.organization}
                      onChange={(e) => updateCertification(index, "organization", e.target.value)}
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
                  <label style={{ color: "#165B6D" }}>Date Earned</label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(index, "date", e.target.value)}
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

            <button className="add-btn" onClick={addCertification} style={{ background: "transparent", color: "#165B6D", border: "2px dashed #199E72", padding: "12px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", width: "100%", marginBottom: "20px", transition: "all 0.3s ease" }}>
              + Add Certification
            </button>

            {/* LANGUAGES SECTION */}
            <div className="form-section-divider">
              <h2 style={{ color: "#165B6D" }}>🌍 Languages</h2>
            </div>

            {languages.map((lang, index) => (
              <div key={index} className="repeatable-card" style={{ backgroundColor: "#E6F2F0", border: "1px solid #D5F5E3", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                <div className="card-header">
                  <span className="card-number" style={{ backgroundColor: "#D5F5E3", color: "#165B6D", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "50px" }}>#{index + 1}</span>
                  {languages.length > 1 && (
                    <button className="remove-btn" onClick={() => removeLanguage(index)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "18px", cursor: "pointer", padding: "4px 8px" }}>
                      ✕
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ color: "#165B6D" }}>Language</label>
                    <input
                      type="text"
                      placeholder="e.g., English"
                      value={lang.name}
                      onChange={(e) => updateLanguage(index, "name", e.target.value)}
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
                    <label style={{ color: "#165B6D" }}>Proficiency</label>
                    <select
                      value={lang.proficiency}
                      onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
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
                    >
                      <option value="">Select proficiency</option>
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Professional">Professional</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Beginner">Beginner</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button className="add-btn" onClick={addLanguage} style={{ background: "transparent", color: "#165B6D", border: "2px dashed #199E72", padding: "12px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", width: "100%", marginBottom: "20px", transition: "all 0.3s ease" }}>
              + Add Language
            </button>

            <div className="builder-actions">
              <button type="button" className="btn-back" onClick={handleBack} style={{ background: "transparent", color: "#165B6D", border: "2px solid #165B6D", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }}>
                ← Back
              </button>
              <button type="button" className="btn-continue" onClick={handleContinue} style={{ background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)", color: "#ffffff", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 15px rgba(22, 91, 109, 0.3)", transition: "all 0.3s ease" }}>
                Preview Resume →
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

export default CertificationsLanguages;