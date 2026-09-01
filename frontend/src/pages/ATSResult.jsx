import { useNavigate } from "react-router-dom";

function ATSResult() {
  const navigate = useNavigate();

  const score = 76;

  const suggestions = [
    "Add more job-specific keywords.",
    "Improve the professional summary.",
    "Add measurable achievements to experience.",
    "Use clear section headings.",
    "Include relevant technical skills.",
  ];

  return (
    <div className="ats-result-page">

      <div className="ats-result-card">

        <h1>ATS Analysis Result</h1>

        <p>
          Your resume has been analyzed for
          ATS compatibility.
        </p>

        <div className="score-circle">

          <span>{score}</span>

          <small>/ 100</small>

        </div>

        <h2>
          ATS Score: {score}%
        </h2>

        <p>
          Your resume has a good foundation,
          but there are some areas that can
          be improved.
        </p>

        <div className="suggestions">

          <h2>Optimization Suggestions</h2>

          {suggestions.map(
            (suggestion, index) => (
              <div
                className="suggestion"
                key={index}
              >
                <span>✓</span>

                <p>{suggestion}</p>
              </div>
            )
          )}

        </div>

        <div className="ats-actions">

          <button
            type="button"
            onClick={() =>
              navigate("/resume-preview")
            }
          >
            View Resume
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/basic-details")
            }
          >
            Improve Resume
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}

export default ATSResult;