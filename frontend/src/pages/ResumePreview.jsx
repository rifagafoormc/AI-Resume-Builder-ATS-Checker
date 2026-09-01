import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import API from "../services/api";
import "../App.css";
import "./ResumePreview.css";

function ResumePreview() {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveMessageType, setSaveMessageType] = useState("");
  const resumeRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("resumeDraft") || "{}");
    const template = localStorage.getItem("selectedTemplate") || "professional";
    
    setResumeData(draft);
    setSelectedTemplate(template);
  }, []);

  if (!resumeData) {
    return (
      <div className="loading-container">
        <p>Loading resume...</p>
      </div>
    );
  }

  // Download PDF function using html2pdf
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    const element = resumeRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${resumeData.personalInfo?.fullName || 'resume'}_resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Save Resume function
  const handleSaveResume = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setSaveMessageType("");

    const resumeToSave = {
      title: resumeData.title || "Untitled Resume",
      personalInfo: resumeData.personalInfo || {},
      summary: resumeData.summary || "",
      jobTitle: resumeData.jobTitle || "",
      experience: resumeData.experience || [],
      education: resumeData.education || [],
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      certifications: resumeData.certifications || [],
      languages: resumeData.languages || [],
      template: selectedTemplate,
    };

    try {
      // Try to save to backend API
      const response = await API.post("/resumes", resumeToSave, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // If API save succeeds
      const savedResume = response.data.resume || response.data;
      
      // Also save to localStorage as backup
      saveToLocalStorage(savedResume);
      
      setSaveMessage("✅ Resume saved successfully!");
      setSaveMessageType("success");
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
        setSaveMessageType("");
        navigate("/dashboard");
      }, 2000);
      
    } catch (error) {
      console.error("Error saving to API:", error);
      
      // If API fails, save to localStorage only
      const localResume = {
        _id: Date.now().toString(),
        ...resumeToSave,
        createdAt: new Date().toISOString(),
        savedLocally: true,
      };
      
      saveToLocalStorage(localResume);
      
      setSaveMessage("💾 Saved locally (offline mode). Will sync when online.");
      setSaveMessageType("info");
      
      setTimeout(() => {
        setSaveMessage("");
        setSaveMessageType("");
        navigate("/dashboard");
      }, 2500);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to save to localStorage
  const saveToLocalStorage = (resume) => {
    try {
      const savedResumes = JSON.parse(localStorage.getItem("savedResumes") || "[]");
      
      // Check if resume already exists (by _id)
      const existingIndex = savedResumes.findIndex(r => r._id === resume._id);
      
      if (existingIndex !== -1) {
        // Update existing resume
        savedResumes[existingIndex] = resume;
      } else {
        // Add new resume
        savedResumes.unshift(resume);
      }
      
      localStorage.setItem("savedResumes", JSON.stringify(savedResumes));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "professional":
        return <ProfessionalTemplate data={resumeData} />;
      case "modern":
        return <ModernTemplate data={resumeData} />;
      case "creative":
        return <CreativeTemplate data={resumeData} />;
      default:
        return <ProfessionalTemplate data={resumeData} />;
    }
  };

  return (
    <div className="resume-preview-page">
      <div className="preview-actions no-print">
        <div className="preview-actions-left">
          <button className="btn-back" onClick={() => navigate("/experience")}>
            ← Back to Edit
          </button>
        </div>
        <div className="preview-actions-right">
          <button 
            className="btn-save" 
            onClick={handleSaveResume}
            disabled={isSaving}
          >
            {isSaving ? "⏳ Saving..." : "💾 Save Resume"}
          </button>
          <button 
            className="btn-primary" 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? "⏳ Generating..." : "📄 Download PDF"}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`save-message ${saveMessageType}`}>
          {saveMessage}
        </div>
      )}

      <div className="resume-wrapper" ref={resumeRef}>
        {renderTemplate()}
      </div>
    </div>
  );
}

