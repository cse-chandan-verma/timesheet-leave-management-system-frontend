import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import {
  getSubmittedTimesheets,
  approveTimesheet,
  rejectTimesheet,
} from "../../api/timesheetApi";
import "../../styles/admin.css";
import "../../styles/timesheet.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function getDaysOfWeek(weekStartDate) {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + i);
    return { label: DAYS[i], date: d.toISOString().split("T")[0] };
  });
}

function PendingTimesheets() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  function fetchData() {
    getSubmittedTimesheets()
      .then((res) => setTimesheets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function openActionModal(type, ts) {
    setActionModal({ type, ts });
    setComment("");
  }

  async function handleAction() {
    setSubmitting(true);
    try {
      if (actionModal.type === "approve") {
        await approveTimesheet(actionModal.ts.timesheetId, { comment });
        setToast({ msg: "Timesheet approved!", type: "success" });
      } else {
        if (!comment.trim()) {
          setToast({ msg: "Comment is required for rejection.", type: "error" });
          setSubmitting(false);
          return;
        }
        await rejectTimesheet(actionModal.ts.timesheetId, { comment });
        setToast({ msg: "Timesheet rejected.", type: "success" });
      }
      setActionModal(null);
      setDetailModal(null);
      fetchData();
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Action failed.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="page-header">
        <h1 className="page-title">Pending Timesheets</h1>
        <p className="page-subtitle">Review and approve employee timesheets</p>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : timesheets.length === 0 ? (
          <div className="empty-state">
            <Clock size={36} />
            <p>No pending timesheets — all caught up!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Week</th>
                  <th>Hours</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((ts) => (
                  <tr key={ts.timesheetId}>
                    <td>
                      <div className="info-row">
                        <span className="info-name">{ts.employeeName}</span>
                        <span className="info-sub">{ts.employeeEmail}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{ts.weekStartDate}</td>
                    <td>{ts.totalHours} hrs</td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {ts.submittedAt ? new Date(ts.submittedAt).toLocaleDateString() : "—"}
                    </td>
                    <td><StatusBadge status={ts.status} /></td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setDetailModal(ts)}
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          className="btn btn-sm approve-btn"
                          onClick={() => openActionModal("approve", ts)}
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button
                          className="btn btn-sm reject-btn"
                          onClick={() => openActionModal("reject", ts)}
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailModal && (
        <Modal
          title={`Timesheet — ${detailModal.employeeName}`}
          onClose={() => setDetailModal(null)}
          size="lg"
          footer={
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setDetailModal(null)}>
                Close
              </button>
              <button
                className="btn btn-sm approve-btn"
                onClick={() => { setDetailModal(null); openActionModal("approve", detailModal); }}
              >
                <CheckCircle size={13} /> Approve
              </button>
              <button
                className="btn btn-sm reject-btn"
                onClick={() => { setDetailModal(null); openActionModal("reject", detailModal); }}
              >
                <XCircle size={13} /> Reject
              </button>
            </>
          }
        >
          {/* Summary Bar */}
          <div style={{
            display: "flex", gap: "24px", flexWrap: "wrap",
            padding: "12px 16px", background: "var(--bg-card)",
            borderRadius: "var(--radius-sm)", marginBottom: "20px", fontSize: "13px",
          }}>
            <div><span style={{ color: "var(--text-muted)" }}>Week: </span><strong>{detailModal.weekStartDate}</strong></div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Total Hours: </span>
              <strong style={{ color: "var(--secondary)" }}>{detailModal.totalHours} hrs</strong>
            </div>
            <div><span style={{ color: "var(--text-muted)" }}>Status: </span><StatusBadge status={detailModal.status} /></div>
          </div>

          {/* Daily Breakdown */}
          {!detailModal.entries || detailModal.entries.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px" }}>
              <p>No entry details available.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {getDaysOfWeek(detailModal.weekStartDate).map((day) => {
                const dayEntries = detailModal.entries.filter((e) => e.workDate === day.date);
                const dayTotal = dayEntries.reduce((s, e) => s + e.hoursWorked, 0);
                return (
                  <div key={day.date}>
                    {/* Day Header */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      marginBottom: "6px",
                    }}>
                      <span style={{
                        fontSize: "11px", fontWeight: 700, color: "var(--text-muted)",
                        textTransform: "uppercase", letterSpacing: "0.07em", minWidth: "32px",
                      }}>
                        {day.label}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-light)" }}>{day.date}</span>
                      {dayEntries.length > 0 && (
                        <span style={{ marginLeft: "auto", fontSize: "12px", fontWeight: 600, color: "var(--secondary)" }}>
                          {dayTotal}h total
                        </span>
                      )}
                    </div>

                    {/* Entries */}
                    {dayEntries.length === 0 ? (
                      <div style={{
                        padding: "8px 12px", fontSize: "12px", color: "var(--text-light)",
                        background: "var(--bg-card)", borderRadius: "var(--radius-sm)", fontStyle: "italic",
                      }}>
                        No entries
                      </div>
                    ) : (
                      dayEntries.map((entry) => (
                        <div key={entry.id} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 14px", marginBottom: "4px",
                          background: "var(--bg-white)", border: "1px solid var(--border-light)",
                          borderRadius: "var(--radius-sm)",
                        }}>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600 }}>{entry.projectName}</div>
                            {entry.taskSummary && (
                              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                                {entry.taskSummary}
                              </div>
                            )}
                          </div>
                          <div style={{
                            fontSize: "16px", fontWeight: 700,
                            color: "var(--secondary)", marginLeft: "12px", whiteSpace: "nowrap",
                          }}>
                            {entry.hoursWorked}h
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Modal>
      )}

      {/* Approve / Reject Modal */}
      {actionModal && (
        <Modal
          title={actionModal.type === "approve" ? "Approve Timesheet" : "Reject Timesheet"}
          onClose={() => setActionModal(null)}
          footer={
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setActionModal(null)}>
                Cancel
              </button>
              <button
                className={`btn btn-sm ${actionModal.type === "approve" ? "approve-btn" : "reject-btn"}`}
                onClick={handleAction}
                disabled={submitting}
              >
                {actionModal.type === "approve" ? "Confirm Approve" : "Confirm Reject"}
              </button>
            </>
          }
        >
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
            {actionModal.type === "approve" ? "Approving timesheet for " : "Rejecting timesheet for "}
            <strong style={{ color: "var(--text-main)" }}>{actionModal.ts.employeeName}</strong>
            {" — week of "}
            <strong style={{ color: "var(--text-main)" }}>{actionModal.ts.weekStartDate}</strong>
          </p>
          <label className="form-label">
            {actionModal.type === "reject" ? "Reason (required)" : "Comment (optional)"}
          </label>
          <textarea
            className="comment-input"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={actionModal.type === "approve" ? "Great work! (optional)" : "Please explain why..."}
          />
        </Modal>
      )}
    </Layout>
  );
}

export default PendingTimesheets;
