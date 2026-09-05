import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function ATSResult() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navbar state
  const [userName, setUserName] = useState("User");
  const [showDropdown, setShowDropdown] = useState(false);

  // Modal state
  const [messageModal, setMessageModal] = useState({
    show: false,
    text: "",
    type: ""
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.name) {
      setUserName(userData.name);
    }
  }, []);

  // Get result from navigation state
  const atsResult = location.state?.atsResult;
  const errorMessage = location.state?.errorMessage;

  // Show error modal
  useEffect(() => {
    if (errorMessage) {
      setMessageModal({
        show: true,
        text: errorMessage,
        type: "error"
      });
    }
  }, [errorMessage]);

  // Logout (Redirect to Landing Page)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Create new resume
  const createResume = () => {
    localStorage.removeItem("resumeDraft");
    navigate("/templates");
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Score Helpers
  const getScoreStatus = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Needs Improvement";
  };

  const getColorForScore = (score) => {
    if (score >= 80) return "#199E72"; // Green
    if (score >= 60) return "#f59e0b"; // Yellow
    if (score >= 40) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  // Navbar (Exact same as Dashboard - Name removed)
  const NavBar = (
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
        <Link to="/templates" className="nav-link">
          <span className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 7.2H22l-6.2 4.8 2.4 7.2-6.2-4.8-6.2 4.8 2.4-7.2L2 9.2h7.6z"></path>
            </svg>
          </span>
          Templates
        </Link>
        <Link to="/ats-score" className="nav-link active" style={{ color: "#199E72", background: "#D5F5E3" }}>
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
            {/* Only the arrow remains */}
            <button className="dropdown-btn" onClick={() => setShowDropdown(!showDropdown)} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer" }}>
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
  );

  // No result
  if (!atsResult && !errorMessage) {
    return (
      <div className="dashboard" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
        {NavBar}
        <div className="ats-result-page">
          <div className="ats-result-card" style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "32px", maxWidth: "640px", margin: "40px auto", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)", textAlign: "center" }}>
            <h1 style={{ color: "#165B6D", marginBottom: "8px" }}>ATS Analysis Result</h1>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>No ATS analysis result was found.</p>
            <button type="button" onClick={() => navigate("/dashboard")} className="btn-back" style={{ background: "transparent", color: "#165B6D", border: "2px solid #165B6D", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Result data
  const score = Number(atsResult?.atsScore ?? 0);
  const weightedScore = Number(atsResult?.weightedScore ?? score);
  const fillColor = getColorForScore(score);

  const suggestions = Array.isArray(atsResult?.suggestions)
    ? atsResult.suggestions
    : [];

  const summary = atsResult?.summary || "";
  const matchedKeywords = atsResult?.matchedKeywords || [];
  const missingKeywords = atsResult?.missingKeywords || [];
  const componentScores = atsResult?.componentScores;

  // Main result page
  return (
    <div className="dashboard" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
      {NavBar}

      {atsResult && (
        <div className="ats-result-page">
          <div className="ats-result-card" style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "32px", maxWidth: "640px", margin: "40px auto", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)" }}>

            {/* HEADER */}
            <div className="analysis-card-top">
              <div>
                <span className="analysis-label" style={{ color: "#199E72", fontWeight: "700", fontSize: "12px", letterSpacing: "1px" }}>
                  ATS ANALYSIS
                </span>
                <h1 style={{ color: "#165B6D", margin: "8px 0" }}>📊 ATS Analysis Result</h1>
                <p className="analysis-date" style={{ color: "#4A5568" }}>
                  Your resume has been analyzed using AI for ATS compatibility.
                </p>
              </div>
            </div>

            {/* SCORE CIRCLE */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
              <div style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `conic-gradient(${fillColor} 0% ${score}%, #e5e7eb ${score}% 100%)`,
              }}>
                <div style={{
                  position: "absolute",
                  width: "112px",
                  height: "112px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <span style={{ fontSize: "40px", fontWeight: "800", color: "#1f2937", lineHeight: "1" }}>
                    {score}
                  </span>
                  <small style={{ fontSize: "12px", fontWeight: "600", marginTop: "2px", color: "#6b7280" }}>
                    / 100
                  </small>
                </div>
              </div>
            </div>

            {/* SCORE STATUS */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                backgroundColor: `${fillColor}20`,
                color: fillColor,
              }}>
                {getScoreStatus(score)}
              </div>
            </div>

            <h2 style={{ textAlign: "center", color: "#165B6D" }}>ATS Score: {score}%</h2>

            <p style={{ textAlign: "center", color: "#4A5568" }}>
              {score >= 80
                ? "Excellent! Your resume is well optimized for ATS systems."
                : score >= 60
                ? "Your resume has a good foundation, but some areas can be improved."
                : "Your resume needs improvement to perform better with ATS systems."}
            </p>

            {/* SUMMARY */}
            {summary && (
              <div className="ats-summary" style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
                <h2 style={{ color: "#165B6D", marginBottom: "8px" }}>📝 AI Summary</h2>
                <p style={{ color: "#4A5568", lineHeight: "1.6" }}>{summary}</p>
              </div>
            )}

            {/* STATS */}
            <div className="analysis-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", margin: "24px 0" }}>
              <div className="analysis-stat" style={{ textAlign: "center" }}>
                <span className="stat-value" style={{ display: "block", fontSize: "24px", fontWeight: "700", color: "#165B6D" }}>{weightedScore}</span>
                <span className="stat-label" style={{ fontSize: "12px", color: "#6b7280" }}>Weighted Score</span>
              </div>

              <div className="analysis-stat" style={{ textAlign: "center" }}>
                <span className="stat-value" style={{ display: "block", fontSize: "24px", fontWeight: "700", color: "#165B6D" }}>{matchedKeywords.length}</span>
                <span className="stat-label" style={{ fontSize: "12px", color: "#6b7280" }}>Matched Keywords</span>
              </div>

              <div className="analysis-stat" style={{ textAlign: "center" }}>
                <span className="stat-value" style={{ display: "block", fontSize: "24px", fontWeight: "700", color: "#165B6D" }}>{missingKeywords.length}</span>
                <span className="stat-label" style={{ fontSize: "12px", color: "#6b7280" }}>Missing Keywords</span>
              </div>

              <div className="analysis-stat" style={{ textAlign: "center" }}>
                <span className="stat-value" style={{ display: "block", fontSize: "24px", fontWeight: "700", color: "#165B6D" }}>{suggestions.length}</span>
                <span className="stat-label" style={{ fontSize: "12px", color: "#6b7280" }}>Suggestions</span>
              </div>
            </div>

            {/* COMPONENT SCORES */}
            {componentScores && (
              <div className="component-scores" style={{ marginBottom: "24px" }}>
                <div className="component-item" style={{ marginBottom: "16px" }}>
                  <div className="component-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "#4A5568", fontSize: "14px" }}>Content & Impact</span>
                    <strong style={{ color: "#165B6D" }}>{componentScores.contentAndImpact?.score ?? 0}</strong>
                  </div>
                  <div className="progress-bar" style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${componentScores.contentAndImpact?.score ?? 0}%`, height: "100%", backgroundColor: "#199E72", borderRadius: "4px" }}
                    ></div>
                  </div>
                </div>

                <div className="component-item" style={{ marginBottom: "16px" }}>
                  <div className="component-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "#4A5568", fontSize: "14px" }}>Keyword Match</span>
                    <strong style={{ color: "#165B6D" }}>{componentScores.keywordMatch?.score ?? 0}</strong>
                  </div>
                  <div className="progress-bar" style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${componentScores.keywordMatch?.score ?? 0}%`, height: "100%", backgroundColor: "#199E72", borderRadius: "4px" }}
                    ></div>
                  </div>
                </div>

                <div className="component-item" style={{ marginBottom: "16px" }}>
                  <div className="component-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "#4A5568", fontSize: "14px" }}>Skills</span>
                    <strong style={{ color: "#165B6D" }}>{componentScores.skills?.score ?? 0}</strong>
                  </div>
                  <div className="progress-bar" style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${componentScores.skills?.score ?? 0}%`, height: "100%", backgroundColor: "#199E72", borderRadius: "4px" }}
                    ></div>
                  </div>
                </div>

                <div className="component-item" style={{ marginBottom: "16px" }}>
                  <div className="component-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "#4A5568", fontSize: "14px" }}>Formatting</span>
                    <strong style={{ color: "#165B6D" }}>{componentScores.formatting?.score ?? 0}</strong>
                  </div>
                  <div className="progress-bar" style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${componentScores.formatting?.score ?? 0}%`, height: "100%", backgroundColor: "#199E72", borderRadius: "4px" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* AI SUGGESTIONS */}
            <div className="suggestions" style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
              <h2 style={{ color: "#165B6D", marginBottom: "14px" }}>💡 AI Optimization Suggestions</h2>

              {suggestions.length > 0 ? (
                suggestions.map((item, index) => (
                  <div className="suggestion" key={index} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0" }}>
                    <span style={{ color: "#199E72", fontWeight: "700" }}>✓</span>
                    <div>
                      <p className="suggestion-text" style={{ margin: "0", color: "#374151", fontSize: "14px" }}>
                        {typeof item === "string" ? item : item.suggestion}
                      </p>
                      {typeof item !== "string" && (
                        <span className={`suggestion-tag priority-${(item.priority || "").toLowerCase()}`} style={{ fontSize: "11px", color: "#9ca3af", textTransform: "capitalize" }}>
                          {item.category} · {item.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#6b7280" }}>No improvement suggestions were generated.</p>
              )}
            </div>

            {/* BACK BUTTON */}
            <div className="analysis-card-actions" style={{ marginTop: "28px", textAlign: "center" }}>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn-back"
                style={{ background: "transparent", color: "#165B6D", border: "2px solid #165B6D", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }}
                onMouseOver={(e) => { e.target.style.background = "#165B6D"; e.target.style.color = "#fff"; }}
                onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#165B6D"; }}
              >
                ← Back to Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ERROR MODAL */}
      {messageModal.show && (
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
            justifyContent: "center"
          }}
          onClick={() => setMessageModal({ show: false, text: "", type: "" })}
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
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>
              ⚠️
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>
              Error
            </h3>
            <p style={{ color: "#6b7280", margin: "0 0 20px 0", fontSize: "14px" }}>
              {messageModal.text}
            </p>
            <button
              onClick={() => {
                setMessageModal({ show: false, text: "", type: "" });
                navigate("/ats-score");
              }}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ATSResult;