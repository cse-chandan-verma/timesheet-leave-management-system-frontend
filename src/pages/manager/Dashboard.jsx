import React, { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getSubmittedTimesheets } from "../../api/timesheetApi";
import { getPendingLeaves } from "../../api/leaveApi";
import { getAllUsers } from "../../api/authApi";
import "../../styles/dashboard.css";
import "../../styles/admin.css";

function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timesheets, setTimesheets] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tsRes, lvRes, usersRes] = await Promise.all([
          getSubmittedTimesheets(),
          getPendingLeaves(),
          getAllUsers(),
        ]);
        setTimesheets(tsRes.data);
        setLeaves(lvRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
          <p className="dashboard-welcome-title">Manager Dashboard 👔</p>
          <p className="dashboard-welcome-sub">
            {today} · Logged in as {user?.fullName}
          </p>
        </div>
        <Users size={40} className="dashboard-welcome-icon" />
      </div>

      <div className="stat-grid">
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/manager/pending-timesheets")}>
          <div className="stat-icon"><Clock size={20} /></div>
          <div className="stat-label">Pending Timesheets</div>
          <div className="stat-value">{timesheets.length}</div>
          <div className="stat-sub">awaiting approval</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/manager/pending-leaves")}>
          <div className="stat-icon"><Calendar size={20} /></div>
          <div className="stat-label">Pending Leaves</div>
          <div className="stat-value">{leaves.length}</div>
          <div className="stat-sub">awaiting approval</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/manager/team")}>
          <div className="stat-icon"><Users size={20} /></div>
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-sub">registered users</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/manager/pending-timesheets")}>
          <div className="stat-icon"><CheckCircle size={20} /></div>
          <div className="stat-label">Action Required</div>
          <div className="stat-value">{timesheets.length + leaves.length}</div>
          <div className="stat-sub">total pending items</div>
        </div>
      </div>

      <div className="two-col-grid">
        {/* Recent Pending Timesheets */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pending Timesheets</span>
            <span className="tag tag-ts">{timesheets.length} pending</span>
          </div>
          {timesheets.length === 0 ? (
            <div className="empty-state">
              <Clock size={32} />
              <p>No pending timesheets</p>
            </div>
          ) : (
            <div className="recent-list">
              {timesheets.slice(0, 5).map((ts) => (
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

        {/* Recent Pending Leaves */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pending Leaves</span>
            <span className="tag tag-lv">{leaves.length} pending</span>
          </div>
          {leaves.length === 0 ? (
            <div className="empty-state">
              <Calendar size={32} />
              <p>No pending leave requests</p>
            </div>
          ) : (
            <div className="recent-list">
              {leaves.slice(0, 5).map((lv) => (
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

export default ManagerDashboard;
