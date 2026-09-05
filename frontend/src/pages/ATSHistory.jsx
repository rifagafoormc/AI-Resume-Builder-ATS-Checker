import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./ATSHistory.css";

function ATSHistory() {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Navbar State
  const [userName, setUserName] = useState("User");
  const [showDropdown, setShowDropdown] = useState(false);

  // Modal State for delete confirmation
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // =========================================================
  // FETCH ANALYSIS HISTORY (WITH TOKEN FIX)
  // =========================================================

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get("/ats/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📊 ATS History Response:", response.data);

      setAnalyses(response.data?.analyses || []);
    } catch (err) {
      console.error("❌ Failed to fetch ATS history:", err);
      console.error("❌ Response:", err.response?.data);
      console.error("❌ Status:", err.response?.status);

      setError(
        err.response?.data?.message ||
          "Failed to load analysis history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.name) {
      setUserName(userData.name);
    }

    fetchHistory();
  }, []);

  // =========================================================
  // DELETE ANALYSIS (WITH CUSTOM MODAL)
  // =========================================================

  const confirmDelete = (id) => {
    setPendingDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;

    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/ats/${pendingDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalyses((prev) =>
        prev.filter((analysis) => analysis._id !== pendingDeleteId)
      );

      // Close modal
      setPendingDeleteId(null);
    } catch (err) {
      console.error("❌ Failed to delete analysis:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete analysis."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return;
    setPendingDeleteId(null);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // =========================================================
  // SCORE STATUS
  // =========================================================

  const getScoreStatus = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Needs Improvement";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#199E72";
    if (score >= 60) return "#f59e0b";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  // =========================================================
  // HELPERS
  // =========================================================

  // ✅ FIXED: Logout now redirects to Landing Page
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const createResume = () => {
    localStorage.removeItem("resumeDraft");
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

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="ats-history-page" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
        <div className="ats-history-loading">
          <div className="loading-spinner" style={{ borderTopColor: "#199E72" }}></div>
          <p style={{ color: "#165B6D" }}>Loading analysis history...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="ats-history-page" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>

      {/* =====================================================
          EXACT SAME NAVBAR AS DASHBOARD
      ===================================================== */}

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
          <Link to="/ats-history" className="nav-link active" style={{ color: "#199E72", background: "#D5F5E3" }}>
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
              <button 
                className="dropdown-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer" }}
              >
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

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="ats-history-container">

        <div className="ats-history-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>

          <div>
            <h1 style={{ color: "#165B6D", marginBottom: "8px" }}>ATS Analysis History</h1>
            <p style={{ color: "#4A5568" }}>
              View and manage your previous resume analyses.
            </p>
          </div>

          <button
            className="new-analysis-btn"
            onClick={() => navigate("/ats-score")}
            style={{
              backgroundColor: "#199E72",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            + New Analysis
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="history-error" style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px" }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {!error && analyses.length === 0 && (
          <div className="empty-history" style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "16px", textAlign: "center", border: "2px dashed #199E72" }}>

            <div className="empty-icon" style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>

            <h2 style={{ color: "#165B6D", marginBottom: "8px" }}>No ATS analyses yet</h2>

            <p style={{ color: "#4A5568", marginBottom: "24px" }}>
              Analyze your resume against a job description
              to see your results here.
            </p>

            <button
              className="empty-action-btn"
              onClick={() => navigate("/ats-score")}
              style={{
                backgroundColor: "#165B6D",
                color: "#ffffff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Analyze Resume
            </button>

          </div>
        )}

        {/* ===================================================
            ANALYSIS LIST
        =================================================== */}

        {analyses.length > 0 && (
          <div className="analysis-history-list">

            {analyses.map((analysis) => {

              const score = Number(
                analysis.atsScore ?? 0
              );

              const weightedScore = Number(
                analysis.weightedScore ?? score
              );

              const scoreColor =
                getScoreColor(score);

              const matchedCount =
                analysis.matchedKeywords?.length || 0;

              const missingCount =
                analysis.missingKeywords?.length || 0;

              const suggestionCount =
                analysis.suggestions?.length || 0;

              return (
                <div
                  className="analysis-history-card"
                  key={analysis._id}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "20px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #e5e7eb"
                  }}
                >

                  {/* ==========================================
                      MAIN CONTENT
                  ========================================== */}

                  <div className="analysis-card-main">

                    <div className="analysis-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>

                      <div>

                        <span className="analysis-label" style={{ color: "#199E72", fontWeight: "700", fontSize: "12px", letterSpacing: "1px" }}>
                          ATS ANALYSIS
                        </span>

                        <h2 style={{ color: "#165B6D", margin: "6px 0" }}>
                          {analysis.resume?.title ||
                            "Uploaded Resume"}
                        </h2>

                        <p className="analysis-date" style={{ color: "#6b7280", fontSize: "14px" }}>
                          Analyzed on{" "}
                          {formatDate(
                            analysis.createdAt
                          )}
                        </p>

                      </div>

                      {/* PERFECT SCORE CIRCLE */}
                      <div style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `conic-gradient(${scoreColor} 0% ${score}%, #e5e7eb ${score}% 100%)`,
                      }}>
                        <div style={{
                          position: "absolute",
                          width: "78px",
                          height: "78px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <span style={{ fontSize: "26px", fontWeight: "800", color: "#1f2937", lineHeight: "1" }}>
                            {score}
                          </span>
                          <small style={{ fontSize: "10px", fontWeight: "600", marginTop: "2px", color: "#6b7280" }}>
                            /100
                          </small>
                        </div>
                      </div>

                    </div>

                    {/* SCORE STATUS */}

                    <div
                      className="score-status"
                      style={{
                        display: "inline-block",
                        padding: "6px 16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        backgroundColor: `${scoreColor}20`,
                        color: scoreColor,
                        marginBottom: "15px"
                      }}
                    >
                      {getScoreStatus(score)}
                    </div>

                    {/* JOB DESCRIPTION */}

                    <div className="job-description-preview" style={{ backgroundColor: "#E6F2F0", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>

                      <h3 style={{ color: "#165B6D", marginBottom: "8px", fontSize: "16px" }}>Job Description</h3>

                      <p style={{ color: "#4A5568", fontSize: "14px", lineHeight: "1.6", margin: "0" }}>
                        {analysis.jobDescription
                          ? analysis.jobDescription
                              .replace(
                                /[#*_]/g,
                                ""
                              )
                              .replace(
                                /\s+/g,
                                " "
                              )
                              .trim()
                          : "No job description available."}
                      </p>

                    </div>

                    {/* STATS */}

                    <div className="analysis-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>

                      <div className="analysis-stat" style={{ textAlign: "center" }}>
                        <span className="stat-value" style={{ display: "block", fontSize: "22px", fontWeight: "700", color: "#165B6D" }}>
                          {weightedScore}
                        </span>

                        <span className="stat-label" style={{ fontSize: "12px", color: "#6b7280" }}>
                          Weighted Score
                        </span>
                      </div>

                      <div className="analysis-stat" style={{ textAlign: "center" }}>
                        <span className="stat-value" style={{ display: "block", fontSize: "22px", fontWeight: "700", color: "#165B6D" }}>
                          {matchedCount}
                        </span>

                        <span className="stat-label" style={{ fontSize: "12px", color: "#6b7280" }}>
                          Matched Keywords
                        </span>
                      </div>

                      <div className="analysis-stat" style={{ textAlign: "center" }}>
                        <span className="stat-value" style={{ display: "block", fontSize: "22px", fontWeight: "700", color: "#165B6D" }}>
                          {missingCount}
                        </span>

                        <span className="stat-label" style={{ fontSize: "12px", color: "#6b7280" }}>
                          Missing Keywords
                        </span>
                      </div>

                      <div className="analysis-stat" style={{ textAlign: "center" }}>
                        <span className="stat-value" style={{ display: "block", fontSize: "22px", fontWeight: "700", color: "#165B6D" }}>
                          {suggestionCount}
                        </span>

                        <span className="stat-label" style={{ fontSize: "12px", color: "#6b7280" }}>
                          Suggestions
                        </span>
                      </div>

                    </div>

                    {/* COMPONENT SCORES */}

                    {analysis.componentScores && (
                      <div className="component-scores" style={{ marginBottom: "20px" }}>

                        <div className="component-item" style={{ marginBottom: "12px" }}>

                          <div className="component-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ color: "#4A5568", fontSize: "14px" }}>
                              Content & Impact
                            </span>

                            <strong style={{ color: "#165B6D" }}>
                              {
                                analysis
                                  .componentScores
                                  .contentAndImpact
                                  ?.score ?? 0
                              }
                            </strong>
                          </div>

                          <div className="progress-bar" style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                            <div
                              className="progress-fill"
                              style={{
                                width: `${analysis.componentScores.contentAndImpact?.score ?? 0}%`,
                                height: "100%",
                                backgroundColor: "#199E72",
                                borderRadius: "4px"
                              }}
                            ></div>
                          </div>

                        </div>

                        <div className="component-item" style={{ marginBottom: "12px" }}>

                          <div className="component-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ color: "#4A5568", fontSize: "14px" }}>
                              Keyword Match
                            </span>

                            <strong style={{ color: "#165B6D" }}>
                              {
                                analysis
                                  .componentScores
                                  .keywordMatch
                                  ?.score ?? 0
                              }
                            </strong>
                          </div>

                          <div className="progress-bar" style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                            <div
                              className="progress-fill"
                              style={{
                                width: `${analysis.componentScores.keywordMatch?.score ?? 0}%`,
                                height: "100%",
                                backgroundColor: "#199E72",
                                borderRadius: "4px"
                              }}
                            ></div>
                          </div>

                        </div>

                        <div className="component-item" style={{ marginBottom: "12px" }}>

                          <div className="component-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ color: "#4A5568", fontSize: "14px" }}>
                              Skills
                            </span>

                            <strong style={{ color: "#165B6D" }}>
                              {
                                analysis
                                  .componentScores
                                  .skills
                                  ?.score ?? 0
                              }
                            </strong>
                          </div>

                          <div className="progress-bar" style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                            <div
                              className="progress-fill"
                              style={{
                                width: `${analysis.componentScores.skills?.score ?? 0}%`,
                                height: "100%",
                                backgroundColor: "#199E72",
                                borderRadius: "4px"
                              }}
                            ></div>
                          </div>

                        </div>

                        <div className="component-item" style={{ marginBottom: "12px" }}>

                          <div className="component-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ color: "#4A5568", fontSize: "14px" }}>
                              Formatting
                            </span>

                            <strong style={{ color: "#165B6D" }}>
                              {
                                analysis
                                  .componentScores
                                  .formatting
                                  ?.score ?? 0
                              }
                            </strong>
                          </div>

                          <div className="progress-bar" style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                            <div
                              className="progress-fill"
                              style={{
                                width: `${analysis.componentScores.formatting?.score ?? 0}%`,
                                height: "100%",
                                backgroundColor: "#199E72",
                                borderRadius: "4px"
                              }}
                            ></div>
                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                  {/* ==========================================
                      ACTIONS (Only Delete)
                  ========================================== */}

                  <div className="analysis-card-actions">
                    <button
                      className="delete-analysis-btn"
                      onClick={() =>
                        confirmDelete(analysis._id)
                      }
                      style={{
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>

      {/* =====================================================
          DELETE CONFIRMATION MODAL (Blurred Background)
      ===================================================== */}

      {pendingDeleteId && (
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
          onClick={handleDeleteCancel}
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
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>🗑️</div>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>
              Delete this analysis?
            </h3>
            <p style={{ color: "#6b7280", margin: "0 0 20px 0", fontSize: "14px" }}>
              This action cannot be undone. The analysis will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  color: "#374151",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ATSHistory;