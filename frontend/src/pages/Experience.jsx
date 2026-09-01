import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Experience() {
  const navigate = useNavigate();

  const [education, setEducation] = useState([
    {
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ]);

  const [experience, setExperience] = useState([
    {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ]);

  const [skills, setSkills] = useState([""]);

  const [projects, setProjects] = useState([
    {
      name: "",
      description: "",
      technologies: "",
      link: "",
    },
  ]);

  const [certifications, setCertifications] = useState([
    {
      name: "",
      organization: "",
      date: "",
    },
  ]);

  const [languages, setLanguages] = useState([
    {
      name: "",
      proficiency: "",
    },
  ]);

  useEffect(() => {
    const savedDraft = JSON.parse(
      localStorage.getItem("resumeDraft") || "{}"
    );

    if (savedDraft.education) {
      setEducation(savedDraft.education);
    }
    if (savedDraft.experience) {
      setExperience(savedDraft.experience);
    }
    if (savedDraft.skills) {
      setSkills(savedDraft.skills);
    }
    if (savedDraft.projects) {
      setProjects(savedDraft.projects);
    }
    if (savedDraft.certifications) {
      setCertifications(savedDraft.certifications);
    }
    if (savedDraft.languages) {
      setLanguages(savedDraft.languages);
    }
  }, []);

  // Education functions
  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  // Experience functions
  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    if (experience.length > 1) {
      setExperience(experience.filter((_, i) => i !== index));
    }
  };

  // Skills functions
  const updateSkill = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  // Projects functions
  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: "",
        description: "",
        technologies: "",
        link: "",
      },
    ]);
  };

  const removeProject = (index) => {
    if (projects.length > 1) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  // Certifications functions
  const updateCertification = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: "",
        organization: "",
        date: "",
      },
    ]);
  };

  const removeCertification = (index) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  // Languages functions
  const updateLanguage = (index, field, value) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
  };

  const addLanguage = () => {
    setLanguages([
      ...languages,
      {
        name: "",
        proficiency: "",
      },
    ]);
  };

  const removeLanguage = (index) => {
    if (languages.length > 1) {
      setLanguages(languages.filter((_, i) => i !== index));
    }
  };

  const handleContinue = () => {
    const existingDraft = JSON.parse(
      localStorage.getItem("resumeDraft") || "{}"
    );

    const updatedDraft = {
      ...existingDraft,
      education,
      experience,
      skills: skills.filter((skill) => skill.trim() !== ""),
      projects,
      certifications,
      languages: languages.filter((lang) => lang.name.trim() !== ""),
    };

    localStorage.setItem(
      "resumeDraft",
      JSON.stringify(updatedDraft)
    );

    navigate("/resume-preview");
  };

  return (
    <div className="builder-page">
      <div className="builder-container">
        <div className="builder-header">
          <h1>Experience & Skills</h1>
          <p>Add your education, work experience, projects, and skills.</p>
        </div>

        <div className="builder-form">
          
          {/* EDUCATION SECTION */}
          <div className="form-section-divider">
            <h2>🎓 Education</h2>
          </div>

          {education.map((item, index) => (
            <div key={index} className="repeatable-card">
              <div className="card-header">
                <span className="card-number">#{index + 1}</span>
                {education.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeEducation(index)}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Institution</label>
                  <input
                    type="text"
                    placeholder="e.g., Stanford University"
                    value={item.institution}
                    onChange={(e) =>
                      updateEducation(index, "institution", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Degree</label>
                  <input
                    type="text"
                    placeholder="e.g., Bachelor of Science"
                    value={item.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Field of Study</label>
                  <input
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={item.field}
                    onChange={(e) =>
                      updateEducation(index, "field", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="e.g., San Francisco, CA"
                    value={item.location || ""}
                    onChange={(e) =>
                      updateEducation(index, "location", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="month"
                    placeholder="Start Date"
                    value={item.startDate}
                    onChange={(e) =>
                      updateEducation(index, "startDate", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="month"
                    placeholder="End Date"
                    value={item.endDate}
                    onChange={(e) =>
                      updateEducation(index, "endDate", e.target.value)
                    }
                    disabled={item.current}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={item.current || false}
                    onChange={(e) =>
                      updateEducation(index, "current", e.target.checked)
                    }
                  />
                  Currently studying here
                </label>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  placeholder="Brief description of your studies, achievements, or activities..."
                  rows="3"
                  value={item.description || ""}
                  onChange={(e) =>
                    updateEducation(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <button className="add-btn" onClick={addEducation}>
            + Add Education
          </button>

          {/* EXPERIENCE SECTION */}
          <div className="form-section-divider">
            <h2>💼 Work Experience</h2>
          </div>

          {experience.map((item, index) => (
            <div key={index} className="repeatable-card">
              <div className="card-header">
                <span className="card-number">#{index + 1}</span>
                {experience.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeExperience(index)}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    placeholder="e.g., Google"
                    value={item.company}
                    onChange={(e) =>
                      updateExperience(index, "company", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    placeholder="e.g., Senior Developer"
                    value={item.position}
                    onChange={(e) =>
                      updateExperience(index, "position", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g., San Francisco, CA (Remote)"
                  value={item.location || ""}
                  onChange={(e) =>
                    updateExperience(index, "location", e.target.value)
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="month"
                    placeholder="Start Date"
                    value={item.startDate}
                    onChange={(e) =>
                      updateExperience(index, "startDate", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="month"
                    placeholder="End Date"
                    value={item.endDate}
                    onChange={(e) =>
                      updateExperience(index, "endDate", e.target.value)
                    }
                    disabled={item.current}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={item.current || false}
                    onChange={(e) =>
                      updateExperience(index, "current", e.target.checked)
                    }
                  />
                  I currently work here
                </label>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe your responsibilities, achievements, and impact..."
                  rows="4"
                  value={item.description}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <button className="add-btn" onClick={addExperience}>
            + Add Experience
          </button>

          {/* SKILLS SECTION */}
          <div className="form-section-divider">
            <h2>🛠️ Skills</h2>
          </div>

          <div className="skills-container">
            {skills.map((skill, index) => (
              <div className="skill-item" key={index}>
                <input
                  type="text"
                  placeholder="Enter a skill"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                />
                {skills.length > 1 && (
                  <button
                    className="remove-skill-btn"
                    onClick={() => removeSkill(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="add-btn" onClick={addSkill}>
            + Add Skill
          </button>

          {/* PROJECTS SECTION */}
          <div className="form-section-divider">
            <h2>📁 Projects</h2>
          </div>

          {projects.map((project, index) => (
            <div key={index} className="repeatable-card">
              <div className="card-header">
                <span className="card-number">#{index + 1}</span>
                {projects.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeProject(index)}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g., E-Commerce Platform"
                    value={project.name}
                    onChange={(e) =>
                      updateProject(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Technologies</label>
                  <input
                    type="text"
                    placeholder="e.g., React, Node.js, MongoDB"
                    value={project.technologies}
                    onChange={(e) =>
                      updateProject(index, "technologies", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe the project, your role, and key achievements..."
                  rows="4"
                  value={project.description}
                  onChange={(e) =>
                    updateProject(index, "description", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Project Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/yourproject"
                  value={project.link || ""}
                  onChange={(e) =>
                    updateProject(index, "link", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <button className="add-btn" onClick={addProject}>
            + Add Project
          </button>

          {/* CERTIFICATIONS SECTION */}
          <div className="form-section-divider">
            <h2>🏆 Certifications</h2>
          </div>

          {certifications.map((cert, index) => (
            <div key={index} className="repeatable-card">
              <div className="card-header">
                <span className="card-number">#{index + 1}</span>
                {certifications.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeCertification(index)}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Certification Name</label>
                  <input
                    type="text"
                    placeholder="e.g., AWS Certified Solutions Architect"
                    value={cert.name}
                    onChange={(e) =>
                      updateCertification(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Organization</label>
                  <input
                    type="text"
                    placeholder="e.g., Amazon Web Services"
                    value={cert.organization}
                    onChange={(e) =>
                      updateCertification(index, "organization", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date Earned</label>
                <input
                  type="month"
                  placeholder="Date"
                  value={cert.date}
                  onChange={(e) =>
                    updateCertification(index, "date", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <button className="add-btn" onClick={addCertification}>
            + Add Certification
          </button>

          {/* LANGUAGES SECTION */}
          <div className="form-section-divider">
            <h2>🌍 Languages</h2>
          </div>

          {languages.map((lang, index) => (
            <div key={index} className="repeatable-card">
              <div className="card-header">
                <span className="card-number">#{index + 1}</span>
                {languages.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeLanguage(index)}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Language</label>
                  <input
                    type="text"
                    placeholder="e.g., English"
                    value={lang.name}
                    onChange={(e) =>
                      updateLanguage(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Proficiency</label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) =>
                      updateLanguage(index, "proficiency", e.target.value)
                    }
                  >
                    <option value="">Select proficiency</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Professional">Professional</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button className="add-btn" onClick={addLanguage}>
            + Add Language
          </button>

          {/* Actions */}
          <div className="builder-actions">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/basic-details")}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn-continue"
              onClick={handleContinue}
            >
              Preview Resume →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experience;