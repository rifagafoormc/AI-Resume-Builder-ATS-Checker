import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [resumes, setResumes] = useState([]);
  const [atsCount, setAtsCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [name, setName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);

    try {
      // Load actual user profile from database
      const profileResponse = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileUser = profileResponse.data.user;

      setUser(profileUser);
      setName(profileUser.name || "");

      localStorage.setItem(
        "user",
        JSON.stringify(profileUser)
      );

      // Load resumes
      try {
        const resumeResponse = await API.get("/resumes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const resumeData =
          resumeResponse.data.resumes || resumeResponse.data;

        if (Array.isArray(resumeData)) {
          setResumes(resumeData);
        }
      } catch (error) {
        console.error("Could not load resumes:", error);
      }

      // Load ATS history
      try {
        const atsResponse = await API.get("/ats/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const atsData =
          atsResponse.data.analyses ||
          atsResponse.data.history ||
          atsResponse.data;

        if (Array.isArray(atsData)) {
          setAtsCount(atsData.length);
        }
      } catch (error) {
        console.log("ATS history could not be loaded.");
      }
    } catch (error) {
      console.error("Error loading profile:", error);

      // If token is invalid/expired
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      setMessageType("error");
      return;
    }

    try {
      const response = await API.put(
        "/auth/profile",
        {
          name: name.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      // Update state
      setUser(updatedUser);

      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setEditing(false);
      setMessage("Profile updated successfully!");
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to update profile."
      );

      setMessageType("error");
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    // Real-time password validation
    const error = validatePassword(value);
    setPasswordError(error);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all password fields.");
      setMessageType("error");
      return;
    }

    // Client-side validation
    const error = validatePassword(newPassword);
    if (error) {
      setPasswordError(error);
      setMessage(error);
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      await API.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");

      setChangingPassword(false);

      setMessage("Password changed successfully!");
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error changing password:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to change password."
      );

      setMessageType("error");
    }
  };

  // =========================
  // LOGOUT (Redirect to Landing Page)
  // =========================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  if (loading) {
    return (
      <div
        className="profile-page"
        style={{
          minHeight: "100vh",
          background: "#E6F2F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#165B6D",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Loading profile...
      </div>
    );
  }

  return (
    <div
      className="profile-page"
      style={{
        minHeight: "100vh",
        background: "#E6F2F0",
      }}
    >
      {/* NAVBAR */}

      <nav
        className="dashboard-navbar"
        style={{
          background: "#ffffff",
        }}
      >
        <div className="dashboard-nav-left">
          <Link
            to="/dashboard"
            className="logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#199E72",
              background: "none",
              backgroundImage: "none",
              WebkitTextFillColor: "#199E72",
              textDecoration: "none",
            }}
          >
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
          </Link>
        </div>

        <div className="dashboard-nav-center">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>

          <Link to="/templates" className="nav-link">
            Templates
          </Link>

          <Link to="/ats-score" className="nav-link">
            ATS Score
          </Link>

          <Link to="/my-resumes" className="nav-link">
            My Resumes
          </Link>

          <Link to="/ats-history" className="nav-link">
            ATS History
          </Link>
        </div>

        <div className="dashboard-nav-right">
          <div
            className="user-avatar"
            title={user.name}
            style={{
              background: "#165B6D",
            }}
          >
            {getInitials(user.name)}
          </div>
          <div className="user-dropdown">
            {/* Only the arrow remains */}
            <button 
              className="dropdown-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer" }}
            >
              <span className="dropdown-arrow">▼</span>
            </button>
            {showDropdown && (
              <div className="dropdown-menu show">
                <Link to="/profile" className="dropdown-item">
                  <span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span> Profile
                </Link>
                <hr className="dropdown-divider" />
                <button onClick={logout} className="dropdown-item logout">
                  <span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                  </span> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "50px 20px 80px",
        }}
      >
        {/* TITLE */}

        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              color: "#165B6D",
              fontSize: "36px",
              fontWeight: "800",
              margin: "0 0 8px",
            }}
          >
            My Profile
          </h1>

          <p
            style={{
              color: "#64748B",
              margin: 0,
              fontSize: "16px",
            }}
          >
            Manage your account and view your resume activity.
          </p>
        </div>

        {/* PROFILE CARD */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "35px",
            boxShadow:
              "0 6px 25px rgba(22, 91, 109, 0.08)",
            border: "1px solid #D8EAE5",
            marginBottom: "25px",
          }}
        >
          {/* PROFILE HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "25px",
              marginBottom: "35px",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                minWidth: "90px",
                borderRadius: "50%",
                background: "#165B6D",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                fontWeight: "800",
              }}
            >
              {getInitials(user.name)}
            </div>

            <div style={{ flex: 1 }}>
              <h2
                style={{
                  margin: "0 0 6px",
                  color: "#165B6D",
                  fontSize: "26px",
                }}
              >
                {user.name || "User"}
              </h2>

              <p
                style={{
                  margin: "0 0 8px",
                  color: "#64748B",
                }}
              >
                {user.email || "No email available"}
              </p>

              <span
                style={{
                  display: "inline-block",
                  background: "#D5F5E3",
                  color: "#199E72",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "capitalize",
                }}
              >
                {user.role || "user"}
              </span>
            </div>

            {!editing && (
              <button
                onClick={() => {
                  setEditing(true);
                  setChangingPassword(false);
                }}
                style={{
                  background: "#199E72",
                  color: "#ffffff",
                  border: "none",
                  padding: "11px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {/* PERSONAL INFORMATION */}

          <div
            style={{
              borderTop: "1px solid #E2E8F0",
              paddingTop: "30px",
            }}
          >
            <h3
              style={{
                color: "#165B6D",
                marginBottom: "22px",
                fontSize: "20px",
              }}
            >
              Personal Information
            </h3>

            {editing ? (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "12px 14px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      background: "#199E72",
                      color: "#ffffff",
                      border: "none",
                      padding: "11px 22px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "700",
                    }}
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(user.name || "");
                    }}
                    style={{
                      background: "#ffffff",
                      color: "#374151",
                      border: "1px solid #CBD5E1",
                      padding: "11px 22px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: "13px",
                      margin: "0 0 5px",
                    }}
                  >
                    Full Name
                  </p>

                  <strong style={{ color: "#334155" }}>
                    {user.name || "Not available"}
                  </strong>
                </div>

                <div>
                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: "13px",
                      margin: "0 0 5px",
                    }}
                  >
                    Email Address
                  </p>

                  <strong style={{ color: "#334155" }}>
                    {user.email || "Not available"}
                  </strong>
                </div>

                <div>
                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: "13px",
                      margin: "0 0 5px",
                    }}
                  >
                    Account Type
                  </p>

                  <strong
                    style={{
                      color: "#334155",
                      textTransform: "capitalize",
                    }}
                  >
                    {user.role || "User"}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STATISTICS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              background: "#165B6D",
              borderRadius: "16px",
              padding: "25px",
              color: "#ffffff",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginBottom: "5px",
              }}
            >
              {resumes.length}
            </div>

            <div
              style={{
                color: "#E6F2F0",
                fontSize: "14px",
              }}
            >
              Resumes Created
            </div>
          </div>

          <div
            style={{
              background: "#199E72",
              borderRadius: "16px",
              padding: "25px",
              color: "#ffffff",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginBottom: "5px",
              }}
            >
              {atsCount}
            </div>

            <div
              style={{
                color: "#EAFBF4",
                fontSize: "14px",
              }}
            >
              ATS Analyses
            </div>
          </div>
        </div>

        {/* ACCOUNT SETTINGS */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "30px",
            border: "1px solid #D8EAE5",
            boxShadow:
              "0 6px 25px rgba(22, 91, 109, 0.08)",
          }}
        >
          <h3
            style={{
              color: "#165B6D",
              margin: "0 0 20px",
              fontSize: "20px",
            }}
          >
            Account Settings
          </h3>

          {/* CHANGE PASSWORD FORM */}

          {changingPassword && (
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #D8EAE5",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 18px",
                  color: "#165B6D",
                  fontSize: "17px",
                }}
              >
                Change Password
              </h4>

              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  marginBottom: "12px",
                  border: "1px solid #CBD5E1",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  marginBottom: "12px",
                  border: `1px solid ${passwordError ? "#dc2626" : "#CBD5E1"}`,
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />

              {/* Password requirements hint */}
              <div style={{ 
                marginTop: "-8px",
                marginBottom: "12px",
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
                    color: newPassword.length >= 6 ? "#199E72" : (newPassword ? "#dc2626" : "#6b7280")
                  }}>
                    At least 6 characters {newPassword && (newPassword.length >= 6 ? "✅" : "❌")}
                  </li>
                  <li style={{ 
                    color: /\d/.test(newPassword) ? "#199E72" : (newPassword ? "#dc2626" : "#6b7280")
                  }}>
                    At least one number {newPassword && (/\d/.test(newPassword) ? "✅" : "❌")}
                  </li>
                  <li style={{ 
                    color: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]/.test(newPassword) ? "#199E72" : (newPassword ? "#dc2626" : "#6b7280")
                  }}>
                    At least one special character {newPassword && (/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]/.test(newPassword) ? "✅" : "❌")}
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
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  marginBottom: "15px",
                  border: "1px solid #CBD5E1",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={handleChangePassword}
                  style={{
                    background: "#199E72",
                    color: "#ffffff",
                    border: "none",
                    padding: "11px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "700",
                  }}
                >
                  Update Password
                </button>

                <button
                  onClick={() => {
                    setChangingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  style={{
                    background: "#ffffff",
                    color: "#374151",
                    border: "1px solid #CBD5E1",
                    padding: "11px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {!changingPassword && (
              <button
                onClick={() => {
                  setChangingPassword(true);
                  setEditing(false);
                }}
                style={{
                  background: "#E6F2F0",
                  color: "#165B6D",
                  border: "1px solid #B9D9D1",
                  padding: "11px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                🔐 Change Password
              </button>
            )}

            <button
              onClick={logout}
              style={{
                background: "#FEE2E2",
                color: "#DC2626",
                border: "none",
                padding: "11px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </main>

      {/* ================= CENTERED MESSAGE MODAL (BLURRED) ================= */}
      {message && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setMessage("")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "30px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>
              {messageType === "success" ? "✅" : messageType === "info" ? "ℹ️" : "⚠️"}
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>
              {messageType === "success" ? "Success" : messageType === "info" ? "Note" : "Error"}
            </h3>
            <p style={{ color: "#6b7280", margin: "0 0 20px 0", fontSize: "14px" }}>
              {message}
            </p>
            <button
              onClick={() => setMessage("")}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: messageType === "success" ? "#199E72" : "#ef4444",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;