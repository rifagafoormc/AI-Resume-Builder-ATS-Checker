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
  const [passwordError, setPasswordError] = useState("");

  // Password validation function (matches backend)
  const validatePassword = (password) => {
    if (!password || password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null; // valid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time password validation
    if (name === "newPassword") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation before submitting
    const error = validatePassword(formData.newPassword);
    if (error) {
      setPasswordError(error);
      setMessage(error);
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
              border: `2px solid ${passwordError ? "#dc2626" : "#e5e7eb"}`,
              borderRadius: "12px",
              fontSize: "14px",
              background: "#fafbfc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          {/* Password requirements hint */}
          <div style={{ 
            marginTop: "8px", 
            fontSize: "13px", 
            color: passwordError ? "#dc2626" : "#6b7280",
            transition: "color 0.3s ease"
          }}>
            <div>Password must contain:</div>
            <ul style={{ 
              margin: "4px 0 0 0", 
              paddingLeft: "20px",
              listStyleType: "disc"
            }}>
              <li style={{ 
                color: formData.newPassword.length >= 6 ? "#199E72" : (formData.newPassword ? "#dc2626" : "#6b7280")
              }}>
                At least 6 characters {formData.newPassword && (formData.newPassword.length >= 6 ? "✅" : "❌")}
              </li>
              <li style={{ 
                color: /\d/.test(formData.newPassword) ? "#199E72" : (formData.newPassword ? "#dc2626" : "#6b7280")
              }}>
                At least one number {formData.newPassword && (/\d/.test(formData.newPassword) ? "✅" : "❌")}
              </li>
              <li style={{ 
                color: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]/.test(formData.newPassword) ? "#199E72" : (formData.newPassword ? "#dc2626" : "#6b7280")
              }}>
                At least one special character {formData.newPassword && (/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]/.test(formData.newPassword) ? "✅" : "❌")}
              </li>
            </ul>
            {passwordError && (
              <div style={{ color: "#dc2626", marginTop: "4px", fontWeight: "500" }}>
                ⚠️ {passwordError}
              </div>
            )}
          </div>

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
              marginTop: "12px"
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