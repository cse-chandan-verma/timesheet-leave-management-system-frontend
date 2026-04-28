import React, { useState, useEffect } from "react";
import { Calendar, Send } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import { getLeaveTypes, getLeaveBalance, applyLeave } from "../../api/leaveApi";
import "../../styles/leave.css";

function Leave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [typesRes, balRes] = await Promise.all([
          getLeaveTypes(),
          getLeaveBalance(),
        ]);
        setLeaveTypes(typesRes.data);
        setLeaveBalances(balRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function getBalance(leaveTypeId) {
    return leaveBalances.find((b) => b.leaveTypeId === Number(leaveTypeId));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.leaveTypeId || !form.fromDate || !form.toDate || !form.reason) {
      setToast({ msg: "All fields are required.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      await applyLeave({ ...form, leaveTypeId: Number(form.leaveTypeId) });
      setToast({ msg: "Leave applied successfully!", type: "success" });
      setForm({ leaveTypeId: "", fromDate: "", toDate: "", reason: "" });
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Failed to apply leave.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <Layout>
        <LoadingSpinner fullPage />
      </Layout>
    );

  const selectedBalance = form.leaveTypeId
    ? getBalance(form.leaveTypeId)
    : null;

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
        <h1 className="page-title">Apply for Leave</h1>
        <p className="page-subtitle">Submit a new leave request</p>
      </div>

      {/* Balance Cards */}
      <div className="leave-type-cards">
        {leaveBalances.map((b) => (
          <div
            key={b.leaveTypeId}
            className={`leave-type-card ${form.leaveTypeId === String(b.leaveTypeId) ? "selected" : ""}`}
            onClick={() =>
              setForm({ ...form, leaveTypeId: String(b.leaveTypeId) })
            }
          >
            <div className="leave-type-code">{b.leaveTypeCode}</div>
            <div className="leave-type-name">{b.leaveTypeName}</div>
            <div className="leave-type-days">{b.remainingDays}</div>
            <div className="leave-type-label">days left</div>
          </div>
        ))}
      </div>

      <div className="apply-form-card">
        <div className="card-header">
          <span className="card-title">Leave Request Form</span>
          {selectedBalance && (
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Balance:{" "}
              <strong style={{ color: "var(--secondary)" }}>
                {selectedBalance.remainingDays}
              </strong>{" "}
              days remaining
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <select
              className="form-input"
              value={form.leaveTypeId}
              onChange={(e) =>
                setForm({ ...form, leaveTypeId: e.target.value })
              }
            >
              <option value="">Select leave type</option>
              {leaveTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.typeName} ({t.typeCode})
                </option>
              ))}
            </select>
          </div>

          <div className="date-row">
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input
                className="form-input"
                type="date"
                value={form.fromDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <input
                className="form-input"
                type="date"
                value={form.toDate}
                min={form.fromDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea
              className="form-input"
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Brief reason for your leave..."
              style={{ resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            <Send size={14} />{" "}
            {submitting ? "Submitting..." : "Submit Leave Request"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Leave;
