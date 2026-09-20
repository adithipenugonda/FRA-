import React from "react";
import { useTheme } from "../context/ThemeContext";

function AIDSS() {
  const { theme } = useTheme();

  const modules = [
    {
      title: "Implementation Priority Analysis",
      description: "Automated ranking and spatial prioritization of pending FRA claims based on pendency duration, area size, and ecological sensitivity.",
      icon: "🎯",
    },
    {
      title: "Predictive Analytics",
      description: "Forecasting claim approval rates, processing bottlenecks, and mandal-level pendency trends using machine learning.",
      icon: "📈",
    },
    {
      title: "Duplicate Claim Detection",
      description: "Geospatial overlap detection and claimant identity deduplication algorithms to prevent double allocation of forest land.",
      icon: "🔍",
    },
    {
      title: "Explainable AI",
      description: "Interpretable decision justification models providing transparent rationale for claim prioritization and risk scoring.",
      icon: "🧠",
    },
  ];

  return (
    <div style={{ padding: "24px", backgroundColor: "var(--bg-primary, #f8fafc)", minHeight: "calc(100vh - 50px)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
          AI &amp; Decision Support System (DSS)
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
          Intelligent analytical modules for Forest Rights Act decision support and operational prioritization.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {modules.map((m, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "var(--bg-card, #ffffff)",
              border: "1px solid var(--border-color, #e2e8f0)",
              borderRadius: "10px",
              padding: "24px",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{m.icon}</div>
              <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                {m.title}
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-muted, #64748b)", lineHeight: "1.5" }}>
                {m.description}
              </p>
            </div>

            <div>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: "700",
                  backgroundColor: theme === "dark" ? "rgba(245, 158, 11, 0.2)" : "#fef3c7",
                  color: theme === "dark" ? "#fbbf24" : "#d97706",
                  border: `1px solid ${theme === "dark" ? "rgba(251, 191, 36, 0.4)" : "#fde68a"}`,
                  padding: "3px 10px",
                  borderRadius: "4px",
                }}
              >
                Module under development
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIDSS;
