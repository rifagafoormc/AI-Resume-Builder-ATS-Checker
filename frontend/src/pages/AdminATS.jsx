import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AdminATS() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadATSCounts();
  }, []);

  const loadATSCounts = async () => {
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

      const response = await API.get("/admin/ats", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("ATS count error:", err);

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
          "Failed to load ATS analysis information"
      );
    } finally {
      setLoading(false);
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
          margin-bottom: 30px;
        }
        .admin-page-header h1 { color: #165B6D; margin: 0 0 8px; }
        .admin-page-header p { color: #4A5568; margin: 0; }
        
        .admin-error {
          background: #FEE2E2;
          color: #DC2626;
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

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

        .admin-loading, .admin-empty { padding: 40px; text-align: center; color: #6b7280; }
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
          <Link to="/admin-users" className="navbar-link">Users</Link>
          <Link to="/admin-ats" className="navbar-link active">ATS Analysis</Link>
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
          <h1>ATS Analysis</h1>
          <p>View the total number of ATS analyses performed by each user.</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-table-card">
          {loading ? (
            <div className="admin-loading">Loading ATS analysis data...</div>
          ) : users.length === 0 ? (
            <div className="admin-empty">No users found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Total ATS Analyses Done</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.atsCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminATS;