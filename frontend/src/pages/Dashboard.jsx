import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [userName, setUserName] = useState("User");
  const [showDropdown, setShowDropdown] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.name) {
      setUserName(userData.name);
    }

    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await API.get("/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resumeData = response.data.resumes || response.data;

      if (Array.isArray(resumeData) && resumeData.length > 0) {
        setResumes(resumeData);
        localStorage.setItem("savedResumes", JSON.stringify(resumeData));
      } else {
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      loadFromLocalStorage();
      setMessage("Could not connect to server. Showing saved resumes.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedResumes = JSON.parse(localStorage.getItem("savedResumes") || "[]");
      if (Array.isArray(savedResumes) && savedResumes.length > 0) {
        setResumes(savedResumes);
        setMessage("Showing locally saved resumes.");
        setMessageType("info");
      }
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
  };

  const confirmDelete = (id) => {
    setPendingDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;

    setIsDeleting(true);
    try {
      await API.delete(`/resumes/${pendingDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedResumes = resumes.filter((resume) => resume._id !== pendingDeleteId);
      setResumes(updatedResumes);
      localStorage.setItem("savedResumes", JSON.stringify(updatedResumes));

      setMessage("Resume deleted successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete resume");
      setMessageType("error");
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return;
    setPendingDeleteId(null);
  };

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

  const editResume = (resume) => {
    localStorage.setItem("resumeDraft", JSON.stringify(resume));
    if (resume.template) {
      localStorage.setItem("selectedTemplate", resume.template);
    }
    navigate(`/basic-details/${resume._id}`);
  };

  const viewResume = (resume) => {
    localStorage.setItem("resumeDraft", JSON.stringify(resume));
    if (resume.template) {
      localStorage.setItem("selectedTemplate", resume.template);
    }
    navigate("/resume-preview");
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
    <div className="dashboard" style={{ backgroundColor: "#E6F2F0" }}>
      {/* ================= OVERRIDING GLOBAL CSS TO GREEN ================= */}
      <style>{`
        /* GREEN ACTIVE NAV LINK */
        .dashboard-nav-center .nav-link.active {
          color: #199E72 !important;
          background: #D5F5E3 !important; /* Slightly darker green for contrast */
        }
        .dashboard-nav-center .nav-link.active:hover {
          color: #165B6D !important;
        }

        /* WELCOME SECTION */
        .welcome-back-section {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 24px 32px;
          margin-top: 30px;
          margin-bottom: 30px;
        }
        .welcome-back-section h1 {
          font-size: 32px;
          font-weight: 800;
          color: #165B6D;
          margin: 0;
        }

        /* MAIN CONTENT */
        .dash-main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 60px 20px;
        }

        /* HERO SECTION */
        .dash-hero-section {
          text-align: center;
          margin: 50px 0;
        }
        .dash-hero-section h1 {
          font-size: 42px;
          font-weight: 800;
          color: #165B6D;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }
        .dash-hero-section p {
          font-size: 18px;
          color: #4A5568;
          margin-bottom: 40px;
        }
        .dash-hero-cards {
          display: flex;
          gap: 24px;
          justify-content: center;
          max-width: 800px;
          margin: 0 auto;
        }

        /* DARK GREEN HERO CARDS */
        .dash-hero-card {
          background: #165B6D;
          border: 1px solid #0F4C5C;
          border-radius: 16px;
          padding: 30px;
          flex: 1;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .dash-hero-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(22, 91, 109, 0.3);
          border-color: #199E72;
        }
        .dash-hero-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .dash-hero-icon-box.teal,
        .dash-hero-icon-box.green {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .dash-hero-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
        }
        .dash-hero-card p {
          font-size: 15px;
          color: #E6F2F0;
          margin: 0 0 15px 0;
          line-height: 1.5;
          min-height: 44px;
        }
        .dash-hero-card .arrow {
          font-size: 18px;
          color: #E6F2F0;
          transition: transform 0.3s;
          display: inline-block;
        }
        .dash-hero-card:hover .arrow {
          transform: translateX(5px);
          color: #ffffff;
        }

        /* ===== DARK GREEN HOW IT WORKS SECTIONS ===== */
        .dash-how-it-works {
          max-width: 1000px;
          margin: 0 auto 60px auto;
          padding: 40px;
          background: #165B6D;
          border: 1px solid #0F4C5C;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .dash-how-it-works h2 {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          color: #E6F2F0;
          margin-bottom: 40px;
        }
        .dash-steps-container {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        .dash-step-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 30px;
          flex: 1;
          text-align: center;
          transition: all 0.3s;
        }
        .dash-step-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #199E72;
        }
        .dash-step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #199E72;
          color: #fff;
          font-weight: 700;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
        }
        .dash-step-card h3 {
          font-size: 18px;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .dash-step-card p {
          font-size: 14px;
          color: #E6F2F0;
          line-height: 1.6;
        }

        .dash-section-divider {
          height: 1px;
          background: #C8E6D4;
          margin: 50px auto;
          max-width: 800px;
        }

        /* ===== DARK GREEN MY RESUMES SECTION ===== */
        .dash-resumes-section {
          background: #165B6D;
          border: 1px solid #0F4C5C;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        .dash-resumes-section .section-header h2 {
          color: #E6F2F0;
        }
        .dash-resumes-section .section-header p {
          color: #E6F2F0;
        }
        /* Resume Cards remain dark green */
        .dash-resumes-section .resume-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
        .dash-resumes-section .resume-card h3 {
          color: #ffffff;
        }
        .dash-resumes-section .resume-name,
        .dash-resumes-section .resume-date {
          color: #E6F2F0;
        }
      `}</style>

      {/* ===== TOP NAVBAR WITH ALL NAV ITEMS ===== */}
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
          <Link to="/dashboard" className="nav-link active">
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

      {/* ===== DASHBOARD CONTENT ===== */}
      <main className="dash-main-content">
        
        {/* WELCOME BACK GREETING */}
        <div className="welcome-back-section">
          <h1>Welcome back, {userName}! 👋</h1>
        </div>

        {/* HERO SECTION */}
        <div className="dash-hero-section">
          <h1>What would you like to do?</h1>
          <p>Pick a path and we'll get you there in minutes</p>
          
          <div className="dash-hero-cards">
            <div className="dash-hero-card" onClick={createResume}>
              <div className="dash-hero-icon-box teal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>Start Fresh</h3>
              <p>Build a professional resume from scratch</p>
              <span className="arrow">→</span>
            </div>

            <div className="dash-hero-card" onClick={() => navigate("/ats-score")}>
              <div className="dash-hero-icon-box green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h3>Upload & Improve</h3>
              <p>Import your existing resume PDF and optimize it for ATS</p>
              <span className="arrow">→</span>
            </div>
          </div>
        </div>

        {/* ===== SECTION 1 ===== */}
        <div className="dash-how-it-works">
          <h2>How Resume Building Works</h2>
          <div className="dash-steps-container">
            <div className="dash-step-card">
              <div className="dash-step-number">1</div>
              <h3>Choose a Template</h3>
              <p>Pick from our professionally designed templates.</p>
            </div>
            <div className="dash-step-card">
              <div className="dash-step-number">2</div>
              <h3>Fill in Your Details</h3>
              <p>Add your experience, education, skills, and projects.</p>
            </div>
            <div className="dash-step-card">
              <div className="dash-step-number">3</div>
              <h3>Download & Apply</h3>
              <p>Download a polished, professional PDF.</p>
            </div>
          </div>
        </div>

        {/* ===== DIVIDER ===== */}
        <div className="dash-section-divider"></div>

        {/* ===== SECTION 2 ===== */}
        <div className="dash-how-it-works">
          <h2>How ATS Score Checking Works</h2>
          <div className="dash-steps-container">
            <div className="dash-step-card">
              <div className="dash-step-number">1</div>
              <h3>Upload Your Resume</h3>
              <p>Upload your resume or use one built with our editor.</p>
            </div>
            <div className="dash-step-card">
              <div className="dash-step-number">2</div>
              <h3>Get Instant Analysis</h3>
              <p>Get a score based on ATS best practices.</p>
            </div>
            <div className="dash-step-card">
              <div className="dash-step-number">3</div>
              <h3>Fix & Improve</h3>
              <p>Get actionable tips to boost your score.</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        {/* ===== MY RESUMES (Buttons Updated, Dark Green Box Kept) ===== */}
        <div className="dash-resumes-section">
          <div className="section-header">
            <h2>My Resumes</h2>
            <p>Your recently created resumes.</p>
          </div>

          {loading && <p className="loading-text" style={{ color: "#E6F2F0" }}>Loading resumes...</p>}

          {!loading && resumes.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No resumes yet</h3>
              <p>Create your first resume to get started.</p>
              <button className="btn-primary" onClick={createResume} style={{ background: "#199E72", color: "#fff" }}>
                Create Your First Resume
              </button>
            </div>
          )}

          {!loading && resumes.length > 0 && (
            <>
              <div className="resume-grid">
                {resumes.slice(0, 3).map((resume) => (
                  <div className="resume-card" key={resume._id}>
                    <div className="resume-card-header">
                      <div className="resume-icon">📄</div>
                      <h3>{resume.title || "Untitled Resume"}</h3>
                    </div>
                    <p className="resume-name">
                      {resume.personalInfo?.fullName || "No name added"}
                    </p>
                    {resume.createdAt && (
                      <p className="resume-date">
                        Created: {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    
                    {/* UPDATED BUTTONS TO MATCH MY RESUME PAGE */}
                    <div className="resume-actions">
                      <button 
                        className="btn-edit" 
                        onClick={() => editResume(resume)} 
                        style={{ background: "#199E72", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                      >
                        ✏️ Edit
                      </button>
                      
                      <button 
                        className="btn-view" 
                        onClick={() => viewResume(resume)} 
                        style={{ background: "#E6F2F0", color: "#165B6D", border: "1px solid #165B6D", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View
                      </button>
                      
                      <button 
                        className="btn-delete" 
                        onClick={() => confirmDelete(resume._id)} 
                        style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {resumes.length > 3 && (
                <div 
                  className="view-all-resumes"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "40px",
                    marginBottom: "20px"
                  }}
                >
                  <button
                    className="btn-primary"
                    onClick={() => navigate("/my-resumes")}
                    style={{ background: "#199E72", color: "#fff" }}
                  >
                    View All Resumes →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
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
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>Delete this resume?</h3>
            <p style={{ color: "#6b7280", margin: "0 0 20px 0", fontSize: "14px" }}>
              This action cannot be undone. The resume will be permanently deleted.
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

export default Dashboard;