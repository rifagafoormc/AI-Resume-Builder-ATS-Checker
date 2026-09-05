import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", formData);

      const token = response.data.token;
      const user = response.data.user;

      // Save login information
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const loggedInUser = response.data.user;

      setMessage("Login successful!");

      setTimeout(() => {
        if (loggedInUser.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 500);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
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
        <h1>Welcome Back</h1>

        <p>Login to continue building your resume.</p>

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

          {/* Forgot Password Link */}
          <div style={{ textAlign: "right", marginTop: "-5px", marginBottom: "5px" }}>
            <Link
              to="/forgot-password"
              style={{
                color: "#199E72",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
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
              marginTop: "10px"
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
            Login
          </button>
        </form>

        {message && <p style={{ textAlign: "center", marginTop: "15px", color: "#6b7280" }}>{message}</p>}

        <p style={{ marginTop: "16px", color: "#6b7280", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#199E72", fontWeight: "600", textDecoration: "none" }}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;