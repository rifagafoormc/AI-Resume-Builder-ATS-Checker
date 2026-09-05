import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [passwordError, setPasswordError] = useState("");
  const [modal, setModal] = useState({ show: false, message: "", type: "" });

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
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const userData = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (userData.role !== "admin") {
        navigate("/dashboard");
        return;
      }

      const response = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Users error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewUser({ ...newUser, password: value });
    // Real-time password validation
    const error = validatePassword(value);
    setPasswordError(error);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Client-side validation before submitting
    const error = validatePassword(newUser.password);
    if (error) {
      setPasswordError(error);
      setModal({ show: true, message: error, type: "error" });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/admin/users",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNewUser({
        name: "",
        email: "",
        password: ""
      });
      setPasswordError("");

      setShowAddForm(false);
      await loadUsers();

      setModal({ show: true, message: "User added successfully!", type: "success" });
    } catch (err) {
      console.error("Add user error:", err);
      setModal({ show: true, message: err.response?.data?.message || "Failed to add user", type: "error" });
    }
  };

  const handleDeleteUser = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await loadUsers();
      setModal({ show: true, message: "User deleted successfully!", type: "success" });
    } catch (err) {
      console.error("Delete user error:", err);
      setModal({ show: true, message: err.response?.data?.message || "Failed to delete user", type: "error" });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <style>{`
        .dashboard-page { min-height: 100vh; background: #E6F2F0; font-family: sans-serif; }
        
        /* Navbar (Exact same as AdminDashboard) */
        .dashboard-navbar {
          background: #ffffff;
          padding: 0 5%;
          height: 70px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }
        .navbar-logo { display: flex; align-items: center; gap: 8px; }
        .navbar-logo svg { display: block; }
        .logo-text { font-size: 20px; font-weight: 700; color: #199E72; }
        .navbar-links { display: flex; gap: 20px; }
        .navbar-link {
          text-decoration: none;
          color: #4A5568;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s;
        }
        .navbar-link:hover, .navbar-link.active {
          background: #D5F5E3;
          color: #165B6D;
        }
        .navbar-profile { position: relative; }
        .profile-button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #334155;
        }
        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #165B6D;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .dropdown-arrow { font-size: 10px; }
        .profile-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          padding: 8px;
          width: 180px;
          z-index: 100;
        }
        .dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px;
          border-radius: 8px;
          color: #334155;
          text-decoration: none;
          cursor: pointer;
          border: none;
          background: none;
          font-size: 14px;
        }
        .dropdown-item:hover { background: #F4F9F8; }
        .dropdown-item.logout { color: #DC2626; }

        /* Main Content */
        .admin-dashboard-content { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .admin-page-header h1 { color: #165B6D; margin: 0 0 8px; }
        .admin-page-header p { color: #4A5568; margin: 0; }
        
        .admin-primary-btn {
          background: #199E72;
          color: white;
          border: none;
          padding: 11px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .admin-primary-btn:hover { background: #15803D; }

        .admin-secondary-btn {
          background: #E6F2F0;
          color: #165B6D;
          border: 1px solid #199E72;
          padding: 11px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        
        .admin-error {
          background: #FEE2E2;
          color: #DC2626;
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        /* Add User Form */
        .admin-form-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 25px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        .admin-form-card h2 { color: #165B6D; margin-top: 0; }
        .admin-form-card form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .admin-form-card input {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
        }
        .admin-form-card input:focus {
          outline: none;
          border-color: #199E72;
          background: white;
          box-shadow: 0 0 0 4px rgba(25,158,114,0.1);
        }
        .admin-form-actions { display: flex; gap: 10px; }

        /* Table */
        .admin-table-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th, .admin-table td {
          padding: 18px 20px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .admin-table th {
          background: #E6F2F0;
          color: #165B6D;
          font-size: 14px;
          font-weight: 700;
        }
        .admin-table td { color: #334155; }

        .admin-delete-btn {
          background: #FEE2E2;
          color: #DC2626;
          border: none;
          padding: 8px 14px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 600;
        }
        .admin-delete-btn:hover { background: #FECACA; }

        .admin-loading, .admin-empty { padding: 40px; text-align: center; color: #6b7280; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-box {
          background: white;
          border-radius: 16px;
          padding: 30px;
          width: 400px;
          max-width: 90%;
          text-align: center;
        }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav className="dashboard-navbar">
        <div className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#199E72" width="24" height="24">
            <path d="M12 2c-3.5 0-6 2.5-6 6 0 1.5.5 3 1.5 4.5L6 18l3 1.5L9 22c0 .5.5 1 1 1s1-.5 1-1v-2.5L12 19l1 .5V22c0 .5.5 1 1 1s1-.5 1-1l0-2.5L18 18l-1.5-5.5C17.5 11 18 9.5 18 8c0-3.5-2.5-6-6-6zm-1.5 9.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm3 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
          </svg>
          <span className="logo-text">scoreCraft</span>
        </div>

        <div className="navbar-links">
          <Link to="/admin-dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/admin-users" className="navbar-link active">Users</Link>
          <Link to="/admin-ats" className="navbar-link">ATS Analysis</Link>
          <Link to="/admin-resumes" className="navbar-link">Resumes</Link>
        </div>

        <div className="navbar-profile">
          <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="profile-avatar">A</div>
            <span>Admin</span>
            <span className="dropdown-arrow">▾</span>
          </button>

          {showDropdown && (
            <div className="profile-dropdown">
              <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                <span>👤</span> Profile
              </Link>
              <button onClick={logout} className="dropdown-item logout">
                <span>↪</span> Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-dashboard-content">
        <div className="admin-page-header">
          <div>
            <h1>Users</h1>
            <p>Manage registered users.</p>
          </div>
          <button className="admin-primary-btn" onClick={() => setShowAddForm(!showAddForm)}>
            + Add User
          </button>
        </div>

        {showAddForm && (
          <div className="admin-form-card">
            <h2>Add New User</h2>
            <form onSubmit={handleAddUser}>
              <input 
                type="text" 
                placeholder="User name" 
                value={newUser.name} 
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={newUser.password} 
                onChange={handlePasswordChange} 
                required 
                style={{
                  border: `2px solid ${passwordError ? "#dc2626" : "#e5e7eb"}`
                }}
              />
              
              {/* Password requirements hint */}
              <div style={{ 
                marginTop: "-8px",
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
                    color: newUser.password.length >= 6 ? "#199E72" : (newUser.password ? "#dc2626" : "#6b7280")
                  }}>
                    At least 6 characters {newUser.password && (newUser.password.length >= 6 ? "✅" : "❌")}
                  </li>
                  <li style={{ 
                    color: /\d/.test(newUser.password) ? "#199E72" : (newUser.password ? "#dc2626" : "#6b7280")
                  }}>
                    At least one number {newUser.password && (/\d/.test(newUser.password) ? "✅" : "❌")}
                  </li>
                  <li style={{ 
                    color: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]/.test(newUser.password) ? "#199E72" : (newUser.password ? "#dc2626" : "#6b7280")
                  }}>
                    At least one special character {newUser.password && (/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]/.test(newUser.password) ? "✅" : "❌")}
                  </li>
                </ul>
                {passwordError && (
                  <div style={{ color: "#dc2626", marginTop: "4px", fontWeight: "500" }}>
                    ⚠️ {passwordError}
                  </div>
                )}
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-primary-btn">Add User</button>
                <button type="button" className="admin-secondary-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-table-card">
          {loading ? (
            <div className="admin-loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="admin-empty">No users found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Total Resumes Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.resumeCount || 0}</td>
                    <td>
                      <button className="admin-delete-btn" onClick={() => handleDeleteUser(user.id, user.name)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ===== MODAL ===== */}
      {modal.show && (
        <div className="modal-overlay" onClick={() => setModal({ show: false, message: "", type: "" })}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>{modal.type === "success" ? "✅" : "⚠️"}</div>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>{modal.type === "success" ? "Success" : "Error"}</h3>
            <p style={{ color: "#6b7280", margin: "0 0 20px 0", fontSize: "14px" }}>{modal.message}</p>
            <button onClick={() => setModal({ show: false, message: "", type: "" })} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", backgroundColor: modal.type === "success" ? "#199E72" : "#ef4444", color: "#ffffff", cursor: "pointer", fontWeight: "600" }}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;