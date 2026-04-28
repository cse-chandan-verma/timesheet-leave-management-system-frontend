import React from "react";

function StatusBadge({ status }) {
  const map = {
    DRAFT: "badge-draft",
    SUBMITTED: "badge-submitted",
    APPROVED: "badge-approved",
    REJECTED: "badge-rejected",
    CANCELLED: "badge-cancelled",
  };
  return (
    <span className={`badge ${map[status] || "badge-draft"}`}>{status}</span>
  );
}

export default StatusBadge;
