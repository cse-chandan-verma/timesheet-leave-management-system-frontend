import React, { useState, useEffect } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import { getHolidays, addHoliday, deleteHoliday } from "../../api/leaveApi";
import "../../styles/admin.css";

function HolidayManagement() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const currentYear = new Date().getFullYear();
  const [form, setForm] = useState({
    holidayDate: "",
    holidayName: "",
    isOptional: false,
    year: currentYear,
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  function fetchHolidays() {
    getHolidays()
      .then((res) => setHolidays(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.holidayDate || !form.holidayName) {
      setToast({ msg: "Date and name are required.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      await addHoliday(form);
      setToast({ msg: "Holiday added!", type: "success" });
      setShowForm(false);
      setForm({
        holidayDate: "",
        holidayName: "",
        isOptional: false,
        year: currentYear,
      });
      fetchHolidays();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Failed to add.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteHoliday(deleteModal.id);
      setToast({ msg: "Holiday deleted.", type: "success" });
      setDeleteModal(null);
      fetchHolidays();
    } catch (err) {
      setToast({ msg: "Failed to delete.", type: "error" });
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

      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1 className="page-title">Holiday Management</h1>
          <p className="page-subtitle">Manage company holidays for the year</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={15} /> Add Holiday
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="card-header">
            <span className="card-title">New Holiday</span>
          </div>
          <form onSubmit={handleAdd}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div className="form-group">
                <label className="form-label">Holiday Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.holidayDate}
                  onChange={(e) =>
                    setForm({ ...form, holidayDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Holiday Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Diwali"
                  value={form.holidayName}
                  onChange={(e) =>
                    setForm({ ...form, holidayName: e.target.value })
                  }
                />
              </div>
            </div>
            <div
              className="form-group"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <input
                type="checkbox"
                id="isOptional"
                checked={form.isOptional}
                onChange={(e) =>
                  setForm({ ...form, isOptional: e.target.checked })
                }
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <label
                htmlFor="isOptional"
                style={{ cursor: "pointer", fontSize: "13px", fontWeight: 500 }}
              >
                Optional Holiday
              </label>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={saving}
              >
                {saving ? "Adding..." : "Add Holiday"}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : holidays.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={36} />
            <p>No holidays added yet</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Holiday</th>
                  <th>Type</th>
                  <th>Year</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 500 }}>
                      {new Date(h.holidayDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>{h.holidayName}</td>
                    <td>
                      <span
                        className={`badge ${h.isOptional ? "badge-submitted" : "badge-approved"}`}
                      >
                        {h.isOptional ? "Optional" : "Mandatory"}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{h.year}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteModal(h)}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteModal && (
        <Modal
          title="Delete Holiday"
          onClose={() => setDeleteModal(null)}
          footer={
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                Delete
              </button>
            </>
          }
        >
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Delete <strong>{deleteModal.holidayName}</strong> (
            {deleteModal.holidayDate})?
          </p>
        </Modal>
      )}
    </Layout>
  );
}

export default HolidayManagement;
