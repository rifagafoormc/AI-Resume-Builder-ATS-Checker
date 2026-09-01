import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'error' or 'success'

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      // Try to fetch from API first
      const response = await API.get("/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resumeData = response.data.resumes || response.data;
      
      if (Array.isArray(resumeData) && resumeData.length > 0) {
        setResumes(resumeData);
        // Also save to localStorage as backup
        localStorage.setItem("savedResumes", JSON.stringify(resumeData));
      } else {
        // If no resumes from API, check localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      
      // If API fails, try to load from localStorage
      loadFromLocalStorage();
      
      // Show message but don't clear existing resumes
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

      // Remove from state
      const updatedResumes = resumes.filter((resume) => resume._id !== id);
      setResumes(updatedResumes);
      
      // Update localStorage
      localStorage.setItem("savedResumes", JSON.stringify(updatedResumes));
      
      setMessage("Resume deleted successfully!");
      setMessageType("success");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete resume");
      setMessageType("error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const createResume = () => {
    localStorage.removeItem("resumeDraft");
    navigate("/templates");
  };

  // Save resume to dashboard when created
  const saveResumeToDashboard = (resumeData) => {
    const savedResumes = JSON.parse(localStorage.getItem("savedResumes") || "[]");
    const newResume = {
      _id: Date.now().toString(),
      title: resumeData.title || "Untitled Resume",
      personalInfo: resumeData.personalInfo || { fullName: "" },
      createdAt: new Date().toISOString(),
      ...resumeData
    };
    
    savedResumes.unshift(newResume);
    localStorage.setItem("savedResumes", JSON.stringify(savedResumes));
    setResumes(savedResumes);
  };

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            This resume builder gets you hired faster
          </div>
          
          <h1 className="hero-title">
            Only <span className="highlight">2%</span> of resumes win.
            <br />
            Yours will be one of them.
          </h1>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={createResume}>
              Create my resume
            </button>
            <button className="btn-secondary">
              Upload my resume
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">39%</span>
              <span className="stat-label">more likely to land the job</span>
            </div>
          </div>

          <div className="trustpilot">
            <div className="trustpilot-stars">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
            </div>
            <span className="trustpilot-text">
              Trustpilot <strong>4.2</strong> out of 5 | 56,042 reviews
            </span>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="templates-section">
        <div className="section-header">
          <h2 className="section-title">Resume templates</h2>
          <p className="section-subtitle">
            Each resume template is designed to follow the exact rules you need to get hired faster.
            <br />
            Use our resume templates and get free access to 18 more career tools!
          </p>
          <div className="header-buttons">
            <button className="btn-primary" onClick={createResume}>
              Create my resume
            </button>
            <button className="btn-secondary">
              Upload my resume
            </button>
          </div>
        </div>

        {/* Template Filter Tabs */}
        <div className="template-tabs">
          <button className="tab active">All templates</button>
          <button className="tab">ATS</button>
          <button className="tab">Word</button>
          <button className="tab">Simple</button>
          <button className="tab">Professional</button>
          <button className="tab">Two-column</button>
          <button className="tab">Google Docs</button>
        </div>

        {/* Template Grid */}
        <div className="template-grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="template-card" key={item} onClick={createResume}>
              <div className="template-preview">
                <div className="template-placeholder">
                  <div className="template-profile">
                    <div className="profile-avatar"></div>
                    <div className="profile-name">Tiffany Giroux</div>
                    <div className="profile-title">Profile</div>
                    <div className="profile-text">
                      f Tiffany & Augusta Ashely
                      <br />
                      tive customer satisfaction. Presen
                      <br />
                      e of a client's needs and wants in order to achieve their goals.
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-info">
                <h3>Professional Template {item}</h3>
                <p>Clean and modern design</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="dashboard-content">
        <div className="dashboard-title">
          <div>
            <h2>My Resumes</h2>
            <p>Create and manage your professional resumes.</p>
          </div>
          <button className="btn-primary" onClick={createResume}>
            + Create Resume
          </button>
        </div>

        {loading && <p className="loading-text">Loading resumes...</p>}

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

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
                <p className="resume-date" style={{ fontSize: '11px', color: '#9ca3af', paddingLeft: '36px', marginBottom: '10px' }}>
                  Created: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              )}
              <div className="resume-actions">
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/edit-resume/${resume._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn-view"
                  onClick={() => {
                    localStorage.setItem("resumeDraft", JSON.stringify(resume));
                    navigate("/resume-preview");
                  }}
                  style={{
                    background: '#dbeafe',
                    color: '#2563eb',
                  }}
                >
                  View
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteResume(resume._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;