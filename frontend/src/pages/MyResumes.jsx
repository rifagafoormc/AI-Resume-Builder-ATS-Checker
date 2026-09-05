import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function MyResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [userName, setUserName] = useState("User");
  const [showDropdown, setShowDropdown] = useState(false);
  
  // State for the delete modal
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

      if (Array.isArray(resumeData)) {
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
      if (Array.isArray(savedResumes)) {
        setResumes(savedResumes);
      }
    } catch (error) {
      console.error("Error loading saved resumes:", error);
    }
  };

  // Step 1: Clicking delete opens the modal
  const confirmDelete = (id) => {
    setPendingDeleteId(id);
  };

  // Step 2: Confirming deletes the resume
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
      console.error("Error deleting resume:", error);
      setMessage("Failed to delete resume.");
      setMessageType("error");
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null); // Close modal
    }
  };

  // Step 3: Cancel closes the modal
  const handleDeleteCancel = () => {
    if (isDeleting) return;
    setPendingDeleteId(null);
  };

  const viewResume = (resume) => {
    localStorage.setItem("resumeDraft", JSON.stringify(resume));
    if (resume.template) {
      localStorage.setItem("selectedTemplate", resume.template);
    }
    navigate("/resume-preview");
  };

  // *** UPDATED EDIT FUNCTION ***
  const editResume = (resume) => {
    localStorage.setItem(
      "resumeDraft",
      JSON.stringify(resume)
    );

    if (resume.template) {
      localStorage.setItem(
        "selectedTemplate",
        resume.template
      );
    }

    navigate(`/basic-details/${resume._id}`);
  };

  const createResume = () => {
    localStorage.removeItem("resumeDraft");
    localStorage.removeItem("selectedTemplate");
    navigate("/templates");
  };

  // ✅ FIXED: Logout now redirects to Landing Page
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="dashboard" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
      {/* ================= NAVBAR (Exact same as Dashboard) ================= */}
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
            </span> Dashboard
          </Link>
          <Link to="/templates" className="nav-link">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.2H22l-6.2 4.8 2.4 7.2-6.2-4.8-6.2 4.8 2.4-7.2L2 9.2h7.6z"></path>
              </svg>
            </span> Templates
          </Link>
          <Link to="/ats-score" className="nav-link">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M18 17V9"></path>
                <path d="M13 17V5"></path>
                <path d="M8 17v-3"></path>
              </svg>
            </span> ATS Score
          </Link>
          <Link to="/my-resumes" className="nav-link active" style={{ color: "#199E72", background: "#D5F5E3" }}>
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </span> My Resumes
          </Link>
          <Link to="/ats-history" className="nav-link">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span> ATS History
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

      {/* ================= PAGE CONTENT ================= */}
      <main className="dashboard-content-full">
        <div className="dashboard-welcome">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Changed title to Dark Green */}
            <h1 style={{ color: "#165B6D" }}>My Resumes</h1>
            {!loading && (
              <span
                style={{
                  backgroundColor: "#D5F5E3",
                  color: "#165B6D",
                  border: "1px solid #199E72",
                  borderRadius: "50px",
                  padding: "4px 12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {resumes.length}
              </span>
            )}
          </div>
          <p style={{ color: "#4A5568" }}>Manage, edit and view all your saved resumes.</p>
          
          <button className="btn-primary" onClick={createResume} style={{ background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
            + Create New Resume
          </button>
        </div>

        {message && <div className={`message ${messageType}`}>{message}</div>}

        {loading && <p className="loading-text" style={{ color: "#165B6D" }}>Loading resumes...</p>}

        {!loading && resumes.length === 0 && (
          <div className="empty-state" style={{ background: "#fff", border: "2px dashed #199E72", borderRadius: "16px" }}>
            <div className="empty-icon">📄</div>
            <h3 style={{ color: "#165B6D" }}>No resumes yet</h3>
            <p style={{ color: "#4A5568" }}>Create your first professional resume to get started.</p>
            <button className="btn-primary" onClick={createResume} style={{ background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
              Create Your First Resume
            </button>
          </div>
        )}

        {!loading && resumes.length > 0 && (
          <div className="resume-grid">
            {resumes.map((resume) => (
              <div className="resume-card" key={resume._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)" }}>
                <div className="resume-card-header">
                  <div className="resume-icon">📄</div>
                  <h3 style={{ color: "#165B6D" }}>{resume.title || "Untitled Resume"}</h3>
                </div>

                <p className="resume-name" style={{ color: "#4A5568" }}>
                  {resume.personalInfo?.fullName || "No name added"}
                </p>

                {resume.jobTitle && <p className="resume-date" style={{ color: "#6b7280" }}>{resume.jobTitle}</p>}
                {resume.createdAt && <p className="resume-date" style={{ color: "#6b7280" }}>Created: {new Date(resume.createdAt).toLocaleDateString()}</p>}
                {resume.updatedAt && resume.updatedAt !== resume.createdAt && <p className="resume-date" style={{ color: "#6b7280" }}>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>}

                <div className="resume-actions">
                  <button className="btn-edit" onClick={() => editResume(resume)} style={{ background: "#199E72", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>✏️ Edit</button>
                  
                  {/* UPDATED: Replaced the eye emoji with the SVG icon */}
                  <button className="btn-view" onClick={() => viewResume(resume)} style={{ background: "#E6F2F0", color: "#165B6D", border: "1px solid #165B6D", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View
                  </button>
                  
                  {/* Opens the modal */}
                  <button className="btn-delete" onClick={() => confirmDelete(resume._id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default MyResumes;