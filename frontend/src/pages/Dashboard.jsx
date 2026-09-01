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

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      navigate("/login");
      return;
    }

    // Get user name from localStorage
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

  const deleteResume = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedResumes = resumes.filter((resume) => resume._id !== id);
      setResumes(updatedResumes);
      localStorage.setItem("savedResumes", JSON.stringify(updatedResumes));

      setMessage("Resume deleted successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete resume");
      setMessageType("error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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

  return (
    <div className="dashboard">
      {/* ===== TOP NAVBAR WITH ALL NAV ITEMS ===== */}
      <nav className="dashboard-navbar">
        <div className="dashboard-nav-left">
          <Link to="/" className="logo">🚀 ResumeAI</Link>
        </div>

        <div className="dashboard-nav-center">
          <Link to="/dashboard" className="nav-link active">
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link to="/dashboard" className="nav-link">
            <span className="nav-icon">📄</span>
            My Resumes
          </Link>
          <Link to="/templates" className="nav-link">
            <span className="nav-icon">🎨</span>
            Templates
          </Link>
          <Link to="/ats-score" className="nav-link">
            <span className="nav-icon">📈</span>
            ATS Score
          </Link>
          <Link to="/ai-suggestions" className="nav-link">
            <span className="nav-icon">💡</span>
            AI Suggestions
          </Link>
        </div>

        <div className="dashboard-nav-right">
          <button className="nav-button" onClick={createResume}>
            + New Resume
          </button>
          
          <div className="user-profile">
            <div className="user-avatar" title={userName}>
              {getInitials(userName)}
            </div>
            <div className="user-dropdown">
              <button 
                className="dropdown-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="user-name">{userName}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu show">
                  <Link to="/profile" className="dropdown-item">
                    <span>👤</span> Profile
                  </Link>
                  <hr className="dropdown-divider" />
                  <button onClick={logout} className="dropdown-item logout">
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ===== DASHBOARD CONTENT ===== */}
      <main className="dashboard-content-full">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <div>
            <h1>Welcome back, {userName}! 👋</h1>
            <p>Here's an overview of your resumes and activity.</p>
          </div>
          <button className="btn-primary" onClick={createResume}>
            + Create New Resume
          </button>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <h3>{resumes.length}</h3>
              <p>Total Resumes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>85%</h3>
              <p>Average ATS Score</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>12</h3>
              <p>Applications Sent</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👀</div>
            <div className="stat-info">
              <h3>5</h3>
              <p>Profile Views</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        {/* Resume List */}
        <div className="dashboard-resumes">
          <div className="section-header">
            <h2>My Resumes</h2>
            <p>Create and manage your professional resumes.</p>
          </div>

          {loading && <p className="loading-text">Loading resumes...</p>}

          {!loading && resumes.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No resumes yet</h3>
              <p>Create your first resume to get started.</p>
              <button className="btn-primary" onClick={createResume}>
                Create Your First Resume
              </button>
            </div>
          )}

          <div className="resume-grid">
            {resumes.map((resume) => (
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
                <div className="resume-actions">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/edit-resume/${resume._id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-view"
                    onClick={() => {
                      localStorage.setItem("resumeDraft", JSON.stringify(resume));
                      navigate("/resume-preview");
                    }}
                  >
                    👁️ View
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteResume(resume._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;