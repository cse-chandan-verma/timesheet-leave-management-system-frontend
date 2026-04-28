import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Search } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import { getProjects, createProject } from "../../api/timesheetApi";
import "../../styles/admin.css";

function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    projectName: "",
    projectCode: "",
  });

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

  const filteredProjects = projects.filter(
    (p) =>
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div>
          <h1 className="page-title">Project Management</h1>
          <p className="page-subtitle">View and register new projects in the system</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="card">
        <div className="search-bar" style={{ marginBottom: "20px" }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search projects by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="info-row">
                        <span className="info-name">{p.projectName}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{p.projectCode}</td>
                    <td>
                      <span className="status-badge approved">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          title="Add New Project"
          onClose={() => setIsModalOpen(false)}
          footer={
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setIsModalOpen(false)}
              >
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
          <form className="admin-form" onSubmit={handleSubmit}>
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
    </Layout>
  );
}

export default ManageProjects;
