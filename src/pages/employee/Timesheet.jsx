import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Send,
  RotateCcw,
} from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import {
  getProjects,
  getWeekTimesheet,
  addEntry,
  updateEntry,
  deleteEntry,
  submitTimesheet,
  recallTimesheet,
} from "../../api/timesheetApi";
import "../../styles/timesheet.css";

// Get Monday of any given date
function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

function toDateStr(date) {
  return date.toISOString().split("T")[0];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function getDaysOfWeek(monday) {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label: DAYS[i], date: toDateStr(d) };
  });
}

function Timesheet() {
  const [monday, setMonday] = useState(getMondayOf(new Date()));
  const [timesheet, setTimesheet] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedDay, setSelectedDay] = useState(
    toDateStr(getMondayOf(new Date())),
  );
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    projectId: "",
    hoursWorked: "",
    taskSummary: "",
  });

  const weekStart = toDateStr(monday);
  const days = getDaysOfWeek(monday);

  useEffect(() => {
    fetchData();
  }, [monday]);

  async function fetchData() {
    setLoading(true);
    try {
      const tsRes = await getWeekTimesheet(weekStart);
      setTimesheet(tsRes.data);
    } catch (err) {
      if (err.response?.status === 404) setTimesheet(null);
    }

    try {
      const prRes = await getProjects();
      setProjects(prRes.data);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  }

  function prevWeek() {
    const d = new Date(monday);
    d.setDate(d.getDate() - 7);
    setMonday(d);
    setSelectedDay(toDateStr(d));
  }

  function nextWeek() {
    const d = new Date(monday);
    d.setDate(d.getDate() + 7);
    setMonday(d);
    setSelectedDay(toDateStr(d));
  }

  const entriesForDay =
    timesheet?.entries?.filter((e) => e.workDate === selectedDay) || [];

  const isLocked =
    timesheet?.status === "SUBMITTED" || timesheet?.status === "APPROVED";

  function resetForm() {
    setForm({ projectId: "", hoursWorked: "", taskSummary: "" });
    setShowAddForm(false);
    setEditEntry(null);
  }

  async function handleAddEntry(e) {
    e.preventDefault();
    if (!form.projectId || !form.hoursWorked) {
      setToast({ msg: "Project and hours are required.", type: "error" });
      return;
    }
    try {
      await addEntry({
        workDate: selectedDay,
        projectId: Number(form.projectId),
        hoursWorked: Number(form.hoursWorked),
        taskSummary: form.taskSummary,
      });
      setToast({ msg: "Entry added successfully!", type: "success" });
      resetForm();
      fetchData();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Failed to add entry.",
        type: "error",
      });
    }
  }

  async function handleUpdateEntry(e) {
    e.preventDefault();
    try {
      await updateEntry(editEntry.id, {
        workDate: selectedDay,
        projectId: Number(form.projectId),
        hoursWorked: Number(form.hoursWorked),
        taskSummary: form.taskSummary,
      });
      setToast({ msg: "Entry updated!", type: "success" });
      resetForm();
      fetchData();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Failed to update.",
        type: "error",
      });
    }
  }

  async function handleDelete() {
    try {
      await deleteEntry(deleteModal.id);
      setToast({ msg: "Entry deleted.", type: "success" });
      setDeleteModal(null);
      fetchData();
    } catch (err) {
      setToast({ msg: "Failed to delete entry.", type: "error" });
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await submitTimesheet({ weekStartDate: weekStart });
      setToast({ msg: "Timesheet submitted successfully!", type: "success" });
      fetchData();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Submission failed.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRecall() {
    setSubmitting(true);
    try {
      await recallTimesheet({ weekStartDate: weekStart });
      setToast({ msg: "Timesheet recalled to Draft.", type: "success" });
      fetchData();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Recall failed.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(entry) {
    setEditEntry(entry);
    setForm({
      projectId: String(entry.projectId),
      hoursWorked: String(entry.hoursWorked),
      taskSummary: entry.taskSummary,
    });
    setShowAddForm(true);
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
        <h1 className="page-title">Timesheet</h1>
        <p className="page-subtitle">Log your daily work hours</p>
      </div>

      {/* Week Navigator */}
      <div className="week-nav">
        <button className="week-nav-btn" onClick={prevWeek}>
          <ChevronLeft size={16} />
        </button>
        <span className="week-label">Week of {weekStart}</span>
        <button className="week-nav-btn" onClick={nextWeek}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Status Bar */}
      {timesheet && (
        <div className="ts-status-bar">
          <div>
            <div className="ts-total-label">Total Hours</div>
            <div className="ts-total-hours">{timesheet.totalHours} hrs</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <StatusBadge status={timesheet.status} />
            {timesheet.status === "DRAFT" && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSubmit}
                disabled={submitting}
              >
                <Send size={14} /> Submit
              </button>
            )}
            {timesheet.status === "SUBMITTED" && (
              <button
                className="btn btn-outline btn-sm"
                onClick={handleRecall}
                disabled={submitting}
              >
                <RotateCcw size={14} /> Recall
              </button>
            )}
          </div>
        </div>
      )}

      {/* Manager Comment */}
      {timesheet?.managerComment && (
        <div className="alert alert-warning" style={{ marginBottom: "16px" }}>
          <strong>Manager Comment:</strong> {timesheet.managerComment}
        </div>
      )}

      {/* Day Tabs */}
      <div className="day-tabs">
        {days.map((day) => {
          const hasData = timesheet?.entries?.some(
            (e) => e.workDate === day.date,
          );
          return (
            <button
              key={day.date}
              className={`day-tab ${selectedDay === day.date ? "active" : ""} ${hasData ? "has-data" : ""}`}
              onClick={() => setSelectedDay(day.date)}
            >
              {day.label}{" "}
              <span style={{ opacity: 0.7, fontSize: "11px" }}>
                {day.date.slice(5)}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {/* Entries for selected day */}
          {entriesForDay.length === 0 && !showAddForm && (
            <div className="empty-state">
              <p>No entries for this day</p>
            </div>
          )}

          {entriesForDay.map((entry) => (
            <div key={entry.id} className="entry-card">
              <div style={{ flex: 1 }}>
                <div className="entry-project">{entry.projectName}</div>
                <div className="entry-task">{entry.taskSummary || "—"}</div>
              </div>
              <div className="entry-hours">{entry.hoursWorked}h</div>
              {!isLocked && (
                <div className="entry-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => startEdit(entry)}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteModal(entry)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add / Edit Form */}
          {!isLocked &&
            (showAddForm ? (
              <div className="add-entry-form">
                <div className="add-entry-form-title">
                  {editEntry ? "Edit Entry" : "Add Entry"}
                </div>
                <form onSubmit={editEntry ? handleUpdateEntry : handleAddEntry}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Project</label>
                      <select
                        className="form-input"
                        value={form.projectId}
                        onChange={(e) =>
                          setForm({ ...form, projectId: e.target.value })
                        }
                      >
                        <option value="">Select project</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.projectName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hours (0.5 – 12)</label>
                      <input
                        className="form-input"
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="12"
                        value={form.hoursWorked}
                        onChange={(e) =>
                          setForm({ ...form, hoursWorked: e.target.value })
                        }
                        placeholder="8"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Task Summary</label>
                    <input
                      className="form-input"
                      type="text"
                      value={form.taskSummary}
                      onChange={(e) =>
                        setForm({ ...form, taskSummary: e.target.value })
                      }
                      placeholder="What did you work on?"
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" className="btn btn-primary btn-sm">
                      {editEntry ? "Update" : "Add Entry"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                className="btn btn-outline"
                style={{ marginTop: "12px" }}
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={15} /> Add Entry
              </button>
            ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <Modal
          title="Delete Entry"
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
            Are you sure you want to delete this entry for{" "}
            <strong>{deleteModal.projectName}</strong>?
          </p>
        </Modal>
      )}
    </Layout>
  );
}

export default Timesheet;
