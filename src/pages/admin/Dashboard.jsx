import React, { useState, useEffect } from "react";
import { Users, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers } from "../../api/authApi";
import { getNotifications } from "../../api/adminApi";
import "../../styles/dashboard.css";
import "../../styles/admin.css";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [usersRes, notifRes] = await Promise.all([
          getAllUsers(),
          getNotifications(),
        ]);
        setUsers(usersRes.data || []);
        setNotifs(notifRes.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const totalManagers  = users.filter((u) => u.role === "MANAGER").length;
  const totalEmployees = users.filter((u) => u.role === "EMPLOYEE").length;

  if (loading)
    return <Layout><LoadingSpinner fullPage /></Layout>;

  return (
    <Layout>
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-welcome-title">Admin Control Panel 🛡️</p>
          <p className="dashboard-welcome-sub">{today} · {user?.fullName}</p>
        </div>
        <Users size={40} className="dashboard-welcome-icon" />
      </div>

      <div className="stat-grid">
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/admin/users")}>
          <div className="stat-icon"><Users size={20} /></div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-sub">registered accounts</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/admin/users")}>
          <div className="stat-icon"><Users size={20} /></div>
          <div className="stat-label">Total Managers</div>
          <div className="stat-value">{totalManagers}</div>
          <div className="stat-sub">active managers</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/admin/users")}>
          <div className="stat-icon"><Users size={20} /></div>
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{totalEmployees}</div>
          <div className="stat-sub">active employees</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/admin/notifications")}>
          <div className="stat-icon"><Bell size={20} /></div>
          <div className="stat-label">Total Events</div>
          <div className="stat-value">{notifs.length}</div>
          <div className="stat-sub">system notifications</div>
        </div>
      </div>

      <div className="two-col-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">User Breakdown</span>
          </div>
          <div className="recent-list">
            {["ADMIN", "MANAGER", "EMPLOYEE"].map((role) => (
              <div key={role} className="recent-item">
                <span className="info-name">{role}</span>
                <span className="badge badge-approved">
                  {users.filter((u) => u.role === role).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Events</span>
            <span className="tag tag-ts">{notifs.length} total</span>
          </div>
          {notifs.length === 0 ? (
            <div className="empty-state">
              <Bell size={28} />
              <p>No events yet</p>
            </div>
          ) : (
            <div className="recent-list">
              {notifs.slice(0, 5).map((n, i) => (
                <div key={i} className="recent-item">
                  <div className="info-row">
                    <span className="info-name">{n.userEmail}</span>
                    <span className="info-sub">{n.eventType?.replace(/_/g, " ")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
