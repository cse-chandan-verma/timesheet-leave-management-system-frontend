import React, { useState, useEffect } from "react";
import { Bell, User, Clock, Calendar, UserPlus } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getNotifications, getNotificationsByType } from "../../api/adminApi";
import "../../styles/admin.css";

const EVENT_TYPES = [
  "ALL",
  "USER_REGISTERED",
  "TIMESHEET_SUBMITTED",
  "LEAVE_APPLIED",
  "LEAVE_CANCELLED",
];

function getIcon(type) {
  const props = { size: 16 };
  if (type === "USER_REGISTERED")
    return { icon: <UserPlus {...props} />, bg: "#FEF6E4", color: "#E6A817" };
  if (type === "TIMESHEET" || type === "TIMESHEET_SUBMITTED")
    return { icon: <Clock {...props} />, bg: "#EDF2F7", color: "#6D8196" };
  if (type === "LEAVE" || type === "LEAVE_APPLIED")
    return { icon: <Calendar {...props} />, bg: "#EAF5EF", color: "#4CAF7D" };
  if (type === "LEAVE_CANCELLED")
    return { icon: <Bell {...props} />, bg: "#FAEAEA", color: "#D95A5A" };
  return { icon: <Bell {...props} />, bg: "#F1EFE8", color: "#7A7A7A" };
}

function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("ALL");

  useEffect(() => {
    fetchNotifs();
  }, [activeType]);

  async function fetchNotifs() {
    setLoading(true);
    try {
      let queryType = activeType;
      if (activeType === "TIMESHEET_SUBMITTED") queryType = "TIMESHEET";
      if (activeType === "LEAVE_APPLIED") queryType = "LEAVE";

      const res =
        activeType === "ALL"
          ? await getNotifications()
          : await getNotificationsByType(queryType);
      setNotifs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <p className="page-subtitle">System events and activity log</p>
      </div>

      {/* Type Filter */}
      <div className="day-tabs" style={{ marginBottom: "20px" }}>
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            className={`day-tab ${activeType === type ? "active" : ""}`}
            onClick={() => setActiveType(type)}
            style={{ fontSize: "11px" }}
          >
            {type.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : notifs.length === 0 ? (
          <div className="empty-state">
            <Bell size={36} />
            <p>No notifications found</p>
          </div>
        ) : (
          notifs.map((n, i) => {
            const { icon, bg, color } = getIcon(n.eventType);
            return (
              <div key={i} className="notif-item">
                <div className="notif-icon" style={{ background: bg, color }}>
                  {icon}
                </div>
                <div className="notif-content">
                  <div className="notif-title">{n.userEmail}</div>
                  <div className="notif-sub">
                    <span className="tag" style={{ background: bg, color }}>
                      {n.eventType === "TIMESHEET" 
                        ? "TIMESHEET SUBMITTED" 
                        : n.eventType === "LEAVE" 
                        ? "LEAVE APPLIED" 
                        : n.eventType?.replace(/_/g, " ")}
                    </span>
                    {n.userEmail && (
                      <span style={{ marginLeft: "8px" }}>{n.userEmail}</span>
                    )}
                  </div>
                  {n.message && (
                    <div className="notif-message" style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                      {n.message}
                    </div>
                  )}
                  {n.receivedAt && (
                    <div className="notif-time">
                      {new Date(n.receivedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}

export default Notifications;
