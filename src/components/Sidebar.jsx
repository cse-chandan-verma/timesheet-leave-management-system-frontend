import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Calendar,
  User,
  Users,
  Bell,
  Settings,
  LogOut,
  ClipboardList,
  CalendarDays,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/components.css";

const employeeLinks = [
  {
    to: "/employee/dashboard",
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
  },
  { to: "/employee/timesheet", icon: <Clock size={18} />, label: "Timesheet" },
  {
    to: "/employee/timesheet-history",
    icon: <ClipboardList size={18} />,
    label: "TS History",
  },
  { to: "/employee/leave", icon: <Calendar size={18} />, label: "Leave" },
  {
    to: "/employee/leave-history",
    icon: <CalendarDays size={18} />,
    label: "Leave History",
  },
  {
    to: "/employee/holidays",
    icon: <CalendarDays size={18} />,
    label: "Holidays",
  },
  { to: "/employee/profile", icon: <User size={18} />, label: "Profile" },
];

const managerLinks = [
  {
    to: "/manager/dashboard",
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
  },
  {
    to: "/manager/pending-timesheets",
    icon: <Clock size={18} />,
    label: "Timesheets",
  },
  {
    to: "/manager/pending-leaves",
    icon: <Calendar size={18} />,
    label: "Leaves",
  },
  {
    to: "/manager/projects",
    icon: <Briefcase size={18} />,
    label: "Projects",
  },
  { to: "/manager/team", icon: <Users size={18} />, label: "Team" },
  { to: "/employee/profile", icon: <User size={18} />, label: "Profile" },
];

const adminLinks = [
  {
    to: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
  },
  { to: "/admin/users", icon: <Users size={18} />, label: "Users" },
  {
    to: "/admin/holidays",
    icon: <CalendarDays size={18} />,
    label: "Holidays",
  },
  {
    to: "/admin/notifications",
    icon: <Bell size={18} />,
    label: "Notifications",
  },
  { to: "/admin/audit", icon: <Settings size={18} />, label: "Audit Log" },
  { to: "/employee/profile", icon: <User size={18} />, label: "Profile" },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === "ADMIN"
      ? adminLinks
      : user?.role === "MANAGER"
        ? managerLinks
        : employeeLinks;

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">TMS</span>
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
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        <LogOut size={17} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
