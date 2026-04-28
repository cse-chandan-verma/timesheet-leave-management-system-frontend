import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, loading } = useAuth();
  if (loading) return null;
  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "MANAGER")
      return <Navigate to="/manager/dashboard" replace />;
    return <Navigate to="/employee/dashboard" replace />;
  }
  return children;
}

export default ProtectedRoute;
