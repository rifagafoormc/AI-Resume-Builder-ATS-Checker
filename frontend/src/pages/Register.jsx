import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

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
    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation before submitting
    const error = validatePassword(formData.password);
    if (error) {
      setPasswordError(error);
      return;
    }

    try {
      const response = await API.post("/auth/signup", formData);
      setMessage("Registration successful!");
      setPasswordError("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div 
      className="auth-page" 
      style={{ 
        background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)" 
      }}
    >
      <div className="auth-card">
        <h1>Create Account</h1>

        <p>Start building your professional resume.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: "13px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "14px",
              transition: "all 0.3s ease",
              background: "#fafbfc",
              width: "100%",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#165B6D";
              e.target.style.boxShadow = "0 0 0 4px rgba(22, 91, 109, 0.1)";
              e.target.style.background = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
              e.target.style.background = "#fafbfc";
            }}
          />

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
              transition: "all 0.3s ease",
              background: "#fafbfc",
              width: "100%",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#165B6D";
              e.target.style.boxShadow = "0 0 0 4px rgba(22, 91, 109, 0.1)";
              e.target.style.background = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
              e.target.style.background = "#fafbfc";
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              padding: "13px 16px",
              border: `2px solid ${passwordError ? "#dc2626" : "#e5e7eb"}`,
              borderRadius: "12px",
              fontSize: "14px",
              transition: "all 0.3s ease",
              background: "#fafbfc",
              width: "100%",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = passwordError ? "#dc2626" : "#165B6D";
              e.target.style.boxShadow = passwordError 
                ? "0 0 0 4px rgba(220, 38, 38, 0.1)" 
                : "0 0 0 4px rgba(22, 91, 109, 0.1)";
              e.target.style.background = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = passwordError ? "#dc2626" : "#e5e7eb";
              e.target.style.boxShadow = "none";
              e.target.style.background = "#fafbfc";
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
                color: formData.password.length >= 6 ? "#199E72" : (formData.password ? "#dc2626" : "#6b7280")
              }}>
                At least 6 characters {formData.password && (formData.password.length >= 6 ? "✅" : "❌")}
              </li>
              <li style={{ 
                color: /\d/.test(formData.password) ? "#199E72" : (formData.password ? "#dc2626" : "#6b7280")
              }}>
                At least one number {formData.password && (/\d/.test(formData.password) ? "✅" : "❌")}
              </li>
              <li style={{ 
                color: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]/.test(formData.password) ? "#199E72" : (formData.password ? "#dc2626" : "#6b7280")
              }}>
                At least one special character {formData.password && (/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]/.test(formData.password) ? "✅" : "❌")}
              </li>
            </ul>
            {passwordError && (
              <div style={{ color: "#dc2626", marginTop: "4px", fontWeight: "500" }}>
                ⚠️ {passwordError}
              </div>
            )}
          </div>

          <button 
            type="submit"
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #165B6D 0%, #199E72 100%)",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(22, 91, 109, 0.3)",
              marginTop: "10px",
              width: "100%"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(22, 91, 109, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(22, 91, 109, 0.3)";
            }}
          >
            Create Account
          </button>
        </form>

        {message && <p style={{ textAlign: "center", marginTop: "15px", color: "#6b7280" }}>{message}</p>}

        <p style={{ marginTop: "16px", color: "#6b7280", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#199E72", fontWeight: "600", textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;