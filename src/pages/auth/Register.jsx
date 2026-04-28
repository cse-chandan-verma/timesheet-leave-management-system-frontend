import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Hash, Eye, EyeOff } from "lucide-react";
import { registerUser } from "../../api/authApi";
import "../../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeCode: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.employeeCode || !form.fullName || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(form);
      setSuccess(res.data);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
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
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Register as a new employee</p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Employee Code</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Hash size={15} />
              </span>
              <input
                className="form-input input-with-icon"
                type="text"
                name="employeeCode"
                placeholder="EMP001"
                value={form.employeeCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <User size={15} />
              </span>
              <input
                className="form-input input-with-icon"
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={15} />
              </span>
              <input
                className="form-input input-with-icon"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={15} />
              </span>
              <input
                className="form-input input-with-icon"
                type={showPw ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="input-eye"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={15} />
              </span>
              <input
                className="form-input input-with-icon"
                type={showCpw ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="input-eye"
                onClick={() => setShowCpw(!showCpw)}
              >
                {showCpw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-dark btn-block"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