// ============================================
// PROFESSIONAL TEMPLATE (Alice Smithson style)
// ============================================
function ProfessionalTemplate({ data }) {
  const { personalInfo, jobTitle, summary, experience, education, skills, projects } = data;

  const hasExperience = experience && experience.length > 0 && experience[0]?.company;
  const hasProjects = projects && projects.length > 0 && projects[0]?.name;

  return (
    <div className="resume professional-resume">
      <div className="resume-inner">
        {/* Header */}
        <div className="professional-header">
          <h1 className="professional-name">{personalInfo?.fullName?.toUpperCase() || "ALICE SMITHSON"}</h1>
          <h2 className="professional-title">{jobTitle || "PROFESSIONAL"}</h2>
        </div>

        <div className="professional-body">
          {/* Left Column */}
          <div className="professional-left">
            {/* Contact */}
            <div className="professional-section">
              <h3 className="professional-section-title">CONTACT</h3>
              <div className="professional-contact">
                {personalInfo?.phone && <p><strong>Phone:</strong> {personalInfo.phone}</p>}
                {personalInfo?.email && <p><strong>Email:</strong> {personalInfo.email}</p>}
                {personalInfo?.location && <p><strong>Location:</strong> {personalInfo.location}</p>}
                {personalInfo?.linkedin && <p><strong>LinkedIn:</strong> {personalInfo.linkedin}</p>}
                {personalInfo?.github && <p><strong>GitHub:</strong> {personalInfo.github}</p>}
              </div>
            </div>

            {/* Professional Profile */}
            <div className="professional-section">
              <h3 className="professional-section-title">PROFESSIONAL PROFILE</h3>
              <p className="professional-text">{summary || "No summary added yet."}</p>
            </div>

            {/* Education */}
            {education && education.length > 0 && education[0]?.institution && (
              <div className="professional-section">
                <h3 className="professional-section-title">EDUCATION</h3>
                {education.map((edu, index) => (
                  <div key={index} className="professional-education">
                    <p className="professional-edu-degree">{edu.degree || "DEGREE"} {edu.field ? `| ${edu.field}` : ""}</p>
                    <p className="professional-edu-school">{edu.institution}</p>
                    {edu.location && <p className="professional-edu-location">{edu.location}</p>}
                    <p className="professional-edu-year">{edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && skills[0] && (
              <div className="professional-section">
                <h3 className="professional-section-title">PROF. SKILLS</h3>
                <ul className="professional-skills">
                  {skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="professional-right">
            {/* Experience - Show first if exists */}
            {hasExperience && (
              <div className="professional-section">
                <h3 className="professional-section-title">EXPERIENCE</h3>
                {experience.map((exp, index) => (
                  <div key={index} className="professional-experience">
                    <h4 className="professional-exp-title">{exp.position || "Job Title"}</h4>
                    <p className="professional-exp-company">
                      {exp.company} {exp.startDate ? exp.startDate : ""} {exp.endDate ? `- ${exp.endDate}` : ""}
                    </p>
                    {exp.description && <p className="professional-exp-desc">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Projects - Show after Experience, or at top if no Experience */}
            {hasProjects && (
              <div className="professional-section">
                <h3 className="professional-section-title">PROJECTS</h3>
                {projects.map((project, index) => (
                  <div key={index} className="professional-experience">
                    <h4 className="professional-exp-title">{project.name}</h4>
                    {project.technologies && (
                      <p className="professional-exp-company" style={{ fontSize: '11px', color: '#667eea' }}>
                        {project.technologies}
                      </p>
                    )}
                    {project.description && <p className="professional-exp-desc">{project.description}</p>}
                    {project.link && (
                      <p className="professional-exp-company" style={{ fontSize: '10px' }}>
                        🔗 {project.link}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODERN TEMPLATE (James William style)
// ============================================
function ModernTemplate({ data }) {
  const { personalInfo, jobTitle, summary, experience, education, skills, projects } = data;

  const hasExperience = experience && experience.length > 0 && experience[0]?.company;
  const hasProjects = projects && projects.length > 0 && projects[0]?.name;

  return (
    <div className="resume modern-resume">
      <div className="resume-inner">
        {/* Header */}
        <div className="modern-header">
          <h1 className="modern-name">{personalInfo?.fullName?.toUpperCase() || "JAMES WILLIAM"}</h1>
          <h2 className="modern-title">{jobTitle || "PROFESSIONAL"}</h2>
        </div>

        {/* Summary */}
        {summary && (
          <div className="modern-summary">
            <p>{summary}</p>
          </div>
        )}

        <div className="modern-body">
          {/* Left Column */}
          <div className="modern-left">
            {/* Contacts */}
            <div className="modern-section">
              <h3 className="modern-section-title">CONTACTS</h3>
              <div className="modern-contact">
                {personalInfo?.phone && <p><strong>Phone</strong><br />{personalInfo.phone}</p>}
                {personalInfo?.email && <p><strong>Email</strong><br />{personalInfo.email}</p>}
                {personalInfo?.location && <p><strong>Address</strong><br />{personalInfo.location}</p>}
              </div>
            </div>

            {/* Skills */}
            {skills && skills.length > 0 && skills[0] && (
              <div className="modern-section">
                <h3 className="modern-section-title">SKILLS</h3>
                <div className="modern-skills">
                  <ul>
                    {skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && education[0]?.institution && (
              <div className="modern-section">
                <h3 className="modern-section-title">EDUCATION</h3>
                {education.map((edu, index) => (
                  <div key={index} className="modern-education">
                    <p className="modern-edu-year">{edu.startDate} - {edu.endDate || "Present"}</p>
                    <p className="modern-edu-degree">{edu.degree || "Degree"}</p>
                    <p className="modern-edu-school">{edu.institution}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="modern-right">
            {/* Experience - Show first if exists */}
            {hasExperience && (
              <div className="modern-section">
                <h3 className="modern-section-title">WORK EXPERIENCE</h3>
                {experience.map((exp, index) => (
                  <div key={index} className="modern-experience">
                    <h4 className="modern-exp-company">{exp.company}</h4>
                    {exp.location && <p className="modern-exp-address">{exp.location}</p>}
                    <h5 className="modern-exp-title">{exp.position || "Position"}</h5>
                    <p className="modern-exp-date">{exp.startDate} - {exp.endDate || "Present"}</p>
                    {exp.description && <p className="modern-exp-desc">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Projects - Show after Experience, or at top if no Experience */}
            {hasProjects && (
              <div className="modern-section">
                <h3 className="modern-section-title">PROJECTS</h3>
                {projects.map((project, index) => (
                  <div key={index} className="modern-experience">
                    <h4 className="modern-exp-company">{project.name}</h4>
                    {project.technologies && (
                      <p className="modern-exp-address" style={{ color: '#667eea' }}>
                        {project.technologies}
                      </p>
                    )}
                    {project.description && <p className="modern-exp-desc">{project.description}</p>}
                    {project.link && (
                      <p className="modern-exp-address" style={{ fontSize: '11px' }}>
                        🔗 {project.link}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CREATIVE TEMPLATE (John Doe style)
// ============================================
function CreativeTemplate({ data }) {
  const { personalInfo, jobTitle, summary, experience, education, skills, projects } = data;

  const hasExperience = experience && experience.length > 0 && experience[0]?.company;
  const hasProjects = projects && projects.length > 0 && projects[0]?.name;

  return (
    <div className="resume creative-resume">
      <div className="resume-inner">
        {/* Header */}
        <div className="creative-header">
          <div className="creative-header-left">
            <h1 className="creative-name">{personalInfo?.fullName || "JOHN DOE"}</h1>
            <h2 className="creative-title">{jobTitle || "Creative Director"}</h2>
          </div>
          <div className="creative-header-right">
            <div className="creative-avatar">
              <span>{personalInfo?.fullName?.split(" ").map(n => n[0]).join("") || "JD"}</span>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="creative-contact-bar">
          {personalInfo?.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo?.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo?.location && <span>📍 {personalInfo.location}</span>}
        </div>

        <div className="creative-body">
          {/* Left Column */}
          <div className="creative-left">
            {/* About */}
            {summary && (
              <div className="creative-section">
                <h3 className="creative-section-title">ABOUT</h3>
                <p className="creative-text">{summary}</p>
              </div>
            )}

            {/* Experience - Show first if exists */}
            {hasExperience && (
              <div className="creative-section">
                <h3 className="creative-section-title">EXPERIENCES</h3>
                {experience.map((exp, index) => (
                  <div key={index} className="creative-experience">
                    <h4 className="creative-exp-title">{exp.position || "Position"}</h4>
                    <p className="creative-exp-company">{exp.company}</p>
                    <p className="creative-exp-date">{exp.startDate} - {exp.endDate || "Current"}</p>
                    {exp.description && <p className="creative-exp-desc">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Projects - Show after Experience, or at top if no Experience */}
            {hasProjects && (
              <div className="creative-section">
                <h3 className="creative-section-title">PROJECTS</h3>
                {projects.map((project, index) => (
                  <div key={index} className="creative-experience">
                    <h4 className="creative-exp-title">{project.name}</h4>
                    {project.technologies && (
                      <p className="creative-exp-company" style={{ color: '#667eea', fontSize: '12px' }}>
                        {project.technologies}
                      </p>
                    )}
                    {project.description && <p className="creative-exp-desc">{project.description}</p>}
                    {project.link && (
                      <p className="creative-exp-date">🔗 {project.link}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="creative-right">
            {/* Education */}
            {education && education.length > 0 && education[0]?.institution && (
              <div className="creative-section">
                <h3 className="creative-section-title">EDUCATION</h3>
                {education.map((edu, index) => (
                  <div key={index} className="creative-education">
                    <p className="creative-edu-degree">{edu.degree || "Degree"}</p>
                    <p className="creative-edu-school">{edu.institution}</p>
                    <p className="creative-edu-year">{edu.startDate} - {edu.endDate || "Present"}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && skills[0] && (
              <div className="creative-section">
                <h3 className="creative-section-title">SOFTWARE SKILLS</h3>
                <div className="creative-skills">
                  {skills.map((skill, index) => (
                    <span key={index} className="creative-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="creative-footer">
          {personalInfo?.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo?.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo?.portfolio && <span>🌐 {personalInfo.portfolio}</span>}
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;