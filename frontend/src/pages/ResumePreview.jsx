import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import API from "../services/api";
import "../App.css";
import "./ResumePreview.css";
import { ProfessionalTemplate, ModernTemplate, CreativeTemplate } from "./ResumeTemplates";

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
      <div className="loading-container" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#165B6D" }}>Loading resume...</p>
      </div>
    );
  }

  // Download PDF function using html2pdf
  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    const element = resumeRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${resumeData.personalInfo?.fullName || "resume"}_resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
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

  // Save Resume function (Uses PUT for existing, POST for new)
  const handleSaveResume = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setSaveMessageType("");

    // Capture the current ID *before* any state updates
    const existingResumeId = resumeData._id; 

    // IMPORTANT: Read from resumeData, NOT from empty default values
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
      let response;

      // If the resume already has an ID, UPDATE the existing resume
      if (existingResumeId) {
        response = await API.put(
          `/resumes/${existingResumeId}`,
          resumeToSave,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // If there is no ID, CREATE a new resume
        response = await API.post(
          "/resumes",
          resumeToSave,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const savedResume = response.data.resume || response.data;

      // Keep the ID returned by the backend
      setResumeData(savedResume);

      // Update localStorage without creating a duplicate
      saveToLocalStorage(savedResume);

      // Also update the current draft with the new ID
      localStorage.setItem(
        "resumeDraft",
        JSON.stringify(savedResume)
      );

      setSaveMessage(
        existingResumeId
          ? "✅ Resume updated successfully!"
          : "✅ Resume saved successfully!"
      );
      setSaveMessageType("success");

      setTimeout(() => {
        setSaveMessage("");
        setSaveMessageType("");
        navigate("/dashboard");
      }, 2000);

    } catch (error) {
      console.error("Error saving resume:", error);

      // Offline/local fallback
      const localResume = {
        _id: existingResumeId || Date.now().toString(),
        ...resumeToSave,
        createdAt: resumeData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        savedLocally: true,
      };

      saveToLocalStorage(localResume);

      localStorage.setItem(
        "resumeDraft",
        JSON.stringify(localResume)
      );

      setResumeData(localResume);

      setSaveMessage(
        existingResumeId
          ? "💾 Resume updated locally."
          : "💾 Resume saved locally (offline mode)."
      );

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

  const saveToLocalStorage = (resume) => {
    try {
      const savedResumes = JSON.parse(localStorage.getItem("savedResumes") || "[]");
      const existingIndex = savedResumes.findIndex((r) => r._id === resume._id);

      if (existingIndex !== -1) {
        savedResumes[existingIndex] = resume;
      } else {
        savedResumes.unshift(resume);
      }

      localStorage.setItem("savedResumes", JSON.stringify(savedResumes));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "modern":
        return <ModernTemplate data={resumeData} />;
      case "creative":
        return <CreativeTemplate data={resumeData} />;
      case "professional":
      default:
        return <ProfessionalTemplate data={resumeData} />;
    }
  };

  return (
    <div className="resume-preview-page" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh" }}>
      <div className="preview-actions no-print" style={{ backgroundColor: "#E6F2F0", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="preview-actions-left">
          <button className="btn-back" onClick={() => navigate("/certifications-languages")} style={{ background: "transparent", color: "#165B6D", border: "2px solid #165B6D", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }}>
            ← Back
          </button>
        </div>
        <div className="preview-actions-right" style={{ display: "flex", gap: "12px" }}>
          {/* UPDATED: Save & Exit */}
          <button className="btn-save" onClick={handleSaveResume} disabled={isSaving} style={{ background: "#ffffff", color: "#165B6D", border: "1px solid #165B6D", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease", opacity: isSaving ? "0.7" : "1" }}>
            {isSaving ? "⏳ Saving..." : "💾 Save & Exit"}
          </button>
          
          {/* UPDATED: Download PDF */}
          <button className="btn-primary" onClick={handleDownloadPDF} disabled={isDownloading} style={{ background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 15px rgba(22, 91, 109, 0.3)", transition: "all 0.3s ease", opacity: isDownloading ? "0.7" : "1" }}>
            {isDownloading ? "⏳ Generating..." : "📥 Download PDF"}
          </button>
        </div>
      </div>

      {saveMessage && <div className={`save-message ${saveMessageType}`} style={{ maxWidth: "800px", margin: "20px auto", padding: "12px", borderRadius: "8px", textAlign: "center", fontWeight: "600", backgroundColor: saveMessageType === "success" ? "#d1fae5" : saveMessageType === "info" ? "#dbeafe" : "#fee2e2", color: saveMessageType === "success" ? "#065f46" : saveMessageType === "info" ? "#1e40af" : "#dc2626" }}>{saveMessage}</div>}

      <div className="resume-wrapper" ref={resumeRef}>
        {renderTemplate()}
      </div>
    </div>
  );
}

export default ResumePreview;