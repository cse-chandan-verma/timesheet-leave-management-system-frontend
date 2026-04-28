import React, { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { getTimesheetHistory } from "../../api/timesheetApi";

function TimesheetHistory() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTimesheetHistory()
      .then((res) => setTimesheets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Timesheet History</h1>
        <p className="page-subtitle">All your past weekly timesheets</p>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : timesheets.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={36} />
            <p>No timesheet history found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Week Start</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Manager Comment</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((ts) => (
                  <tr key={ts.timesheetId}>
                    <td style={{ fontWeight: 500 }}>{ts.weekStartDate}</td>
                    <td>{ts.totalHours} hrs</td>
                    <td>
                      <StatusBadge status={ts.status} />
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {ts.submittedAt
                        ? new Date(ts.submittedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td
                      style={{
                        color: "var(--text-muted)",
                        fontStyle: ts.managerComment ? "normal" : "italic",
                      }}
                    >
                      {ts.managerComment || "No comment"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default TimesheetHistory;
