import React from "react";

export function DashboardBox({ children, className }) {
  return (
    <div className={className ? `dashboard-summary ${className}` : "dashboard-summary dashboard-box" }>
      {children}
    </div>
  );
}
export function DashboardChart({ children, className }) {
  return (
    <div className={className ? `dashboard-chart dashboard-box ${className}` : "dashboard-chart dashboard-box"}>
      {children}
    </div>
  );
}
export function DashboardTable({ children, className }) {
  return (
    <div className={className ? `dashboard-table dashboard-box dashboard-summary ${className}` : "dashboard-table dashboard-box dashboard-summary"}>
      {children}
    </div>
  );
}
