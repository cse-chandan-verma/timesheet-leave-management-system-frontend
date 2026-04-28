import React from "react";
import "../styles/components.css";

function LoadingSpinner({ fullPage = false }) {
  if (fullPage)
    return (
      <div className="spinner-fullpage">
        <div className="spinner" />
      </div>
    );
  return <div className="spinner" />;
}

export default LoadingSpinner;
