import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">ResumeAI</div>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <p className="badge">AI-POWERED RESUME BUILDER</p>

          <h1>
            Build a Resume That
            <span> Gets Noticed.</span>
          </h1>

          <p className="hero-text">
            Create professional, ATS-friendly resumes with the power of AI.
            Build, analyze and improve your resume in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Create My Resume
            </Link>

            <Link to="/login" className="secondary-button">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;