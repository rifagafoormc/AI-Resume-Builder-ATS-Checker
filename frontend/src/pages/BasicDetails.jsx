import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";
import LivePreview from "./LivePreview";

function BasicDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    jobTitle: "",
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

  const [isEnhancing, setIsEnhancing] = useState(false);

  const [restOfDraft, setRestOfDraft] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  // Modal state for alerts
  const [modal, setModal] = useState({ show: false, message: "", type: "error" });

  useEffect(() => {
    const savedDraft = JSON.parse(
      localStorage.getItem("resumeDraft") || "{}"
    );

    const template =
      localStorage.getItem("selectedTemplate") || "professional";

    setSelectedTemplate(template);

    if (Object.keys(savedDraft).length > 0) {
      const {
        title,
        jobTitle,
        personalInfo,
        summary,
        _id,
        ...rest
      } = savedDraft;

      setFormData((previous) => ({
        ...previous,

        ...(title !== undefined ? { title } : {}),
        ...(jobTitle !== undefined ? { jobTitle } : {}),
        ...(summary !== undefined ? { summary } : {}),

        personalInfo: {
          ...previous.personalInfo,
          ...(personalInfo || {}),
        },
      }));

      // Keep the resume ID and all the other resume sections.
      setRestOfDraft({
        ...rest,
        ...(id ? { _id: id } : {}),
        ...(_id ? { _id } : {}),
      });
    }
  }, [id]);

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

  const handleAIEnhance = () => {
    if (!formData.summary.trim()) {
      setModal({ show: true, message: "Please write a basic summary first so the AI can enhance it.", type: "error" });
      return;
    }

    setIsEnhancing(true);

    setTimeout(() => {
      const enhancedSummary = `Results-driven professional with proven expertise in delivering high-impact solutions. ${formData.summary} Adept at leveraging cutting-edge technologies to optimize performance, spearhead cross-functional teams, and drive measurable business growth.`;

      setFormData({
        ...formData,
        summary: enhancedSummary,
      });

      setIsEnhancing(false);
    }, 1500);
  };

  const handleContinue = () => {
    if (!formData.title.trim()) {
      setModal({ show: true, message: "Please enter a resume title.", type: "error" });
      return;
    }

    if (!formData.personalInfo.fullName.trim()) {
      setModal({ show: true, message: "Please enter your full name.", type: "error" });
      return;
    }

    if (!formData.personalInfo.email.trim()) {
      setModal({ show: true, message: "Please enter your email.", type: "error" });
      return;
    }

    const existingDraft = JSON.parse(
      localStorage.getItem("resumeDraft") || "{}"
    );

    const updatedDraft = {
      ...existingDraft,
      ...restOfDraft,
      ...formData,

      // VERY IMPORTANT:
      // Keep the existing resume ID when editing.
      ...(id ? { _id: id } : {}),
    };

    localStorage.setItem(
      "resumeDraft",
      JSON.stringify(updatedDraft)
    );

    navigate("/education");
  };

  const previewData = {
    ...restOfDraft,
    ...formData,

    // Make sure LivePreview also receives the ID.
    ...(id ? { _id: id } : {}),
  };

  return (
    <div className="builder-page split" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
      <div className="builder-form-half">
        <div className="builder-container" style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 50px rgba(0, 0, 0, 0.06)" }}>

          <div className="builder-header">
            {/* Forced to Green with !important */}
            <h1 style={{ color: "#199E72 !important", WebkitTextFillColor: "#199E72 !important" }}>Basic Details</h1>
            <p style={{ color: "#4A5568" }}>
              Enter your personal and professional information.
            </p>

            <div className="progress-steps">
              {/* Forced Active Step to Green */}
              <span className="step active" style={{ backgroundColor: "#199E72 !important", color: "#ffffff !important", border: "none !important" }}>1</span>
              <span className="step-line" style={{ backgroundColor: "#199E72 !important" }}></span>

              <span className="step">2</span>
              <span className="step-line"></span>

              <span className="step">3</span>
              <span className="step-line"></span>

              <span className="step">4</span>
              <span className="step-line"></span>

              <span className="step">5</span>
            </div>
          </div>

          <div className="builder-form">

            <div className="form-group">
              <label style={{ color: "#165B6D" }}>Resume Title</label>

              <input
                type="text"
                name="title"
                placeholder="Example: Software Developer Resume"
                value={formData.title}
                onChange={handleChange}
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
              <label style={{ color: "#165B6D" }}>
                Job Title / Professional Headline
              </label>

              <input
                type="text"
                name="jobTitle"
                placeholder="e.g., Senior Full Stack Developer, Marketing Manager, Creative Director"
                value={formData.jobTitle}
                onChange={handleChange}
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

              <small
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                This will appear as your professional title beneath your
                name on the resume
              </small>
            </div>

            <div className="form-section-divider">
              <h2 style={{ color: "#165B6D" }}>Personal Information</h2>
            </div>

            <div className="form-row">

              <div className="form-group">
                <label style={{ color: "#165B6D" }}>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  value={formData.personalInfo.fullName}
                  onChange={handlePersonalInfoChange}
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
                <label style={{ color: "#165B6D" }}>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.personalInfo.email}
                  onChange={handlePersonalInfoChange}
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
                <label style={{ color: "#165B6D" }}>Phone</label>

                <input
                  type="text"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.personalInfo.phone}
                  onChange={handlePersonalInfoChange}
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
                  name="location"
                  placeholder="Kozhikode, Kerala"
                  value={formData.personalInfo.location}
                  onChange={handlePersonalInfoChange}
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
                <label style={{ color: "#165B6D" }}>LinkedIn</label>

                <input
                  type="text"
                  name="linkedin"
                  placeholder="LinkedIn profile URL"
                  value={formData.personalInfo.linkedin}
                  onChange={handlePersonalInfoChange}
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
                <label style={{ color: "#165B6D" }}>GitHub</label>

                <input
                  type="text"
                  name="github"
                  placeholder="GitHub profile URL"
                  value={formData.personalInfo.github}
                  onChange={handlePersonalInfoChange}
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
              <label style={{ color: "#165B6D" }}>Portfolio</label>

              <input
                type="text"
                name="portfolio"
                placeholder="Portfolio URL"
                value={formData.personalInfo.portfolio}
                onChange={handlePersonalInfoChange}
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

            {/* PROFESSIONAL SUMMARY SECTION */}

            <div className="form-group">

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <label style={{ margin: 0, color: "#165B6D" }}>
                  Professional Summary
                </label>

                <button
                  type="button"
                  className="ai-enhance-btn"
                  onClick={handleAIEnhance}
                  disabled={isEnhancing}
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
                  }}
                >
                  {isEnhancing
                    ? "✨ Enhancing..."
                    : "✨ AI Enhance"}
                </button>
              </div>

              <textarea
                name="summary"
                rows="6"
                placeholder="Write a short professional summary..."
                value={formData.summary}
                onChange={handleChange}
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  color: "#1a1a2e",
                  background: "#fafbfc",
                  width: "100%",
                  resize: "vertical",
                  minHeight: "120px",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => { e.target.style.borderColor = "#199E72"; e.target.style.boxShadow = "0 0 0 4px rgba(25, 158, 114, 0.1)"; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
              />

            </div>

          </div>

          <div className="builder-actions">

            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/templates")}
              style={{
                background: "transparent",
                color: "#165B6D",
                border: "2px solid #165B6D",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => { e.target.style.background = "#165B6D"; e.target.style.color = "#fff"; }}
              onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#165B6D"; }}
            >
              ← Back
            </button>

            <button
              type="button"
              className="btn-continue"
              onClick={handleContinue}
              style={{
                background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)",
                color: "#ffffff",
                border: "none",
                padding: "12px 32px",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(22, 91, 109, 0.3)",
                transition: "all 0.3s ease"
              }}
            >
              Continue to Education →
            </button>

          </div>

        </div>
      </div>

      <div className="builder-preview-half">
        <LivePreview
          data={previewData}
          template={selectedTemplate}
        />
      </div>

      {/* ================= CENTERED MODAL FOR ALERTS (BLURRED) ================= */}
      {modal.show && (
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
          onClick={() => setModal({ show: false, message: "", type: "error" })}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "30px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>⚠️</div>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>Please check</h3>
            <p style={{ color: "#6b7280", margin: "0 0 20px 0", fontSize: "14px" }}>
              {modal.message}
            </p>
            <button
              onClick={() => setModal({ show: false, message: "", type: "error" })}
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
      )}
    </div>
  );
}

export default BasicDetails;