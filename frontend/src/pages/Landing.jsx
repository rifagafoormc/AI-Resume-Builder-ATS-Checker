import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">
      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="logo">🚀 ResumeAI</div>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            AI-POWERED RESUME BUILDER
          </div>

          <h1 className="hero-title">
            Build a Resume That
            <span className="highlight"> Gets Noticed.</span>
          </h1>

          <p className="hero-text">
            Create professional, ATS-friendly resumes with the power of AI.
            Build, analyze and improve your resume in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Create My Resume →
            </Link>

            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Resumes Created</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">ATS Score Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.9</span>
              <span className="stat-label">User Rating</span>
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
            <div className="trustpilot-text">
              <strong>Trustpilot</strong> · 4.9/5 · 2,000+ reviews
            </div>
          </div>
        </div>
      </main>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose ResumeAI?</h2>
            <p className="section-subtitle">
              Everything you need to create a professional resume that stands out
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Suggestions</h3>
              <p>
                Get intelligent recommendations to improve your resume content,
                bullet points, and overall impact.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>ATS Score Checker</h3>
              <p>
                Instantly analyze your resume against ATS filters and get a
                detailed score with improvement tips.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Professional Templates</h3>
              <p>
                Choose from 15+ professionally designed templates that are
                optimized for ATS screening.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Real-Time Editing</h3>
              <p>
                See your resume update in real-time as you type. No more
                guessing how it will look.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Multiple Export Formats</h3>
              <p>
                Export your resume as PDF, Word, or TXT. Perfect for any
                application requirement.
              </p>
            </div>

            <div className="feature-card">
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
              <div className="step-number">1</div>
              <div className="step-icon">📋</div>
              <h3>Fill in Your Details</h3>
              <p>
                Enter your personal information, work experience, education,
                and skills.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🎨</div>
              <h3>Choose a Template</h3>
              <p>
                Pick from our collection of ATS-friendly professional templates.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">📄</div>
              <h3>Download & Apply</h3>
              <p>
                Get your polished resume and start applying to your dream jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEMPLATES PREVIEW SECTION ===== */}
      <section className="templates-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Professional Templates</h2>
            <p className="section-subtitle">
              Choose from our curated collection of modern resume templates
            </p>
            <Link to="/login" className="btn-primary">
              View All Templates →
            </Link>
          </div>

          <div className="template-grid">
            <div className="template-card">
              <div className="template-preview">
                <div className="template-placeholder">
                  <div className="template-profile">
                    <div className="profile-avatar"></div>
                    <div className="profile-name">Sarah Johnson</div>
                    <div className="profile-title">Senior Product Manager</div>
                    <div className="profile-text">
                      5+ years of experience in product management...
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-info">
                <h3>Modern Professional</h3>
                <p>Clean and minimalist design</p>
              </div>
            </div>

            <div className="template-card">
              <div className="template-preview">
                <div className="template-placeholder">
                  <div className="template-profile">
                    <div className="profile-avatar" style={{ background: '#f59e0b' }}></div>
                    <div className="profile-name">Michael Chen</div>
                    <div className="profile-title">Software Engineer</div>
                    <div className="profile-text">
                      Full-stack developer with 8 years of experience...
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-info">
                <h3>Creative Portfolio</h3>
                <p>Bold and eye-catching design</p>
              </div>
            </div>

            <div className="template-card">
              <div className="template-preview">
                <div className="template-placeholder">
                  <div className="template-profile">
                    <div className="profile-avatar" style={{ background: '#10b981' }}></div>
                    <div className="profile-name">Emily Rodriguez</div>
                    <div className="profile-title">Marketing Director</div>
                    <div className="profile-text">
                      Award-winning marketing professional...
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-info">
                {/* ✅ FIXED: Changed from </h4> to </h3> */}
                <h3>Executive Classic</h3>
                <p>Sophisticated and elegant design</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Build Your Dream Resume?</h2>
            <p>
              Join 10,000+ job seekers who landed their dream jobs with ResumeAI
            </p>
            <Link to="/register" className="btn-primary">
              Start Building for Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">🚀 ResumeAI</div>
              <p>Build better resumes with AI</p>
            </div>

            <div className="footer-links">
              <h4>Product</h4>
              <Link to="/templates">Templates</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/pricing">Pricing</Link>
            </div>

            <div className="footer-links">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
            </div>

            <div className="footer-links">
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>

            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">📸</a>
                <a href="#" className="social-link">💼</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;