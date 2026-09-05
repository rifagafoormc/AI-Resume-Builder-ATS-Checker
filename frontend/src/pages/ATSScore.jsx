import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ATSScore() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // -----------------------------
  // Navbar state
  // -----------------------------
  const [userName, setUserName] = useState("User");
  const [showDropdown, setShowDropdown] = useState(false);

  // -----------------------------
  // Modal state (for alerts)
  // -----------------------------
  const [modal, setModal] = useState({ show: false, message: "" });

  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.name) {
      setUserName(userData.name);
    }
  }, []);

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

  // -----------------------------
  // Drag & Drop handlers
  // -----------------------------

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles && droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      validateAndSetFile(selectedFile);
    }
  };

  // -----------------------------
  // File selection
  // -----------------------------

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  // -----------------------------
  // Validate resume
  // -----------------------------

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      setModal({ show: true, message: "File size exceeds 5MB limit. Please choose a smaller file." });
      return;
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];

    const validExtensions = [".pdf", ".docx", ".doc", ".txt"];

    const fileExtension =
      "." + selectedFile.name.split(".").pop().toLowerCase();

    const isValidType =
      validTypes.includes(selectedFile.type) ||
      validExtensions.includes(fileExtension);

    if (!isValidType) {
      setModal({ show: true, message: "Please upload a PDF, DOCX, DOC, or TXT file." });
      return;
    }

    setFile(selectedFile);
    setUploadProgress(0);

    // Visual upload progress
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;

      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  // -----------------------------
  // Remove selected file
  // -----------------------------

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -----------------------------
  // Check ATS
  // -----------------------------

  const checkATS = async () => {
    if (!file) {
      setModal({ show: true, message: "Please upload your resume file first." });
      return;
    }

    if (!jobDescription.trim()) {
      setModal({ show: true, message: "Please enter the job description." });
      return;
    }

    if (jobDescription.trim().length < 30) {
      setModal({ show: true, message: "Please enter a complete job description." });
      return;
    }

    try {
      setChecking(true);

      const formData = new FormData();

      // Resume file
      formData.append("resume", file);

      // Job description
      formData.append("jobDescription", jobDescription.trim());

      const response = await axios.post(
        "http://localhost:5000/api/ats/analyze-upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // AI result returned by backend
      const atsResult = response.data.analysis || response.data;

      // Navigate to result page and pass AI result
      navigate("/ats-result", {
        state: {
          atsResult,
        },
      });
    } catch (error) {
      console.error("ATS analysis error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to analyze your resume. Please try again.";

      // Pass the error message to the result page modal instead of alert
      navigate("/ats-result", {
        state: {
          errorMessage: message,
        },
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="dashboard" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
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

      {/* ===== ATS SCORE CONTENT ===== */}
      <div className="ats-page">
        <div className="ats-card" style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "32px", maxWidth: "640px", margin: "0 auto", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)", width: "100%" }}>

          {/* -----------------------------
              PAGE TITLE
          ----------------------------- */}

          <h1 style={{ color: "#165B6D", margin: "0 0 8px", fontSize: "24px" }}>ATS Resume Checker</h1>

          <p style={{ color: "#6b7280", margin: "0 0 8px" }}>
            Check how well your resume matches a job description using
            AI-powered ATS analysis.
          </p>

          {/* -----------------------------
              RESUME UPLOAD
          ----------------------------- */}

          <div className="ats-upload-area" style={{ margin: "20px 0" }}>

            <div
              className={`upload-dropzone ${
                isDragging ? "dragging" : ""
              } ${file ? "has-file" : ""}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ border: "3px dashed #199E72", background: "#E6F2F0", borderRadius: "16px", padding: "40px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s ease" }}
            >

              {file ? (
                <div className="file-info">

                  <div className="file-icon" style={{ color: "#165B6D" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M8 13h8" />
                      <path d="M8 17h6" />
                    </svg>
                  </div>

                  <div className="file-details" style={{ color: "#165B6D" }}>

                    <p className="file-name" title={file.name}>
                      {file.name}
                    </p>

                    <p className="file-size" style={{ color: "#4A5568" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </p>

                    {uploadProgress < 100 && (
                      <div className="upload-progress" style={{ background: "#cbd5e1", borderRadius: "2px", height: "4px", marginTop: "7px", overflow: "hidden" }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${uploadProgress}%`,
                            background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)",
                            height: "100%",
                            borderRadius: "2px",
                            transition: "width 0.3s ease"
                          }}
                        />
                      </div>
                    )}

                    {uploadProgress === 100 && (
                      <span className="upload-success" style={{ color: "#199E72", fontWeight: "600" }}>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>

                        Upload complete

                      </span>
                    )}

                  </div>

                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                </div>

              ) : (

                <>
                  <div className="upload-icon" style={{ color: "#165B6D", marginBottom: "12px" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 16V4" />
                      <path d="M7 9l5-5 5 5" />
                      <path d="M5 20h14" />
                    </svg>
                  </div>

                  <p className="upload-text" style={{ color: "#1a1a2e", marginBottom: "12px" }}>
                    <strong>Drop your resume here</strong>
                    <br />
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>
                      or browse your files — free, no signup
                    </span>
                  </p>

                  <div className="upload-formats" style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
                    <span className="format-badge" style={{ background: "#D5F5E3", color: "#165B6D", padding: "4px 14px", borderRadius: "50px", fontSize: "12px", fontWeight: "600" }}>PDF</span>
                    <span className="format-badge" style={{ background: "#D5F5E3", color: "#165B6D", padding: "4px 14px", borderRadius: "50px", fontSize: "12px", fontWeight: "600" }}>DOCX</span>
                    <span className="format-badge" style={{ background: "#D5F5E3", color: "#165B6D", padding: "4px 14px", borderRadius: "50px", fontSize: "12px", fontWeight: "600" }}>TXT</span>
                    <span className="format-badge" style={{ background: "#D5F5E3", color: "#165B6D", padding: "4px 14px", borderRadius: "50px", fontSize: "12px", fontWeight: "600" }}>up to 5 MB</span>
                  </div>

                  <p className="upload-privacy" style={{ color: "#9ca3af", fontSize: "12px" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        display: "inline",
                        marginRight: "4px",
                        verticalAlign: "middle",
                      }}
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                      />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>

                    Your resume is never stored. Read once, scored,
                    discarded.
                  </p>
                </>

              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="
                  .pdf,
                  .docx,
                  .doc,
                  .txt,
                  application/pdf,
                  application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                  application/msword,
                  text/plain
                "
                style={{ display: "none" }}
              />

            </div>
          </div>

          {/* -----------------------------
              JOB DESCRIPTION
          ----------------------------- */}

          <div className="job-description-section" style={{ margin: "24px 0 4px", textAlign: "left" }}>

            <label htmlFor="jobDescription" style={{ display: "block", fontWeight: "600", fontSize: "15px", color: "#1a1a2e", marginBottom: "6px" }}>
              Job Description
            </label>

            <p className="job-description-help" style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 12px", lineHeight: "1.5" }}>
              Paste the job description of the position you are applying for.
              AI will compare it with your resume and generate an ATS score.
            </p>

            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here...

Example:
We are looking for a React.js Developer with experience in JavaScript, React, Node.js, MongoDB and REST APIs..."
              rows={10}
              maxLength={10000}
              style={{ width: "100%", border: "2px solid #e5e7eb", borderRadius: "12px", padding: "14px", fontSize: "14px", fontFamily: "inherit", color: "#1a1a2e", resize: "vertical", minHeight: "160px", boxSizing: "border-box", transition: "border-color 0.2s ease, box-shadow 0.2s ease", background: "#fafbfc" }}
              onFocus={(e) => { e.target.style.borderColor = "#165B6D"; e.target.style.boxShadow = "0 0 0 4px rgba(22, 91, 109, 0.1)"; e.target.style.background = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafbfc"; }}
            />

            <div className="character-count" style={{ textAlign: "right", fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>
              {jobDescription.length} / 10000
            </div>

          </div>

          {/* -----------------------------
              CHECK ATS BUTTON
          ----------------------------- */}

          <button
            type="button"
            onClick={checkATS}
            disabled={
              checking ||
              !file ||
              !jobDescription.trim()
            }
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: checking || !file || !jobDescription.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginTop: "12px",
              background: checking || !file || !jobDescription.trim() ? "rgba(22, 91, 109, 0.5)" : "linear-gradient(135deg, #165B6D 0%, #199E72 100%)",
              color: "white",
              boxShadow: checking || !file || !jobDescription.trim() ? "none" : "0 4px 15px rgba(22, 91, 109, 0.3)",
            }}
          >

            {checking ? (

              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    animation: "spin 1s linear infinite",
                    display: "inline",
                    marginRight: "8px",
                    verticalAlign: "middle",
                  }}
                >
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="M4.93 4.93l2.83 2.83" />
                  <path d="M16.24 16.24l2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="M4.93 19.07l2.83-2.83" />
                  <path d="M16.24 7.76l2.83-2.83" />
                </svg>

                Analyzing Resume...

              </>

            ) : (

              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    display: "inline",
                    marginRight: "8px",
                    verticalAlign: "middle",
                  }}
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>

                Check ATS Score

              </>

            )}

          </button>

        </div>
      </div>

      {/* ===== CENTERED MODAL FOR VALIDATION ERRORS ===== */}
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
          onClick={() => setModal({ show: false, message: "" })}
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
              onClick={() => setModal({ show: false, message: "" })}
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

export default ATSScore;