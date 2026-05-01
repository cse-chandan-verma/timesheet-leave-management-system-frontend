import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { resetPassword } from "../../api/authApi";
import "../../styles/auth.css";

function ForgotPassword() {
  const [form, setForm] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email: form.email, newPassword: form.newPassword });
      navigate("/login", { state: { message: "Password reset successful. Please sign in." } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-text">TMS Portal</span>
          <span className="auth-logo-sub">Timesheet &amp; Leave Management System</span>
        </div>
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your email and set a new password</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Registered Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="input-wrapper">
              <input
                className="form-input input-with-icon-right"
                type={showNew ? "text" : "password"}
                name="newPassword"
                placeholder="Min. 6 characters"
                value={form.newPassword}
                onChange={handleChange}
              />
              <span className="input-icon-right" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div className="input-wrapper">
              <input
                className="form-input input-with-icon-right"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <span className="input-icon-right" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
          </div>
          <button type="submit" className="btn btn-dark btn-block" disabled={loading}>
            <KeyRound size={16} />
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="auth-link">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
