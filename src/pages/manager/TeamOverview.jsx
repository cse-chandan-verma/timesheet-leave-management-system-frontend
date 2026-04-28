import React, { useState, useEffect } from "react";
import { Users, Search } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllUsers } from "../../api/authApi";
import "../../styles/admin.css";

function TeamOverview() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        setUsers(res.data);
        setFiltered(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.employeeCode.toLowerCase().includes(q),
      ),
    );
  }, [search, users]);

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
    return (
      <span className={`badge ${map[role] || "badge-draft"}`}>{role}</span>
    );
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Team Overview</h1>
        <p className="page-subtitle">All registered users in the system</p>
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
              placeholder="Search by name, email or code..."
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
                        className={`badge ${u.isActive ? "badge-approved" : "badge-rejected"}`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default TeamOverview;
