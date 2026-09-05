import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./ResumeTemplates.css";

// Image imports
import modernResume from "../assets/images/modern_resume.png";
import professionalResume from "../assets/images/professional_resume.jpg";
import creativeResume from "../assets/images/creative_resume.png";


/* =========================================================
   HELPER
========================================================= */

const getValue = (value, fallback = "") => {
  return value || fallback;
};


/* =========================================================
   PROFESSIONAL RESUME TEMPLATE
========================================================= */

export function ProfessionalTemplate({ data = {} }) {
  const personal = data.personalDetails || data.basicDetails || data;

  return (
    <div className="resume-template professional-template">
      <header className="resume-header">
        <h1>{getValue(personal.name, "Your Name")}</h1>
        <p className="resume-title">{getValue(personal.jobTitle, "Professional")}</p>
        <div className="resume-contact">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </header>

      {personal.summary && (
        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p>{personal.summary}</p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section className="resume-section">
          <h2>Experience</h2>
          {data.experience.map((item, index) => (
            <div className="resume-entry" key={index}>
              <h3>{item.position || item.jobTitle || "Job Position"}</h3>
              <p className="resume-entry-subtitle">{item.company || "Company"}</p>
              <p>{item.description || ""}</p>
            </div>
          ))}
        </section>
      )}

      {data.education?.length > 0 && (
        <section className="resume-section">
          <h2>Education</h2>
          {data.education.map((item, index) => (
            <div className="resume-entry" key={index}>
              <h3>{item.degree || item.course || "Degree"}</h3>
              <p className="resume-entry-subtitle">{item.institution || item.school || "Institution"}</p>
              {item.year && <p>{item.year}</p>}
            </div>
          ))}
        </section>
      )}

      {data.skills?.length > 0 && (
        <section className="resume-section">
          <h2>Skills</h2>
          <div className="resume-skills">
            {data.skills.map((skill, index) => (
              <span key={index}>
                {typeof skill === "string" ? skill : skill.name || skill.skill || ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


/* =========================================================
   MODERN RESUME TEMPLATE
========================================================= */

export function ModernTemplate({ data = {} }) {
  const personal = data.personalDetails || data.basicDetails || data;

  return (
    <div className="resume-template modern-template">
      <div className="modern-top">
        <h1>{getValue(personal.name, "Your Name")}</h1>
        <p>{getValue(personal.jobTitle, "Professional")}</p>
        <div className="resume-contact">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </div>

      <div className="modern-content">
        <main>
          {personal.summary && (
            <section className="resume-section">
              <h2>About Me</h2>
              <p>{personal.summary}</p>
            </section>
          )}

          {data.experience?.length > 0 && (
            <section className="resume-section">
              <h2>Experience</h2>
              {data.experience.map((item, index) => (
                <div className="resume-entry" key={index}>
                  <h3>{item.position || item.jobTitle || "Job Position"}</h3>
                  <p className="resume-entry-subtitle">{item.company || "Company"}</p>
                  <p>{item.description || ""}</p>
                </div>
              ))}
            </section>
          )}

          {data.education?.length > 0 && (
            <section className="resume-section">
              <h2>Education</h2>
              {data.education.map((item, index) => (
                <div className="resume-entry" key={index}>
                  <h3>{item.degree || item.course || "Degree"}</h3>
                  <p>{item.institution || item.school || "Institution"}</p>
                  {item.year && <p>{item.year}</p>}
                </div>
              ))}
            </section>
          )}
        </main>

        <aside>
          {data.skills?.length > 0 && (
            <section className="resume-section">
              <h2>Skills</h2>
              <div className="resume-skills">
                {data.skills.map((skill, index) => (
                  <span key={index}>
                    {typeof skill === "string" ? skill : skill.name || skill.skill || ""}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}


/* =========================================================
   CREATIVE RESUME TEMPLATE
========================================================= */

export function CreativeTemplate({ data = {} }) {
  const personal = data.personalDetails || data.basicDetails || data;

  return (
    <div className="resume-template creative-template">
      <header className="creative-header">
        <div className="creative-name">
          <h1>{getValue(personal.name, "Your Name")}</h1>
          <p>{getValue(personal.jobTitle, "Creative Professional")}</p>
        </div>
        <div className="creative-contact">
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
        </div>
      </header>

      {personal.summary && (
        <section className="resume-section">
          <h2>Profile</h2>
          <p>{personal.summary}</p>
        </section>
      )}

      <div className="creative-grid">
        <div>
          {data.experience?.length > 0 && (
            <section className="resume-section">
              <h2>Experience</h2>
              {data.experience.map((item, index) => (
                <div className="resume-entry" key={index}>
                  <h3>{item.position || item.jobTitle || "Job Position"}</h3>
                  <p className="resume-entry-subtitle">{item.company || "Company"}</p>
                  <p>{item.description || ""}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        <div>
          {data.education?.length > 0 && (
            <section className="resume-section">
              <h2>Education</h2>
              {data.education.map((item, index) => (
                <div className="resume-entry" key={index}>
                  <h3>{item.degree || item.course || "Degree"}</h3>
                  <p>{item.institution || item.school || "Institution"}</p>
                  {item.year && <p>{item.year}</p>}
                </div>
              ))}
            </section>
          )}

          {data.skills?.length > 0 && (
            <section className="resume-section">
              <h2>Skills</h2>
              <div className="resume-skills">
                {data.skills.map((skill, index) => (
                  <span key={index}>
                    {typeof skill === "string" ? skill : skill.name || skill.skill || ""}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   IMAGE PREVIEW MODAL
========================================================= */

function TemplatePreviewModal({ template, onClose, onUseTemplate }) {
  if (!template) return null;

  return (
    <div className="resume-preview-overlay" onClick={onClose}>
      <div className="resume-preview-container" onClick={(e) => e.stopPropagation()}>
        <button className="resume-preview-close" onClick={onClose} aria-label="Close preview">
          ✕
        </button>

        <div className="resume-page-wrapper">
          <img
            src={template.image}
            alt={`${template.name} resume template`}
            className="resume-page-image"
          />
        </div>

        <div className="resume-preview-actions">
          <button type="button" className="preview-close-btn" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="preview-use-btn"
            onClick={() => onUseTemplate(template.id)}
            style={{ background: "#199E72", color: "#fff" }}
          >
            Use This Template
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   TEMPLATES SELECTION PAGE
========================================================= */

function Templates() {
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [previewingTemplate, setPreviewingTemplate] = useState(null);
  
  // State for custom alert modal
  const [showErrorModal, setShowErrorModal] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userData.name || "User";

  const templates = [
    {
      id: "professional",
      name: "Professional",
      description: "Clean and professional design suitable for corporate jobs.",
      icon: "💼",
      color: "#165B6D",
      image: professionalResume,
    },
    {
      id: "modern",
      name: "Modern",
      description: "Modern layout with a fresh and attractive appearance.",
      icon: "✨",
      color: "#199E72",
      image: modernResume,
    },
    {
      id: "creative",
      name: "Creative",
      description: "Creative design for portfolios and innovative roles.",
      icon: "🎨",
      color: "#0F4C5C",
      image: creativeResume,
    },
  ];

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    localStorage.setItem("selectedTemplate", templateId);

    const existingDraft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const updatedDraft = { ...existingDraft, template: templateId };
    localStorage.setItem("resumeDraft", JSON.stringify(updatedDraft));
  };

  const handleContinue = () => {
    if (!selectedTemplate) {
      // Show custom centered modal instead of alert
      setShowErrorModal(true);
      return;
    }
    navigate("/basic-details");
  };

  const handleUseTemplateFromPreview = (templateId) => {
    handleSelectTemplate(templateId);
    setPreviewingTemplate(null);
    navigate("/basic-details");
  };

  // ✅ FIXED: Logout now redirects to Landing Page
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const createResume = () => {
    localStorage.removeItem("resumeDraft");
    setSelectedTemplate(null);
    navigate("/templates");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="templates-page" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh", color: "#333", overflowX: "hidden", margin: "0", padding: "0", width: "100%" }}>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          margin: 0;
          padding: 0;
        }

        /* FORCE OVERRIDE BLUE FROM GLOBAL CSS */
        .templates-header h1 {
          color: #165B6D !important;
        }

        .templates-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .templates-header h1 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #165B6D; /* Dark Teal */
        }
        .templates-header p {
          font-size: 16px;
          color: #4A5568;
        }
        .templates-grid {
          display: flex;
          gap: 24px;
          padding: 0 50px 120px 50px;
          overflow-x: auto;
          justify-content: flex-start;
        }
        .template-card {
          flex: 0 0 300px;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          border: 2px solid transparent;
          transition: border 0.3s;
          color: #333;
        }
        .template-card.selected {
          border: 3px solid #199E72;
        }
        .template-preview-wrapper {
          position: relative;
          background: #f3f4f6;
          height: 380px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .template-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          object-position: top;
        }
        .template-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .template-text h3 {
          margin: 0 0 5px 0;
          font-size: 18px;
          font-weight: 600;
          text-align: center;
          color: #1f2937;
        }
        .template-text p {
          font-size: 13px;
          color: #6b7280;
          text-align: center;
          margin: 0;
        }
        .template-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
          justify-content: center;
          padding-bottom: 16px;
        }
        
        /* UPDATED: Icon-only View button (Square) */
        .view-template-btn {
          background: #ffffff;
          color: #165B6D;
          border: 1.5px solid #165B6D;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .view-template-btn:hover {
          background: #165B6D;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(22, 91, 109, 0.2);
        }

        .select-button {
          background: #165B6D;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(22, 91, 109, 0.2);
          transition: all 0.2s ease-in-out;
          white-space: nowrap;
          width: 100%;
          flex: 1;
        }
        .select-button:hover {
          background: #0F4C5C;
          transform: translateY(-1px);
        }
        .select-button.selected {
          background: #199E72;
          box-shadow: 0 2px 4px rgba(25, 158, 114, 0.2);
        }
        .select-button.selected:hover {
          background: #15803d;
        }

        .continue-section {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: white;
          padding: 14px 30px;
          border-radius: 50px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 15px;
          color: #333;
        }
        .start-building-btn {
          background: linear-gradient(90deg, #165B6D, #199E72);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(22, 91, 109, 0.4);
          transition: all 0.2s ease-in-out;
        }
        .start-building-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(22, 91, 109, 0.5);
        }
        .no-template-text {
          color: #6b7280;
          font-size: 14px;
        }
      `}</style>

      {/* ===== EXACT SAME NAVBAR AS DASHBOARD ===== */}
      <nav className="dashboard-navbar" style={{ background: "#ffffff" }}>
        <div className="dashboard-nav-left">
          <Link 
            to="/dashboard" 
            className="logo" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              color: "#199E72", 
              background: "none", 
              backgroundImage: "none", 
              WebkitTextFillColor: "#199E72" 
            }}
          >
            {/* Rocket SVG Icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="#199E72" 
              width="24" 
              height="24"
            >
              <path d="M12 2c-3.5 0-6 2.5-6 6 0 1.5.5 3 1.5 4.5L6 18l3 1.5L9 22c0 .5.5 1 1 1s1-.5 1-1v-2.5L12 19l1 .5V22c0 .5.5 1 1 1s1-.5 1-1l0-2.5L18 18l-1.5-5.5C17.5 11 18 9.5 18 8c0-3.5-2.5-6-6-6zm-1.5 9.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm3 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
            </svg>
            scoreCraft
          </Link>
        </div>

        <div className="dashboard-nav-center">
          {/* Active class applied exactly like Dashboard */}
          <Link to="/dashboard" className="nav-link">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
            </span>
            Dashboard
          </Link>
          <Link to="/templates" className="nav-link active" style={{ color: "#199E72", background: "#D5F5E3" }}>
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.2H22l-6.2 4.8 2.4 7.2-6.2-4.8-6.2 4.8 2.4-7.2L2 9.2h7.6z"></path>
              </svg>
            </span>
            Templates
          </Link>
          <Link to="/ats-score" className="nav-link">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M18 17V9"></path>
                <path d="M13 17V5"></path>
                <path d="M8 17v-3"></path>
              </svg>
            </span>
            ATS Score
          </Link>
          <Link to="/my-resumes" className="nav-link">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </span>
            My Resumes
          </Link>
          <Link to="/ats-history" className="nav-link">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
            ATS History
          </Link>
        </div>

        <div className="dashboard-nav-right">
          <div className="user-profile">
            {/* Avatar is now DARK GREEN */}
            <div className="user-avatar" title={userName} style={{ background: "#165B6D" }}>
              {getInitials(userName)}
            </div>
            <div className="user-dropdown">
              <button 
                className="dropdown-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer" }}
              >
                {/* Removed the name span, only the arrow remains */}
                <span className="dropdown-arrow">▼</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu show">
                  <Link to="/profile" className="dropdown-item">
                    <span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span> Profile
                  </Link>
                  <hr className="dropdown-divider" />
                  <button onClick={logout} className="dropdown-item logout">
                    <span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </span> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="templates-container" style={{ paddingTop: "50px" }}>
        <div className="templates-header">
          {/* Forced to Dark Teal with !important */}
          <h1 style={{ color: "#165B6D !important" }}>Pick Your Resume Template</h1>
          <p>Explore our best designs to land your dream job.</p>
        </div>

        <div className="templates-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`}
            >
              <div className="template-preview-wrapper">
                <img
                  src={template.image}
                  alt={`${template.name} resume template`}
                  className="template-image"
                />
              </div>

              <div className="template-info">
                <div className="template-text">
                  <h3>{template.name}</h3>
                </div>
              </div>

              <div className="template-actions">
                {/* Eye Icon Only Button */}
                <button
                  type="button"
                  className="view-template-btn"
                  onClick={() => setPreviewingTemplate(template.id)}
                  title="View Template"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <button
                  type="button"
                  className={`select-button ${selectedTemplate === template.id ? "selected" : ""}`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  {selectedTemplate === template.id ? "✓ Selected" : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Continue Section */}
      <div className="continue-section">
        <span className="no-template-text">
          {selectedTemplate ? "Great choice!" : "Select a template to continue"}
        </span>
        <button type="button" className="start-building-btn" onClick={handleContinue}>
          Start Building →
        </button>
      </div>

      {previewingTemplate && (
        <TemplatePreviewModal
          template={templates.find((template) => template.id === previewingTemplate)}
          onClose={() => setPreviewingTemplate(null)}
          onUseTemplate={handleUseTemplateFromPreview}
        />
      )}

      {/* ================= CENTERED ERROR MODAL ================= */}
      {showErrorModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowErrorModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "30px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>⚠️</div>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>Please select a template first.</h3>
            <p style={{ color: "#6b7280", margin: "0 0 20px 0", fontSize: "14px" }}>
              You must choose a template before you can start building your resume.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => setShowErrorModal(false)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#199E72",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Templates;