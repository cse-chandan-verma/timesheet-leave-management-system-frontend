import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Calendar,
  User,
  Users,
  Bell,
  LogOut,
  ClipboardList,
  CalendarDays,
  Briefcase,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/components.css";

const employeeLinks = [
  { to: "/employee/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/employee/timesheet", icon: <Clock size={18} />, label: "Timesheet" },
  { to: "/employee/timesheet-history", icon: <ClipboardList size={18} />, label: "TS History" },
  { to: "/employee/leave", icon: <Calendar size={18} />, label: "Leave" },
  { to: "/employee/leave-history", icon: <CalendarDays size={18} />, label: "Leave History" },
  { to: "/employee/holidays", icon: <CalendarDays size={18} />, label: "Holidays" },
  { to: "/employee/profile", icon: <User size={18} />, label: "Profile" },
];

const managerLinks = [
  { to: "/manager/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/manager/pending-timesheets", icon: <Clock size={18} />, label: "Timesheets" },
  { to: "/manager/pending-leaves", icon: <Calendar size={18} />, label: "Leaves" },
  { to: "/manager/projects", icon: <Briefcase size={18} />, label: "Projects" },
  { to: "/manager/team", icon: <Users size={18} />, label: "Team" },
  { to: "/employee/profile", icon: <User size={18} />, label: "Profile" },
];

const adminLinks = [
  { to: "/admin/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/admin/users", icon: <Users size={18} />, label: "Users" },
  { to: "/admin/holidays", icon: <CalendarDays size={18} />, label: "Holidays" },
  { to: "/admin/notifications", icon: <Bell size={18} />, label: "Notifications" },
  { to: "/employee/profile", icon: <User size={18} />, label: "Profile" },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links =
    user?.role === "ADMIN"
      ? adminLinks
      : user?.role === "MANAGER"
        ? managerLinks
        : employeeLinks;

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="mobile-menu-btn" onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
        <span className="mobile-topbar-title">TMS</span>
        <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{initials}</div>
      </div>

      {/* Overlay */}
      {open && <div className="sidebar-overlay" onClick={close} />}

      <aside className={`sidebar${open ? " sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="sidebar-logo-text">TMS</span>
            <button className="sidebar-close-btn" onClick={close}>
              <X size={18} />
            </button>
          </div>
          <span className="sidebar-logo-sub">Management</span>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.fullName}</p>
            <p className="sidebar-user-role">{user?.role}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={close}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              <span className="sidebar-link-label">{link.label}</span>
              <ChevronRight size={14} className="sidebar-link-arrow" />
            </NavLink>
          ))}
        </nav>

        <button
          className="sidebar-logout"
          onClick={() => { logout(); navigate("/login"); close(); }}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
