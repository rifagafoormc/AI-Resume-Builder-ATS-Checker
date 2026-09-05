import "./ResumeTemplates.css";

// Turns "Native" / "Fluent" / etc into a 5-dot proficiency meter
const proficiencyToDots = (level) => {
  const map = {
    Native: 5,
    Fluent: 4,
    Professional: 3,
    Intermediate: 2,
    Beginner: 1,
  };
  const filled = map[level] || 3;
  return Array.from({ length: 5 }, (_, i) => i < filled);
};

// ============================================
// PROFESSIONAL TEMPLATE  (matches "Alice Smithson" reference:
// black & white, big bold name, thin rule, two-column w/ vertical divider)
// ============================================
export function ProfessionalTemplate({ data }) {
  const {
    personalInfo,
    jobTitle,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
  } = data || {};

  const hasExperience = experience && experience.length > 0 && experience[0]?.company;
  const hasProjects = projects && projects.length > 0 && projects[0]?.name;
  const hasCerts = certifications && certifications.length > 0 && certifications[0]?.name;
  const hasLanguages = languages && languages.length > 0 && languages[0]?.name;

  return (
    <div className="resume professional-resume">
      <div className="resume-inner">
        <div className="professional-header">
          <h1 className="professional-name">
            {personalInfo?.fullName?.toUpperCase() || "ALICE SMITHSON"}
          </h1>
          {/* FIXED: jobTitle fallback is now empty string "" */}
          <h2 className="professional-title">
            {jobTitle?.trim() ? jobTitle.toUpperCase() : ""}
          </h2>
        </div>

        <div className="professional-body">
          <div className="professional-left">
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

            {education && education.length > 0 && education[0]?.institution && (
              <div className="professional-section">
                <h3 className="professional-section-title">EDUCATION</h3>
                {education.map((edu, index) => (
                  <div key={index} className="professional-education">
                    <p className="professional-edu-degree">
                      {edu.degree || "DEGREE"} {edu.field ? `| ${edu.field}` : ""}
                    </p>
                    <p className="professional-edu-school">{edu.institution}</p>
                    {edu.location && <p className="professional-edu-location">{edu.location}</p>}
                    <p className="professional-edu-year">
                      {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}

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

            {hasCerts && (
              <div className="professional-section">
                <h3 className="professional-section-title">CERTIFICATIONS</h3>
                {certifications.map((cert, index) => (
                  <div key={index} className="professional-cert">
                    <p className="professional-cert-name">{cert.name}</p>
                    <p className="professional-cert-org">{cert.organization} {cert.date ? `• ${cert.date}` : ""}</p>
                  </div>
                ))}
              </div>
            )}

            {hasLanguages && (
              <div className="professional-section">
                <h3 className="professional-section-title">LANGUAGES</h3>
                {languages.map((lang, index) => (
                  <p key={index} className="professional-language">
                    {lang.name} <span>— {lang.proficiency}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="professional-right">
            <div className="professional-section">
              <h3 className="professional-section-title">PROFESSIONAL PROFILE</h3>
              <p className="professional-text">{summary || "No summary added yet."}</p>
            </div>

            {hasExperience && (
              <div className="professional-section">
                <h3 className="professional-section-title">EXPERIENCE</h3>
                {experience.map((exp, index) => (
                  <div key={index} className="professional-experience">
                    <div className="professional-exp-row">
                      <h4 className="professional-exp-title">{exp.position || "Job Title"}</h4>
                      <span className="professional-exp-date">
                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : exp.current ? "- Present" : ""}
                      </span>
                    </div>
                    <p className="professional-exp-company">
                      {exp.company}{exp.location ? ` — ${exp.location}` : ""}
                    </p>
                    {exp.description && <p className="professional-exp-desc">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {hasProjects && (
              <div className="professional-section">
                <h3 className="professional-section-title">PROJECTS</h3>
                {projects.map((project, index) => (
                  <div key={index} className="professional-experience">
                    <h4 className="professional-exp-title">{project.name}</h4>
                    {project.technologies && (
                      <p className="professional-exp-tech">{project.technologies}</p>
                    )}
                    {project.description && <p className="professional-exp-desc">{project.description}</p>}
                    {project.link && <p className="professional-exp-link">🔗 {project.link}</p>}
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
// MODERN TEMPLATE  (matches "Sophia Luna" reference:
// sage-green ribboned sidebar, centered serif name, diamond dividers)
// ============================================
export function ModernTemplate({ data }) {
  const {
    personalInfo,
    jobTitle,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
  } = data || {};

  const hasExperience = experience && experience.length > 0 && experience[0]?.company;
  const hasProjects = projects && projects.length > 0 && projects[0]?.name;
  const hasCerts = certifications && certifications.length > 0 && certifications[0]?.name;
  const hasLanguages = languages && languages.length > 0 && languages[0]?.name;

  return (
    <div className="resume modern-resume">
      <div className="modern-header">
        <h1 className="modern-name">{personalInfo?.fullName?.toUpperCase() || "SOPHIA LUNA"}</h1>
        {/* FIXED: jobTitle fallback is now empty string "" */}
        <h2 className="modern-title">{jobTitle?.trim() ? jobTitle.toUpperCase() : ""}</h2>
      </div>

      <div className="modern-body">
        <div className="modern-left">
          <div className="modern-ribbon-cap" />
          <div className="modern-section">
            <h3 className="modern-section-title">◇ CONTACT</h3>
            <div className="modern-contact">
              {personalInfo?.phone && <p>📞 {personalInfo.phone}</p>}
              {personalInfo?.email && <p>✉️ {personalInfo.email}</p>}
              {personalInfo?.location && <p>🏠 {personalInfo.location}</p>}
              {personalInfo?.linkedin && <p>🔗 {personalInfo.linkedin}</p>}
            </div>
          </div>

          {education && education.length > 0 && education[0]?.institution && (
            <div className="modern-section">
              <h3 className="modern-section-title">◇ EDUCATION</h3>
              {education.map((edu, index) => (
                <div key={index} className="modern-education">
                  <p className="modern-edu-year">{edu.startDate} - {edu.endDate || "Present"}</p>
                  <p className="modern-edu-degree">{edu.degree || "Degree"}</p>
                  <p className="modern-edu-school">{edu.institution}</p>
                </div>
              ))}
            </div>
          )}

          {skills && skills.length > 0 && skills[0] && (
            <div className="modern-section">
              <h3 className="modern-section-title">◇ KEY SKILLS</h3>
              <ul className="modern-skills">
                {skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {hasLanguages && (
            <div className="modern-section">
              <h3 className="modern-section-title">◇ LANGUAGES</h3>
              {languages.map((lang, index) => (
                <p key={index} className="modern-language">{lang.name} — {lang.proficiency}</p>
              ))}
            </div>
          )}
          <div className="modern-ribbon-cap modern-ribbon-cap-bottom" />
        </div>

        <div className="modern-right">
          <div className="modern-section">
            <h3 className="modern-section-title">◇ PROFESSIONAL SUMMARY</h3>
            <p className="modern-text">{summary || "No summary added yet."}</p>
          </div>

          {hasExperience && (
            <div className="modern-section">
              <h3 className="modern-section-title">◇ EXPERIENCE</h3>
              {experience.map((exp, index) => (
                <div key={index} className="modern-experience">
                  <p className="modern-exp-year">
                    {exp.startDate} - {exp.endDate || (exp.current ? "Present" : "")}
                  </p>
                  <h4 className="modern-exp-title">{exp.position || "Job Title"}</h4>
                  <p className="modern-exp-company">
                    {exp.company} {exp.location ? `| ${exp.location}` : ""}
                  </p>
                  {exp.description && <p className="modern-exp-desc">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {hasProjects && (
            <div className="modern-section">
              <h3 className="modern-section-title">◇ PROJECTS</h3>
              {projects.map((project, index) => (
                <div key={index} className="modern-experience">
                  <h4 className="modern-exp-title">{project.name}</h4>
                  {project.technologies && <p className="modern-exp-company">{project.technologies}</p>}
                  {project.description && <p className="modern-exp-desc">{project.description}</p>}
                </div>
              ))}
            </div>
          )}

          {hasCerts && (
            <div className="modern-section">
              <h3 className="modern-section-title">◇ CERTIFICATIONS</h3>
              {certifications.map((cert, index) => (
                <p key={index} className="modern-cert">
                  {cert.name} — {cert.organization} ({cert.date})
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// CREATIVE TEMPLATE  (matches "Amanda Todd" reference:
// dark teal header banner, icon-led sidebar cards)
// ============================================
export function CreativeTemplate({ data }) {
  const {
    personalInfo,
    jobTitle,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    strengths,
    passions,
  } = data || {};

  const hasExperience = experience && experience.length > 0 && experience[0]?.company;
  const hasProjects = projects && projects.length > 0 && projects[0]?.name;
  const hasCerts = certifications && certifications.length > 0 && certifications[0]?.name;
  const hasLanguages = languages && languages.length > 0 && languages[0]?.name;
  const hasEducation = education && education.length > 0 && education[0]?.institution;
  const hasStrengths = strengths && strengths.length > 0 && strengths[0]?.title;
  const hasPassions = passions && passions.length > 0 && passions[0]?.title;

  return (
    <div className="resume creative-resume">
      <div className="creative-header">
        <div>
          <h1 className="creative-name">{personalInfo?.fullName?.toUpperCase() || "AMANDA TODD"}</h1>
          {/* FIXED: jobTitle fallback is now empty string "" */}
          <h2 className="creative-title">{jobTitle?.trim() || ""}</h2>
        </div>
      </div>
      <div className="creative-contact-bar">
        {personalInfo?.phone && <span>📞 {personalInfo.phone}</span>}
        {personalInfo?.email && <span>✉️ {personalInfo.email}</span>}
        {personalInfo?.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
      </div>

      <div className="creative-body">
        <div className="creative-left">
          <div className="creative-section">
            <h3 className="creative-section-title">SUMMARY</h3>
            <p className="creative-text">{summary || "No summary added yet."}</p>
          </div>

          {hasExperience && (
            <div className="creative-section">
              <h3 className="creative-section-title">EXPERIENCE</h3>
              {experience.map((exp, index) => (
                <div key={index} className="creative-experience">
                  <h4 className="creative-exp-title">{exp.position || "Position"}</h4>
                  <p className="creative-exp-company">{exp.company}</p>
                  <p className="creative-exp-date">
                    {exp.startDate} - {exp.endDate || (exp.current ? "Present" : "")}
                    {exp.location ? `  •  ${exp.location}` : ""}
                  </p>
                  {exp.description && <p className="creative-exp-desc">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {hasProjects && (
            <div className="creative-section">
              <h3 className="creative-section-title">PROJECTS</h3>
              {projects.map((project, index) => (
                <div key={index} className="creative-experience">
                  <h4 className="creative-exp-title">{project.name}</h4>
                  {project.technologies && <p className="creative-exp-company">{project.technologies}</p>}
                  {project.description && <p className="creative-exp-desc">{project.description}</p>}
                </div>
              ))}
            </div>
          )}

          {hasEducation && (
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
        </div>

        <div className="creative-right">
          {skills && skills.length > 0 && skills[0] && (
            <div className="creative-section">
              <h3 className="creative-section-title">SKILLS</h3>
              <div className="creative-skills">
                {skills.map((skill, index) => (
                  <span key={index} className="creative-skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {hasCerts && (
            <div className="creative-section">
              <h3 className="creative-section-title">ACHIEVEMENTS</h3>
              {certifications.map((cert, index) => (
                <div key={index} className="creative-achievement">
                  <span className="creative-achievement-icon">🏆</span>
                  <div>
                    <p className="creative-achievement-title">{cert.name}</p>
                    <p className="creative-achievement-desc">{cert.organization} {cert.date ? `• ${cert.date}` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasStrengths && (
            <div className="creative-section">
              <h3 className="creative-section-title">STRENGTHS</h3>
              {strengths.map((s, index) => (
                <div key={index} className="creative-achievement">
                  <span className="creative-achievement-icon">{s.icon || "⭐"}</span>
                  <div>
                    <p className="creative-achievement-title">{s.title}</p>
                    {s.description && <p className="creative-achievement-desc">{s.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasPassions && (
            <div className="creative-section">
              <h3 className="creative-section-title">PASSIONS</h3>
              {passions.map((p, index) => (
                <div key={index} className="creative-passion">
                  <span className="creative-passion-icon">{p.icon || "❤️"}</span>
                  <span className="creative-passion-title">{p.title}</span>
                </div>
              ))}
            </div>
          )}

          {hasLanguages && (
            <div className="creative-section">
              <h3 className="creative-section-title">LANGUAGES</h3>
              {languages.map((lang, index) => (
                <div key={index} className="creative-language-row">
                  <div>
                    <p className="creative-language-name">{lang.name}</p>
                    <p className="creative-language-level">{lang.proficiency}</p>
                  </div>
                  <div className="creative-language-dots">
                    {proficiencyToDots(lang.proficiency).map((filled, i) => (
                      <span key={i} className={`creative-dot ${filled ? "filled" : ""}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}