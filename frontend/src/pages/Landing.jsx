import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page" style={{ backgroundColor: "#F4F9F8" }}>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar" style={{ background: "#ffffff", color: "#165B6D" }}>
        <div className="logo" style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          color: "#199E72",
          background: "none",          
          backgroundImage: "none",     
          WebkitTextFillColor: "#199E72" 
        }}>
          {/* Light Green Rocket SVG Icon */}
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
        </div>

        <div className="nav-links">
          <Link to="/login" style={{ color: "#165B6D", textDecoration: "none" }}>Login</Link>
          <Link to="/register" className="nav-button" style={{
            background: "#199E72",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "6px",
            textDecoration: "none"
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <main className="hero-section" style={{ background: "linear-gradient(135deg, #E6F2F0 0%, #D5F5E3 100%)", color: "#165B6D" }}>
        <div className="hero-content">
          <div className="hero-badge" style={{
            background: "rgba(25, 158, 114, 0.1)",
            color: "#165B6D",
            border: "1px solid rgba(25, 158, 114, 0.2)"
          }}>
            <span className="badge-icon">✨</span>
            AI-POWERED RESUME BUILDER
          </div>

          <h1 className="hero-title" style={{ color: "#165B6D" }}>
            Build a Resume That
            <span className="highlight" style={{ color: "#199E72" }}> Gets Noticed.</span>
          </h1>

          <p className="hero-text" style={{ color: "#4A5568" }}>
            Create professional, ATS-friendly resumes with the power of AI.
            Build, analyze and improve your resume in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary" style={{
              background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none"
            }}>
              Create My Resume →
            </Link>

            <Link to="/login" className="btn-secondary" style={{
              color: "#165B6D",
              border: "2px solid #165B6D",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none"
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose scoreCraft?</h2>
            <p className="section-subtitle">
              Everything you need to create a professional resume that stands out
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card" style={{ borderTop: "3px solid #199E72" }}>
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Suggestions</h3>
              <p>
                Get intelligent recommendations to improve your resume content,
                bullet points, and overall impact.
              </p>
            </div>

            <div className="feature-card" style={{ borderTop: "3px solid #165B6D" }}>
              <div className="feature-icon">📊</div>
              <h3>ATS Score Checker</h3>
              <p>
                Instantly analyze your resume against ATS filters and get a
                detailed score with improvement tips.
              </p>
            </div>

            <div className="feature-card" style={{ borderTop: "3px solid #199E72" }}>
              <div className="feature-icon">🎨</div>
              <h3>Professional Templates</h3>
              <p>
                Choose from 15+ professionally designed templates that are
                optimized for ATS screening.
              </p>
            </div>

            <div className="feature-card" style={{ borderTop: "3px solid #165B6D" }}>
              <div className="feature-icon">📝</div>
              <h3>Real-Time Editing</h3>
              <p>
                See your resume update in real-time as you type. No more
                guessing how it will look.
              </p>
            </div>

            <div className="feature-card" style={{ borderTop: "3px solid #199E72" }}>
              <div className="feature-icon">📄</div>
              <h3>Multiple Export Formats</h3>
              <p>
                Export your resume as PDF, Word, or TXT. Perfect for any
                application requirement.
              </p>
            </div>

            <div className="feature-card" style={{ borderTop: "3px solid #165B6D" }}>
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>
                Your data is encrypted and private. We never share your
                information with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Create a standout resume in just 3 simple steps
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number" style={{ background: "#165B6D", color: "#fff" }}>1</div>
              <div className="step-icon">📋</div>
              <h3>Fill in Your Details</h3>
              <p>
                Enter your personal information, work experience, education,
                and skills.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number" style={{ background: "#199E72", color: "#fff" }}>2</div>
              <div className="step-icon">🎨</div>
              <h3>Choose a Template</h3>
              <p>
                Pick from our collection of ATS-friendly professional templates.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number" style={{ background: "#165B6D", color: "#fff" }}>3</div>
              <div className="step-icon">📄</div>
              <h3>Download & Apply</h3>
              <p>
                Get your polished resume and start applying to your dream jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REAL TEMPLATES SECTION (Empty for now) ===== */}
      <section className="templates-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Professional Templates</h2>
            <p className="section-subtitle">
              Choose from our curated collection of modern resume templates
            </p>
            <Link to="/login" className="btn-primary" style={{
              background: "#165B6D",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              textDecoration: "none"
            }}>
              View All Templates →
            </Link>
          </div>

          {/* 
            ============================================
            👇 INSERT YOUR REAL TEMPLATES HERE 👇
            ============================================
            The section is currently completely empty.
            You can add your actual template cards here in the future.
          */}
          
          <div className="template-grid" style={{ display: "grid", gap: "20px", justifyContent: "center" }}>
            {/* Placeholder removed. Just add your <div className="template-card"> here */}
          </div>

        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section" style={{
        background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)",
        color: "#fff",
        padding: "60px 0"
      }}>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Build Your Dream Resume?</h2>
            <p>
              Join 10,000+ job seekers who landed their dream jobs with scoreCraft
            </p>
            <Link to="/register" className="btn-primary" style={{
              background: "#fff",
              color: "#165B6D",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold"
            }}>
              Start Building for Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SIMPLE COPYRIGHT FOOTER ===== */}
      <footer className="footer" style={{ background: "#165B6D", color: "#fff", padding: "20px 0", textAlign: "center" }}>
        <p style={{ color: "#A8DADC", margin: 0 }}>&copy; 2026 scoreCraft. All rights reserved.</p>
      </footer>
    
    </div>
  );
}

export default Landing;