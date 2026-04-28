import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(form);
      const data = res.data;
      login(data.token, {
        employeeId: data.employeeId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });
      if (data.role === "ADMIN") return navigate("/admin/dashboard");
      if (data.role === "MANAGER") return navigate("/manager/dashboard");
      navigate("/employee/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
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
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>
        {error && <div className="alert alert-error">{error}</div>}
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
          <div style={{ textAlign: "right", marginBottom: "16px" }}>
            <Link to="/forgot-password" style={{ fontSize: "12px" }}>
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-dark btn-block"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
