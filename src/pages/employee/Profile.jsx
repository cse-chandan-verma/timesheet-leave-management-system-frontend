import React, { useState, useEffect } from "react";
import { User, Mail, Hash, Shield, Save, Lock } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import { getProfile, updateProfile } from "../../api/authApi";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm((f) => ({ ...f, fullName: res.data.fullName }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
      setToast({ msg: "New passwords do not match.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const payload = { fullName: form.fullName };
      if (form.currentPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
        payload.confirmNewPassword = form.confirmNewPassword;
      }
      const res = await updateProfile(payload);
      setProfile(res.data);
      setToast({ msg: "Profile updated successfully!", type: "success" });
      setForm((f) => ({
        ...f,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Update failed.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <Layout>
        <LoadingSpinner fullPage />
      </Layout>
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
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">View and update your account details</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: "20px",
        }}
      >
        {/* Info Card */}
        <div className="card" style={{ height: "fit-content" }}>
          <div
            style={{
              textAlign: "center",
              paddingBottom: "20px",
              borderBottom: "1px solid var(--border-light)",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--secondary)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 700,
                margin: "0 auto 12px",
              }}
            >
              {profile?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <p style={{ fontWeight: 700, fontSize: "16px" }}>
              {profile?.fullName}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "4px",
              }}
            >
              {profile?.role}
            </p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Hash size={15} style={{ color: "var(--text-muted)" }} />
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Employee Code
                </p>
                <p style={{ fontWeight: 500 }}>{profile?.employeeCode}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Mail size={15} style={{ color: "var(--text-muted)" }} />
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Email
                </p>
                <p style={{ fontWeight: 500 }}>{profile?.email}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Shield size={15} style={{ color: "var(--text-muted)" }} />
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </p>
                <span
                  className={`badge ${profile?.isActive ?? profile?.active ? "badge-approved" : "badge-rejected"}`}
                >
                  {profile?.isActive ?? profile?.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Edit Profile</span>
          </div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-light)",
                    display: "flex",
                  }}
                >
                  <User size={15} />
                </span>
                <input
                  className="form-input"
                  style={{ paddingLeft: "38px" }}
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border-light)",
                marginTop: "8px",
                paddingTop: "20px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "16px",
                }}
              >
                <Lock size={12} style={{ marginRight: "6px" }} />
                Change Password (optional)
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Confirm new password"
                value={form.confirmNewPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmNewPassword: e.target.value })
                }
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
