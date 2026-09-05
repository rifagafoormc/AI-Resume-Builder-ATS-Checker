import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      const response = await API.put("/auth/forgot-password", {
        email: formData.email,
        newPassword: formData.newPassword,
      });

      setMessage(response.data.message || "Password reset successfully!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
      setMessageType("error");
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        background:
          "linear-gradient(135deg, #165B6D 0%, #199E72 100%)",
      }}
    >
      <div className="auth-card">
        <h1>Forgot Password?</h1>

        <p>
          Enter your email address and choose a new password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "13px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "14px",
              background: "#fafbfc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            style={{
              padding: "13px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "14px",
              background: "#fafbfc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              padding: "13px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "14px",
              background: "#fafbfc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #165B6D 0%, #199E72 100%)",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              marginTop: "10px",
              width: "100%",
            }}
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: messageType === "success" ? "#199E72" : "#dc2626",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            marginTop: "20px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Remember your password?{" "}
          <Link
            to="/login"
            style={{
              color: "#199E72",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

