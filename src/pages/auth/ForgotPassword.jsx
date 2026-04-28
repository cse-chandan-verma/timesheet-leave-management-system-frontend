import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { forgotPassword } from "../../api/authApi";
import "../../styles/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setSuccess(res.data);
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
          <span className="auth-logo-text">TMS</span>
          <span className="auth-logo-sub">Timesheet & Leave Management</span>
        </div>
        <h2 className="auth-title">Reset password</h2>
        <p className="auth-subtitle">
          Enter your email and we'll send you a reset link
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={15} />
              </span>
              <input
                className="form-input input-with-icon"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-dark btn-block"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="auth-link">
          <Link to="/login">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
