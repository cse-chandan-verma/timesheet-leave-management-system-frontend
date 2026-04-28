import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* =========================
   AUTH
========================= */

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

/* =========================
   EMPLOYEE
========================= */

import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeTimesheet from "./pages/employee/Timesheet";
import EmployeeTimesheetHistory from "./pages/employee/TimesheetHistory";
import EmployeeLeave from "./pages/employee/Leave";
import EmployeeLeaveHistory from "./pages/employee/LeaveHistory";
import EmployeeHolidays from "./pages/employee/Holidays";
import EmployeeProfile from "./pages/employee/Profile";

/* =========================
   MANAGER
========================= */

import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerPendingTimesheets from "./pages/manager/PendingTimesheets";
import ManagerPendingLeaves from "./pages/manager/PendingLeaves";
import ManagerTeam from "./pages/manager/TeamOverview";
import ManageProjects from "./pages/manager/ManageProjects";

/* =========================
   ADMIN
========================= */

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/UserManagement";
import AdminHolidays from "./pages/admin/HolidayManagement";
import AdminNotifications from "./pages/admin/Notifications";
import AdminAudit from "./pages/admin/AuditLog";

/* =========================
   APP
========================= */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* =========================
              EMPLOYEE ROUTES
          ========================= */}

          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/timesheet"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                <EmployeeTimesheet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/timesheet-history"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                <EmployeeTimesheetHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/leave"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                <EmployeeLeave />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/leave-history"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                <EmployeeLeaveHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/holidays"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                <EmployeeHolidays />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />

          {/* =========================
              MANAGER ROUTES
          ========================= */}

          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/pending-timesheets"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
                <ManagerPendingTimesheets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/pending-leaves"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
                <ManagerPendingLeaves />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/team"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
                <ManagerTeam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/projects"
            element={
              <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
                <ManageProjects />
              </ProtectedRoute>
            }
          />

          {/* =========================
              ADMIN ROUTES
          ========================= */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/holidays"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminHolidays />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminNotifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/audit"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminAudit />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
