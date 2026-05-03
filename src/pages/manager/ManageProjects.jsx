import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Search, Trash2 } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import { getProjects, createProject, deleteProject } from "../../api/timesheetApi";
import "../../styles/admin.css";

function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ projectName: "", projectCode: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      setToast({ msg: "Failed to load projects.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.projectName || !form.projectCode) {
      setToast({ msg: "Both project name and code are required.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      await createProject(form);
      setToast({ msg: "Project created successfully!", type: "success" });
      setIsModalOpen(false);
      setForm({ projectName: "", projectCode: "" });
      fetchProjects();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Failed to create project.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setSubmitting(true);
    try {
      const res = await deleteProject(deleteModal.id);
      setToast({ msg: res.data || `Project '${deleteModal.projectName}' deleted.`, type: "success" });
      setDeleteModal(null);
      fetchProjects();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Failed to delete project.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Project Management</h1>
          <p className="page-subtitle">View, create and delete projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div style={{ position: "relative", flex: 1, maxWidth: "320px" }}>
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)", display: "flex" }}>
              <Search size={15} />
            </span>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "34px" }}
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "auto" }}>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={36} />
            <p>{searchTerm ? "No projects match your search." : "No projects found."}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Project Code</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id}>
                    <td><span className="info-name">{p.projectName}</span></td>
                    <td style={{ fontWeight: 500, fontFamily: "monospace" }}>{p.projectCode}</td>
                    <td><span className="badge badge-approved">Active</span></td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteModal(p)}
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

      {/* Add Project Modal */}
      {isModalOpen && (
        <Modal
          title="Add New Project"
          onClose={() => setIsModalOpen(false)}
          footer={
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Project"}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Client Alpha - Phase 1"
                value={form.projectName}
                onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Project Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ALP-101"
                value={form.projectCode}
                onChange={(e) => setForm({ ...form, projectCode: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <Modal
          title="Delete Project"
          onClose={() => setDeleteModal(null)}
          footer={
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setDeleteModal(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </>
          }
        >
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Are you sure you want to delete project{" "}
            <strong style={{ color: "var(--text-main)" }}>{deleteModal.projectName}</strong>{" "}
            ({deleteModal.projectCode})?
          </p>
        </Modal>
      )}
    </Layout>
  );
}

export default ManageProjects;
