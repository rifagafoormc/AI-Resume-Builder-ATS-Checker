import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalATSAnalyses: 0,
    averageATSScore: 0
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Check the logged-in user's role
      const userData = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (userData.role !== "admin") {
        navigate("/dashboard");
        return;
      }

      // ✅ FIXED: Call the correct backend route
      const response = await API.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStats(
        response.data.stats || {
          totalUsers: 0,
          totalResumes: 0,
          totalATSAnalyses: 0,
          averageATSScore: 0
        }
      );

      // Fetch recent users
      const usersResponse = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRecentUsers(usersResponse.data.users || []);

    } catch (err) {
      console.error("Admin dashboard error:", err);

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
          "Failed to load dashboard"
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
      <div className="dashboard-loading" style={{ backgroundColor: "#E6F2F0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#165B6D" }}>
        <div className="loading-spinner" style={{ borderTopColor: "#199E72" }}></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* ========================================
          GLOBAL STYLES
      ======================================== */}
      <style>{`
        .dashboard-page {
          min-height: 100vh;
          background: #E6F2F0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Navbar */
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
        .navbar-link:hover, .navbar-link.active {
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

        /* Main Content */
        .admin-dashboard-content {
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

        /* Stats Grid */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .admin-stat-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        .admin-stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: #E6F2F0;
        }
        .admin-stat-info p {
          margin: 0;
          font-size: 14px;
          color: #64748B;
        }
        .admin-stat-info h2 {
          margin: 5px 0;
          font-size: 28px;
          color: #165B6D;
        }
        .admin-stat-info span {
          font-size: 12px;
          color: #94A3B8;
        }

        /* Management Section */
        .admin-section {
          background: white;
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .admin-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .admin-section-header h2 {
          color: #165B6D;
          margin: 0 0 5px;
        }
        .admin-section-header p {
          color: #64748B;
          margin: 0;
        }
        .admin-view-all {
          color: #199E72;
          text-decoration: none;
          font-weight: 600;
        }
        .admin-management-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .admin-management-card {
          background: #F8FAFC;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          transition: all 0.3s;
        }
        .admin-management-card:hover {
          border-color: #199E72;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .management-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: #E6F2F0;
        }
        .admin-management-card h3 {
          margin: 0 0 5px;
          color: #165B6D;
          font-size: 16px;
        }
        .admin-management-card p {
          margin: 0;
          color: #64748B;
          font-size: 13px;
        }
        .management-arrow {
          margin-left: auto;
          font-size: 20px;
          color: #199E72;
        }

        /* Users Table */
        .admin-users-table-container {
          overflow-x: auto;
        }
        .admin-users-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .admin-users-table th {
          text-align: left;
          padding: 12px;
          background: #E6F2F0;
          color: #165B6D;
          font-size: 14px;
        }
        .admin-users-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #334155;
        }
        .admin-user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #199E72;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .admin-empty-state {
          text-align: center;
          padding: 40px;
          color: #64748B;
        }
        .admin-empty-state div {
          font-size: 48px;
          margin-bottom: 10px;
        }
      `}</style>

      {/* ========================================
          NAVBAR
      ======================================== */}
      <nav className="dashboard-navbar">

        <div
          className="navbar-logo"
          onClick={() => navigate("/admin-dashboard")}
          style={{ cursor: "pointer" }}
        >
          {/* Rocket SVG Icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="#199E72" 
            width="24" 
            height="24"
          >
            <path d="M12 2c-3.5 0-6 2.5-6 6 0 1.5.5 3 1.5 4.5L6 18l3 1.5L9 22c0 .5.5 1 1 1s1-.5 1-1v-2.5L12 19l1 .5V22c0 .5.5 1 1 1s1-.5 1-1l0-2.5L18 18l-1.5-5.5C17.5 11 18 9.5 18 8c0-3.5-2.5-6-6-6zm-1.5 9.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm3 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
          </svg>
          <span className="logo-text">scoreCraft</span>
        </div>

        <div className="navbar-links">
          <Link
            to="/admin-dashboard"
            className="navbar-link active"
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
            className="navbar-link"
          >
            Resumes
          </Link>
        </div>

        <div className="navbar-profile">

          <button
            className="profile-button"
            onClick={() => setShowDropdown(!showDropdown)}
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
                onClick={() => setShowDropdown(false)}
              >
                <span>👤</span>
                Profile
              </Link>

              <button
                onClick={logout}
                className="dropdown-item logout"
              >
                <span>↪</span>
                Logout
              </button>

            </div>
          )}

        </div>

      </nav>


      {/* ========================================
          MAIN CONTENT
      ======================================== */}
      <main className="admin-dashboard-content">

        <div className="admin-page-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Overview of your scoreCraft platform.
            </p>
          </div>

          <button
            className="admin-refresh-button"
            onClick={loadDashboard}
          >
            ↻ Refresh
          </button>
        </div>


        {/* ERROR */}
        {error && (
          <div className="admin-error">
            ⚠️ {error}
          </div>
        )}


        {/* ========================================
            STATISTICS CARDS
        ======================================== */}
        <div className="admin-stats-grid">

          {/* USERS */}
          <div className="admin-stat-card">
            <div className="admin-stat-icon users-icon">
              👥
            </div>

            <div className="admin-stat-info">
              <p>Total Users</p>
              <h2>{stats.totalUsers}</h2>
              <span>Registered users</span>
            </div>
          </div>


          {/* RESUMES */}
          <div className="admin-stat-card">
            <div className="admin-stat-icon resumes-icon">
              📄
            </div>

            <div className="admin-stat-info">
              <p>Total Resumes</p>
              <h2>{stats.totalResumes}</h2>
              <span>Resumes created</span>
            </div>
          </div>


          {/* ATS */}
          <div className="admin-stat-card">
            <div className="admin-stat-icon ats-icon">
              📊
            </div>

            <div className="admin-stat-info">
              <p>ATS Analyses</p>
              <h2>{stats.totalATSAnalyses}</h2>
              <span>Analyses performed</span>
            </div>
          </div>


          {/* AVERAGE SCORE */}
          <div className="admin-stat-card">
            <div className="admin-stat-icon score-icon">
              ⭐
            </div>

            <div className="admin-stat-info">
              <p>Average ATS Score</p>
              <h2>{stats.averageATSScore}%</h2>
              <span>Across all analyses</span>
            </div>
          </div>

        </div>


        {/* ========================================
            QUICK MANAGEMENT
        ======================================== */}
        <div className="admin-section">

          <div className="admin-section-header">
            <div>
              <h2>Management</h2>
              <p>
                Manage users, resumes and ATS analyses.
              </p>
            </div>
          </div>

          <div className="admin-management-grid">

            <Link
              to="/admin-users"
              className="admin-management-card"
            >
              <div className="management-icon">
                👥
              </div>

              <div>
                <h3>User Management</h3>
                <p>
                  Add, view and remove users.
                </p>
              </div>

              <span className="management-arrow">
                →
              </span>
            </Link>


            <Link
              to="/admin-ats"
              className="admin-management-card"
            >
              <div className="management-icon">
                📊
              </div>

              <div>
                <h3>ATS Analysis</h3>
                <p>
                  View analyses performed by users.
                </p>
              </div>

              <span className="management-arrow">
                →
              </span>
            </Link>


            <Link
              to="/admin-resumes"
              className="admin-management-card"
            >
              <div className="management-icon">
                📄
              </div>

              <div>
                <h3>Resume Management</h3>
                <p>
                  View resumes created by users.
                </p>
              </div>

              <span className="management-arrow">
                →
              </span>
            </Link>

          </div>

        </div>


        {/* ========================================
            RECENT USERS
        ======================================== */}
        <div className="admin-section">

          <div className="admin-section-header">

            <div>
              <h2>Recent Users</h2>
              <p>
                Recently registered users.
              </p>
            </div>

            <Link
              to="/admin-users"
              className="admin-view-all"
            >
              View All →
            </Link>

          </div>


          <div className="admin-users-table-container">

            {recentUsers.length === 0 ? (
              <div className="admin-empty-state">
                <div>👥</div>
                <h3>No users yet</h3>
                <p>
                  Registered users will appear here.
                </p>
              </div>
            ) : (
              <table className="admin-users-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined</th>
                  </tr>
                </thead>

                <tbody>

                  {/* ✅ FIXED: Added unique key={user._id} to each row */}
                  {recentUsers.map((user) => (
                    <tr key={user._id || user.id}>

                      <td>
                        <div className="admin-user-cell">

                          <div className="admin-user-avatar">
                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <span>
                            {user.name}
                          </span>

                        </div>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;