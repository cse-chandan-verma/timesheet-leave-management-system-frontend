import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
} from "../../api/leaveApi";
import "../../styles/admin.css";

function PendingLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    getPendingLeaves()
      .then((res) => setLeaves(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function openModal(type, leave) {
    setModal({ type, leave });
    setComment("");
  }

  async function handleAction() {
    setSubmitting(true);
    try {
      if (modal.type === "approve") {
        await approveLeave(modal.leave.id, {
          comment,
          employeeId: modal.leave.employeeId,
        });
        setToast({ msg: "Leave approved!", type: "success" });
      } else {
        if (!comment.trim()) {
          setToast({
            msg: "Comment is required for rejection.",
            type: "error",
          });
          setSubmitting(false);
          return;
        }
        await rejectLeave(modal.leave.id, {
          comment,
          employeeId: modal.leave.employeeId,
        });
        setToast({ msg: "Leave rejected.", type: "success" });
      }
      setModal(null);
      fetchData();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Action failed.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="page-header">
        <h1 className="page-title">Pending Leaves</h1>
        <p className="page-subtitle">Review and approve leave requests</p>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : leaves.length === 0 ? (
          <div className="empty-state">
            <Calendar size={36} />
            <p>No pending leave requests!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((lv) => (
                  <tr key={lv.id}>
                    <td>
                      <div className="info-row">
                        <span className="info-name">{lv.employeeName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="tag tag-lv">{lv.leaveTypeCode}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{lv.fromDate}</td>
                    <td style={{ fontWeight: 500 }}>{lv.toDate}</td>
                    <td>{lv.totalDays}</td>
                    <td
                      style={{
                        color: "var(--text-muted)",
                        maxWidth: "160px",
                        fontSize: "12px",
                      }}
                    >
                      {lv.reason}
                    </td>
                    <td>
                      <StatusBadge status={lv.status} />
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn btn-sm approve-btn"
                          onClick={() => openModal("approve", lv)}
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button
                          className="btn btn-sm reject-btn"
                          onClick={() => openModal("reject", lv)}
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

      {modal && (
        <Modal
          title={modal.type === "approve" ? "Approve Leave" : "Reject Leave"}
          onClose={() => setModal(null)}
          footer={
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button
                className={`btn btn-sm ${modal.type === "approve" ? "approve-btn" : "reject-btn"}`}
                onClick={handleAction}
                disabled={submitting}
              >
                {modal.type === "approve"
                  ? "Confirm Approve"
                  : "Confirm Reject"}
              </button>
            </>
          }
        >
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              marginBottom: "14px",
            }}
          >
            <strong style={{ color: "var(--text-main)" }}>
              {modal.leave.employeeName}
            </strong>
            {` is requesting `}
            <strong>{modal.leave.leaveTypeCode}</strong>
            {` leave from `}
            <strong>{modal.leave.fromDate}</strong>
            {` to `}
            <strong>{modal.leave.toDate}</strong>
            {` (${modal.leave.totalDays} days).`}
          </p>
          <label className="form-label">
            {modal.type === "reject"
              ? "Reason (required)"
              : "Comment (optional)"}
          </label>
          <textarea
            className="comment-input"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              modal.type === "approve"
                ? "Approved! Enjoy your leave. (optional)"
                : "Please explain why..."
            }
          />
        </Modal>
      )}
    </Layout>
  );
}

export default PendingLeaves;
