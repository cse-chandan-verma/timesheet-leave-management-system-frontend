import React, { useState, useEffect } from "react";
import { Users, Search } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import { getAllUsers, promoteUser } from "../../api/authApi";
import "../../styles/admin.css";

const ROLES = ["EMPLOYEE", "MANAGER", "ADMIN"];

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    getAllUsers()
      .then((res) => {
        setUsers(res.data);
        setFiltered(res.data);
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

  function getInitials(name) {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
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
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">Manage employee roles and accounts</p>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div style={{ position: "relative", flex: 1, maxWidth: "320px" }}>
            <span
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-light)",
                display: "flex",
              }}
            >
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
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              marginLeft: "auto",
            }}
          >
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div className="user-avatar">
                          {getInitials(u.fullName)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.fullName}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "monospace",
                      }}
                    >
                      {u.employeeCode}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{u.email}</td>
                    <td>{roleBadge(u.role)}</td>
                    <td>
                      <span
                        className={`badge ${u.isActive ?? u.active ? "badge-approved" : "badge-rejected"}`}
                      >
                        {u.isActive ?? u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openPromote(u)}
                      >
                        Change Role
                      </button>
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
          title="Change User Role"
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
                className="btn btn-primary btn-sm"
                onClick={handlePromote}
                disabled={promoting}
              >
                {promoting ? "Saving..." : "Save Role"}
              </button>
            </>
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div
              className="user-avatar"
              style={{ width: "42px", height: "42px", fontSize: "15px" }}
            >
              {modal.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "14px" }}>
                {modal.fullName}
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {modal.email}
              </p>
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
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="alert alert-warning" style={{ marginBottom: 0 }}>
            User must logout and login again for the new role to take effect.
          </div>
        </Modal>
      )}
    </Layout>
  );
}

export default UserManagement;
