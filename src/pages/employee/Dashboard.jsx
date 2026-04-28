import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getLeaveBalance } from "../../api/leaveApi";
import { getTimesheetHistory } from "../../api/timesheetApi";
import "../../styles/dashboard.css";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [lbRes, tsRes] = await Promise.all([
          getLeaveBalance(),
          getTimesheetHistory(),
        ]);
        setLeaveBalances(lbRes.data);
        setTimesheets(tsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalRemaining = leaveBalances.reduce(
    (sum, b) => sum + b.remainingDays,
    0,
  );
  const pendingTS = timesheets.filter((t) => t.status === "SUBMITTED").length;
  const approvedTS = timesheets.filter((t) => t.status === "APPROVED").length;
  const latestTS = timesheets[0];
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
          <p className="dashboard-welcome-title">
            Hello, {user?.fullName?.split(" ")[0]} 👋
          </p>
          <p className="dashboard-welcome-sub">{today}</p>
        </div>
        <LayoutDashboard size={40} className="dashboard-welcome-icon" />
      </div>

      <div className="stat-grid">
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/employee/timesheet")}>
          <div className="stat-icon"><Clock size={20} /></div>
          <div className="stat-label">This Week Status</div>
          <div className="stat-value" style={{ fontSize: "16px", marginTop: "4px" }}>
            {latestTS ? <StatusBadge status={latestTS.status} /> : "—"}
          </div>
          <div className="stat-sub">{latestTS ? latestTS.weekStartDate : "No timesheets yet"}</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/employee/timesheet-history")}>
          <div className="stat-icon"><AlertCircle size={20} /></div>
          <div className="stat-label">Pending Review</div>
          <div className="stat-value">{pendingTS}</div>
          <div className="stat-sub">timesheets submitted</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/employee/timesheet-history")}>
          <div className="stat-icon"><CheckCircle size={20} /></div>
          <div className="stat-label">Approved</div>
          <div className="stat-value">{approvedTS}</div>
          <div className="stat-sub">timesheets approved</div>
        </div>
        <div className="stat-card stat-card-clickable" onClick={() => navigate("/employee/leave")}>
          <div className="stat-icon"><Calendar size={20} /></div>
          <div className="stat-label">Total Leave Left</div>
          <div className="stat-value">{totalRemaining}</div>
          <div className="stat-sub">days remaining</div>
        </div>
      </div>

      <div className="two-col-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Leave Balance</span>
          </div>
          <div className="leave-balance-grid">
            {leaveBalances.map((b) => (
              <div key={b.leaveTypeId} className="leave-balance-card">
                <div className="leave-balance-type">{b.leaveTypeCode}</div>
                <div className="leave-balance-remaining">{b.remainingDays}</div>
                <div className="leave-balance-total">of {b.totalDays} days</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Timesheets</span>
          </div>
          {timesheets.length === 0 ? (
            <div className="empty-state">
              <Clock size={32} />
              <p>No timesheets yet</p>
            </div>
          ) : (
            <div className="recent-list">
              {timesheets.map((ts) => (
                <div key={ts.timesheetId} className="recent-item">
                  <div>
                    <div className="recent-label">{ts.weekStartDate}</div>
                    <div className="recent-sub">{ts.totalHours} hrs</div>
                  </div>
                  <StatusBadge status={ts.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
