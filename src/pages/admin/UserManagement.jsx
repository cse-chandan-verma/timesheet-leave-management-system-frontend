import React, { useState, useEffect } from "react";
import { Users, Search } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import { getAllUsers, promoteUser, assignManager } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

const ROLES = ["EMPLOYEE", "MANAGER", "ADMIN"];

function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [managers, setManagers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    getAllUsers()
      .then((res) => {
        const all = res.data;
        setUsers(all);
        setFiltered(all);
        setManagers(all.filter((u) => u.role === "MANAGER"));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q),
      ),
    );
  }, [search, users]);

  function openPromote(u) {
    setModal(u);
    setNewRole(u.role);
  }

  function openAssignModal(u) {
    setAssignModal(u);
    setSelectedManagerId(u.managerId ? String(u.managerId) : "");
  }

  async function handlePromote() {
    if (newRole === modal.role) {
      setToast({ msg: "Role is already " + newRole, type: "warning" });
      return;
    }
    setPromoting(true);
    try {
      await promoteUser({ email: modal.email, role: newRole });
      setToast({
        msg: `${modal.fullName} is now ${newRole}. They must re-login.`,
        type: "success",
      });
      setModal(null);
      fetchUsers();
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Promote failed.",
        type: "error",
      });
    } finally {
      setPromoting(false);
    }
  }

  async function handleAssignManager() {
    if (!selectedManagerId) {
      setToast({ msg: "Please select a manager.", type: "error" });
      return;
    }
    setPromoting(true);
    try {
      await assignManager({
        employeeEmail: assignModal.email,
        managerId: Number(selectedManagerId),
      });
      setToast({ msg: `Manager assigned to ${assignModal.fullName}.`, type: "success" });
      setAssignModal(null);
      fetchUsers();
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Assign failed.", type: "error" });
    } finally {
      setPromoting(false);
    }
  }

  function getInitials(name) {
    return (
      name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"
    );
  }

  const roleBadge = (role) => {
    const map = {
      ADMIN: "badge-rejected",
      MANAGER: "badge-submitted",
      EMPLOYEE: "badge-approved",
    };
    return <span className={`badge ${map[role]}`}>{role}</span>;
  };

  return (
    <Layout>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">Manage employee roles and accounts</p>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div style={{ position: "relative", flex: 1, maxWidth: "320px" }}>
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)", display: "flex" }}>
              <Search size={15} />
            </span>
            <input
              className="form-input"
              style={{ paddingLeft: "34px" }}
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "auto" }}>
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={36} />
            <p>No users found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Code</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="user-avatar">{getInitials(u.fullName)}</div>
                        <span style={{ fontWeight: 500 }}>{u.fullName}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>
                      {u.employeeCode}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{u.email}</td>
                    <td>{roleBadge(u.role)}</td>
                    <td>
                      <span className="badge badge-approved">Active</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openPromote(u)}
                          disabled={u.email === currentUser?.email}
                          title={u.email === currentUser?.email ? "Cannot change your own role" : ""}
                        >
                          Change Role
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openAssignModal(u)}
                          disabled={u.role === "ADMIN" || u.role === "MANAGER"}
                          title={
                            u.role === "MANAGER"
                              ? "Cannot assign a manager to another manager"
                              : u.role === "ADMIN"
                              ? "Cannot assign a manager to admin"
                              : ""
                          }
                        >
                          Assign Manager
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

      {/* Change Role Modal */}
      {modal && (
        <Modal
          title="Change User Role"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handlePromote}
                disabled={promoting}
              >
                {promoting ? "Saving..." : "Save Role"}
              </button>
            </>
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div className="user-avatar" style={{ width: "42px", height: "42px", fontSize: "15px" }}>
              {modal.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "14px" }}>{modal.fullName}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{modal.email}</p>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Select New Role</label>
            <select
              className="form-input"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="alert alert-warning" style={{ marginBottom: 0 }}>
            User must logout and login again for the new role to take effect.
          </div>
        </Modal>
      )}

      {/* Assign Manager Modal */}
      {assignModal && (
        <Modal
          title="Assign Manager"
          onClose={() => setAssignModal(null)}
          footer={
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setAssignModal(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAssignManager}
                disabled={promoting || managers.length === 0}
              >
                {promoting ? "Saving..." : "Assign"}
              </button>
            </>
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div className="user-avatar" style={{ width: "42px", height: "42px", fontSize: "15px" }}>
              {assignModal.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "14px" }}>{assignModal.fullName}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{assignModal.email}</p>
              {assignModal.managerName && (
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Current Manager: <strong>{assignModal.managerName}</strong>
                </p>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Select Manager</label>
            {managers.length === 0 ? (
              <div className="alert alert-warning" style={{ marginBottom: 0 }}>
                No managers found. Please promote an employee to MANAGER role first.
              </div>
            ) : (
              <select
                className="form-input"
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
              >
                <option value="">-- Select a Manager --</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.email})
                  </option>
                ))}
              </select>
            )}
          </div>
        </Modal>
      )}
    </Layout>
  );
}

export default UserManagement;
