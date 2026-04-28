import React, { useState, useEffect } from "react";
import { Users, Clock, Calendar, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers } from "../../api/authApi";
import {
  adminGetPendingTimesheets,
  adminGetPendingLeaves,
  getNotifications,
} from "../../api/adminApi";
import "../../styles/dashboard.css";
import "../../styles/admin.css";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    users: [],
    timesheets: [],
    leaves: [],
    notifs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [usersRes, tsRes, lvRes, notifRes] = await Promise.all([
          getAllUsers(),
          adminGetPendingTimesheets(),
          adminGetPendingLeaves(),
          getNotifications(),
        ]);
        setData({
          users: usersRes.data,
          timesheets: tsRes.data.data, // Admin service wraps results in 'data' field
          leaves: lvRes.data.data,
          notifs: notifRes.data.data,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading)
    return (
      <Layout>
        <LoadingSpinner fullPage />
      </Layout>
    );

  return (
    <Layout>
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-welcome-title">Admin Control Panel 🛡️</p>
          <p className="dashboard-welcome-sub">
            {today} · {user?.fullName}
          </p>
        </div>
        <Users size={40} className="dashboard-welcome-icon" />
      </div>

      <div className="stat-grid">
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/admin/users")}>
          <div className="stat-icon"><Users size={20} /></div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{data.users.length}</div>
          <div className="stat-sub">registered employees</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/admin/users")}>
          <div className="stat-icon"><Clock size={20} /></div>
          <div className="stat-label">Pending Timesheets</div>
          <div className="stat-value">{data.timesheets.length}</div>
          <div className="stat-sub">need approval</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/admin/users")}>
          <div className="stat-icon"><Calendar size={20} /></div>
          <div className="stat-label">Pending Leaves</div>
          <div className="stat-value">{data.leaves.length}</div>
          <div className="stat-sub">need approval</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/admin/notifications")}>
          <div className="stat-icon"><Bell size={20} /></div>
          <div className="stat-label">Total Events</div>
          <div className="stat-value">{data.notifs.length}</div>
          <div className="stat-sub">system notifications</div>
        </div>
      </div>

      <div className="two-col-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pending Timesheets</span>
            <span className="tag tag-ts">{data.timesheets.length}</span>
          </div>
          {data.timesheets.length === 0 ? (
            <div className="empty-state">
              <Clock size={28} />
              <p>None pending</p>
            </div>
          ) : (
            <div className="recent-list">
              {data.timesheets.slice(0, 5).map((ts) => (
                <div key={ts.timesheetId} className="recent-item">
                  <div className="info-row">
                    <span className="info-name">{ts.employeeName}</span>
                    <span className="info-sub">
                      {ts.weekStartDate} · {ts.totalHours} hrs
                    </span>
                  </div>
                  <StatusBadge status={ts.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Pending Leaves</span>
            <span className="tag tag-lv">{data.leaves.length}</span>
          </div>
          {data.leaves.length === 0 ? (
            <div className="empty-state">
              <Calendar size={28} />
              <p>None pending</p>
            </div>
          ) : (
            <div className="recent-list">
              {data.leaves.slice(0, 5).map((lv) => (
                <div key={lv.id} className="recent-item">
                  <div className="info-row">
                    <span className="info-name">{lv.employeeName}</span>
                    <span className="info-sub">
                      {lv.leaveTypeCode} · {lv.fromDate} → {lv.toDate}
                    </span>
                  </div>
                  <StatusBadge status={lv.status} />
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
