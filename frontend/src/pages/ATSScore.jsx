import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ATSScore() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const savedDraft = JSON.parse(
      localStorage.getItem("resumeDraft") || "null"
    );

    if (!savedDraft) {
      navigate("/templates");
      return;
    }

    setResume(savedDraft);
  }, [navigate]);

  const checkATS = async () => {
    /*
      We will connect this to your existing ATS API
      after checking its exact endpoint.
    */

    setChecking(true);

    setTimeout(() => {
      setChecking(false);

      navigate("/ats-result");
    }, 1000);
  };

  if (!resume) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ats-page">

      <div className="ats-card">

        <h1>ATS Resume Checker</h1>

        <p>
          Check how well your resume is optimized
          for Applicant Tracking Systems.
        </p>

        <div className="ats-info">

          <div>
            <strong>Resume</strong>

            <p>
              {resume.title ||
                "Untitled Resume"}
            </p>
          </div>

          <div>
            <strong>Template</strong>

            <p>
              {resume.template ||
                "Professional"}
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={checkATS}
          disabled={checking}
        >
          {checking
            ? "Analyzing Resume..."
            : "Check ATS Score"}
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/resume-preview")
          }
        >
          Back to Resume
        </button>

      </div>

    </div>
  );
}

export default ATSScore;