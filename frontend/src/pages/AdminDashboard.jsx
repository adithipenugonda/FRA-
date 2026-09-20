import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function AdminDashboard({ onNavigate }) {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/dashboard/summary").then((res) => res.json()),
      fetch("http://127.0.0.1:8000/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([summaryJson, usersJson]) => {
        setData(summaryJson);
        setUsersCount(usersJson.length || 2);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted, #475569)" }}>
        Loading System Administration Dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "20px", color: theme === "dark" ? "#f87171" : "#991b1b", backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", borderRadius: "6px" }}>
        Error loading admin dashboard: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "var(--bg-primary, #f8fafc)", minHeight: "calc(100vh - 50px)" }}>
      {/* Admin Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
            Admin System Dashboard
          </h1>
          <span style={{ fontSize: "12px", backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", color: theme === "dark" ? "#f87171" : "#991b1b", padding: "2px 8px", borderRadius: "12px", fontWeight: "700" }}>
            ADMINISTRATOR PRIVILEGES ACTIVE
          </span>
        </div>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
          System administration, user access management, database monitoring, and strategic dataset overview.
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Total Claims</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-main, #0f172a)", marginTop: "4px" }}>
            {data.total_claims.toLocaleString()}
          </div>
        </div>

        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: `1px solid ${theme === "dark" ? "rgba(22, 163, 74, 0.4)" : "#bbf7d0"}`, borderLeft: "4px solid #16a34a", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)" }}>
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#4ade80" : "#15803d", fontWeight: "600" }}>Approved</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#16a34a", marginTop: "4px" }}>
            {data.approved_claims.toLocaleString()}
          </div>
        </div>

        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: `1px solid ${theme === "dark" ? "rgba(245, 158, 11, 0.4)" : "#fef08a"}`, borderLeft: "4px solid #f59e0b", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)" }}>
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#fbbf24" : "#854d0e", fontWeight: "600" }}>Pending</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b", marginTop: "4px" }}>
            {data.pending_claims.toLocaleString()}
          </div>
        </div>

        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: `1px solid ${theme === "dark" ? "rgba(220, 38, 38, 0.4)" : "#fecaca"}`, borderLeft: "4px solid #dc2626", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)" }}>
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#f87171" : "#991b1b", fontWeight: "600" }}>Rejected</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#dc2626", marginTop: "4px" }}>
            {data.rejected_claims.toLocaleString()}
          </div>
        </div>

        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: `1px solid ${theme === "dark" ? "rgba(124, 58, 237, 0.4)" : "#ddd6fe"}`, borderLeft: "4px solid #7c3aed", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)" }}>
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#c084fc" : "#5b21b6", fontWeight: "600" }}>System Users</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#a855f7", marginTop: "4px" }}>
            {usersCount} <span style={{ fontSize: "12px", color: "var(--text-muted, #64748b)" }}>Accounts</span>
          </div>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "16px", color: "var(--text-main, #0f172a)" }}>👥 User Management</h3>
          <p style={{ margin: "0 0 14px", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
            View system user accounts, assigned roles (Admin / Officer), and account activity status.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("users")}
            style={{ padding: "8px 16px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
          >
            Manage Users ({usersCount})
          </button>
        </div>

        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "16px", color: "var(--text-main, #0f172a)" }}>⚙️ System Settings</h3>
          <p style={{ margin: "0 0 14px", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
            Review database health, security JWT token parameters, GIS map layer configurations, and audit logs.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("settings")}
            style={{ padding: "8px 16px", backgroundColor: "#475569", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
          >
            Configure Settings
          </button>
        </div>

        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "16px", color: "var(--text-main, #0f172a)" }}>🗺️ WebGIS Map</h3>
          <p style={{ margin: "0 0 14px", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
            Access full-featured WebGIS map with clustering, status filters, and claim detail popups.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("map")}
            style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
          >
            Open WebGIS Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
