import React, { useState, useEffect } from "react";
import { CalendarDays, X } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { getLeaveHistory, cancelLeave } from "../../api/leaveApi";

function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  function fetchLeaves() {
    getLeaveHistory()
      .then((res) => setLeaves(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  async function handleCancel() {
    try {
      await cancelLeave(cancelModal.id);
      setToast({ msg: "Leave request cancelled.", type: "success" });
      setCancelModal(null);
      fetchLeaves();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Cancel failed.",
        type: "error",
      });
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
        <h1 className="page-title">Leave History</h1>
        <p className="page-subtitle">All your submitted leave requests</p>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : leaves.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={36} />
            <p>No leave requests found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td style={{ fontWeight: 500 }}>{leave.leaveTypeCode}</td>
                    <td>{leave.fromDate}</td>
                    <td>{leave.toDate}</td>
                    <td>{leave.totalDays}</td>
                    <td>
                      <StatusBadge status={leave.status} />
                    </td>
                    <td
                      style={{ color: "var(--text-muted)", maxWidth: "180px" }}
                    >
                      {leave.reason}
                    </td>
                    <td>
                      {leave.status === "SUBMITTED" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setCancelModal(leave)}
                        >
                          <X size={13} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {cancelModal && (
        <Modal
          title="Cancel Leave Request"
          onClose={() => setCancelModal(null)}
          footer={
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCancelModal(null)}
              >
                No, Keep it
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleCancel}>
                Yes, Cancel
              </button>
            </>
          }
        >
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Are you sure you want to cancel your{" "}
            <strong>{cancelModal.leaveTypeName}</strong> leave from{" "}
            <strong>{cancelModal.fromDate}</strong> to{" "}
            <strong>{cancelModal.toDate}</strong>?
          </p>
        </Modal>
      )}
    </Layout>
  );
}

export default LeaveHistory;
