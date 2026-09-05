import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AdminResumes() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadResumeCounts();
  }, []);

  const loadResumeCounts = async () => {
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

      const response = await API.get("/admin/resumes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(response.data.users || []);

    } catch (err) {
      console.error("Resume count error:", err);

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
          "Failed to load resume information"
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading resume information...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <style>{`
        .dashboard-page {
          min-height: 100vh;
          background: #E6F2F0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, sans-serif;
        }

        .dashboard-navbar {
          background: #ffffff;
          padding: 0 5%;
          height: 70px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .navbar-logo svg {
          display: block;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #199E72;
        }

        .navbar-links {
          display: flex;
          gap: 20px;
        }

        .navbar-link {
          text-decoration: none;
          color: #4A5568;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .navbar-link:hover,
        .navbar-link.active {
          background: #D5F5E3;
          color: #165B6D;
        }

        .navbar-profile {
          position: relative;
        }

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

        .dropdown-arrow {
          font-size: 10px;
        }

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

        .dropdown-item:hover {
          background: #F4F9F8;
        }

        .dropdown-item.logout {
          color: #DC2626;
        }

        .admin-page-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .admin-page-header h1 {
          color: #165B6D;
          margin: 0 0 8px;
        }

        .admin-page-header p {
          color: #4A5568;
          margin: 0;
        }

        .admin-refresh-button {
          background: #199E72;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .admin-refresh-button:hover {
          background: #15803D;
        }

        .admin-error {
          background: #FEE2E2;
          color: #DC2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .resume-count-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .resume-count-table {
          width: 100%;
          border-collapse: collapse;
        }

        .resume-count-table th {
          text-align: left;
          padding: 16px 20px;
          background: #E6F2F0;
          color: #165B6D;
          font-size: 14px;
        }

        .resume-count-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          color: #334155;
          font-size: 14px;
        }

        .resume-count-table tr:last-child td {
          border-bottom: none;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #199E72;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .user-name {
          font-weight: 600;
          color: #165B6D;
        }

        .resume-count {
          font-size: 18px;
          font-weight: 700;
          color: #199E72;
        }

        .empty-state {
          text-align: center;
          padding: 50px 20px;
          color: #64748B;
        }

        .empty-state-icon {
          font-size: 45px;
          margin-bottom: 10px;
        }

        @media (max-width: 768px) {
          .navbar-links {
            gap: 5px;
          }

          .navbar-link {
            padding: 8px;
            font-size: 13px;
          }

          .admin-page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
        }
      `}</style>

      {/* NAVBAR */}

      <nav className="dashboard-navbar">

        <div
          className="navbar-logo"
          onClick={() => navigate("/admin-dashboard")}
          style={{ cursor: "pointer" }}
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

          <span className="logo-text">
            scoreCraft
          </span>
        </div>

        <div className="navbar-links">

          <Link
            to="/admin-dashboard"
            className="navbar-link"
          >
            Dashboard
          </Link>

          <Link
            to="/admin-users"
            className="navbar-link"
          >
            Users
          </Link>

          <Link
            to="/admin-ats"
            className="navbar-link"
          >
            ATS Analysis
          </Link>

          <Link
            to="/admin-resumes"
            className="navbar-link active"
          >
            Resumes
          </Link>

        </div>

        <div className="navbar-profile">

          <button
            className="profile-button"
            onClick={() =>
              setShowDropdown(!showDropdown)
            }
          >
            <div className="profile-avatar">
              A
            </div>

            <span>Admin</span>

            <span className="dropdown-arrow">
              ▾
            </span>
          </button>

          {showDropdown && (
            <div className="profile-dropdown">

              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() =>
                  setShowDropdown(false)
                }
              >
                👤 Profile
              </Link>

              <button
                onClick={logout}
                className="dropdown-item logout"
              >
                ↪ Logout
              </button>

            </div>
          )}

        </div>

      </nav>

      {/* CONTENT */}

      <main className="admin-page-content">

        <div className="admin-page-header">

          <div>
            <h1>Resume Management</h1>

            <p>
              View the number of resumes created by each user.
            </p>
          </div>

          <button
            className="admin-refresh-button"
            onClick={loadResumeCounts}
          >
            ↻ Refresh
          </button>

        </div>

        {error && (
          <div className="admin-error">
            ⚠️ {error}
          </div>
        )}

        <div className="resume-count-card">

          {users.length === 0 ? (
            <div className="empty-state">

              <div className="empty-state-icon">
                📄
              </div>

              <h3>No users found</h3>

              <p>
                Registered users will appear here.
              </p>

            </div>
          ) : (
            <table className="resume-count-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Total Resumes Created</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (
                  <tr key={user.id}>

                    <td>
                      <div className="user-cell">

                        <div className="user-avatar">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <span className="user-name">
                          {user.name}
                        </span>

                      </div>
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      <span className="resume-count">
                        {user.resumeCount}
                      </span>
                    </td>

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

export default AdminResumes;