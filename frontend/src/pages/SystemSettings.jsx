import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function SystemSettings({ onNavigate }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [dbStatus, setDbStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard/summary")
      .then((res) => {
        if (res.ok) setDbStatus("Connected & Healthy");
        else setDbStatus("Connection Error");
      })
      .catch(() => setDbStatus("Disconnected"));
  }, []);

  if (user?.role !== "admin") {
    return (
      <div style={{ padding: "40px 24px", maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", border: `1px solid ${theme === "dark" ? "#b91c1c" : "#fca5a5"}`, borderRadius: "8px", padding: "24px", color: theme === "dark" ? "#f87171" : "#991b1b" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>403 Forbidden: Access Restricted</h2>
          <p style={{ margin: "0 0 16px", fontSize: "14px" }}>
            System Settings are <strong>Admin-only</strong>. Your account (<code>{user?.username}</code>) is assigned the <strong>Officer</strong> role.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            style={{ padding: "8px 16px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "var(--bg-primary, #f8fafc)", minHeight: "calc(100vh - 50px)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
            System Specification &amp; Settings
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
            Platform specifications, environment metadata, and administrative controls.
          </p>
        </div>
        <span style={{ fontSize: "12px", backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", color: theme === "dark" ? "#f87171" : "#991b1b", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
          ADMIN ONLY
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Platform Info */}
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>ℹ️</div>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
            Platform Specifications
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
            <div><span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Application:</span> <strong>FRA Atlas System</strong></div>
            <div><span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Purpose:</span> Forest Rights Act WebGIS and Decision Support Platform</div>
            <div><span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Environment:</span> Development / Prototype</div>
          </div>
        </div>

        {/* Architecture & Tech Stack */}
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>💻</div>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
            Technology Stack
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
            <div><span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Frontend:</span> React + Vite + Leaflet</div>
            <div><span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Backend:</span> FastAPI + SQLAlchemy</div>
            <div><span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Database:</span> PostgreSQL + PostGIS Engine</div>
          </div>
        </div>

        {/* Dataset & Database Status */}
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🗄️</div>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
            Dataset &amp; Spatial Database
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
            <div><span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Dataset:</span> Synthetic Prototype Dataset</div>
            <div><span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Records:</span> 5,000 FRA Claims</div>
            <div>
              <span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Database Status: </span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: dbStatus.includes("Connected") ? "#16a34a" : "#dc2626" }}>
                ● {dbStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;
