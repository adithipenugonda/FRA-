import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function OfficerDashboard({ onNavigate }) {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState("");

  // Modal state for viewing claim detail directly from Recent Claims table
  const [selectedClaim, setSelectedClaim] = useState(null);

  const fetchDashboardData = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/dashboard/summary")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard operational data");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNav = (target) => {
    if (!onNavigate) return;
    if (target.startsWith("/")) {
      onNavigate(target);
    } else {
      onNavigate(`/${target}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted, #475569)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        Loading Officer Operations Dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "20px", color: theme === "dark" ? "#f87171" : "#991b1b", backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", borderRadius: "6px", margin: "24px" }}>
        Error loading operational metrics: {error}
      </div>
    );
  }

  const pw = data.pending_workload || {};
  const recentClaims = data.recent_claims || [];
  const districtPending = data.district_pending_workload || [];

  // Find max pending count in top 5 for progress bar calculations
  const maxDistrictPending = districtPending.length > 0 ? Math.max(...districtPending.map((d) => d.pending_count)) : 1;

  return (
    <div style={{ padding: "24px", backgroundColor: "var(--bg-primary, #f8fafc)", minHeight: "calc(100vh - 50px)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Officer Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
              Officer Operations Dashboard
            </h1>
            <span style={{ fontSize: "11px", backgroundColor: "rgba(37, 99, 235, 0.15)", color: "#3b82f6", padding: "2px 8px", borderRadius: "12px", fontWeight: "700" }}>
              Operational Monitoring
            </span>
            <span style={{ fontSize: "11px", backgroundColor: theme === "dark" ? "#334155" : "#f1f5f9", color: "var(--text-muted, #475569)", padding: "2px 8px", borderRadius: "12px", fontWeight: "600" }}>
              Prototype Dataset
            </span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
            Track claim processing status, pending workloads, and geographical distribution.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted, #64748b)", fontWeight: "500" }}>
            Last refreshed: <strong style={{ color: "var(--text-main, #334155)" }}>{lastRefreshed}</strong>
          </span>
          <button
            type="button"
            onClick={fetchDashboardData}
            style={{
              padding: "5px 10px",
              fontSize: "12px",
              fontWeight: "600",
              backgroundColor: "var(--btn-secondary-bg, #ffffff)",
              border: "1px solid var(--btn-secondary-border, #cbd5e1)",
              borderRadius: "4px",
              cursor: "pointer",
              color: "var(--btn-secondary-text, #334155)",
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        <div onClick={() => handleNav("/claims")} style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)", cursor: "pointer" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Total Claims</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-main, #0f172a)", marginTop: "4px" }}>
            {data.total_claims.toLocaleString()}
          </div>
        </div>

        <div onClick={() => handleNav("/claims?status=Approved")} style={{ backgroundColor: "var(--bg-card, #ffffff)", border: `1px solid ${theme === "dark" ? "rgba(22, 163, 74, 0.4)" : "#bbf7d0"}`, borderLeft: "4px solid #16a34a", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)", cursor: "pointer" }}>
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#4ade80" : "#15803d", fontWeight: "600" }}>Approved</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#16a34a", marginTop: "4px" }}>
            {data.approved_claims.toLocaleString()}
          </div>
        </div>

        <div onClick={() => handleNav("/claims?status=Pending")} style={{ backgroundColor: "var(--bg-card, #ffffff)", border: `1px solid ${theme === "dark" ? "rgba(245, 158, 11, 0.4)" : "#fef08a"}`, borderLeft: "4px solid #f59e0b", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)", cursor: "pointer" }}>
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#fbbf24" : "#854d0e", fontWeight: "600" }}>Pending Action</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b", marginTop: "4px" }}>
            {data.pending_claims.toLocaleString()}
          </div>
        </div>

        <div onClick={() => handleNav("/claims?status=Rejected")} style={{ backgroundColor: "var(--bg-card, #ffffff)", border: `1px solid ${theme === "dark" ? "rgba(220, 38, 38, 0.4)" : "#fecaca"}`, borderLeft: "4px solid #dc2626", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)", cursor: "pointer" }}>
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#f87171" : "#991b1b", fontWeight: "600" }}>Rejected</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#dc2626", marginTop: "4px" }}>
            {data.rejected_claims.toLocaleString()}
          </div>
        </div>

        <div onClick={() => handleNav("/claims")} style={{ backgroundColor: "var(--bg-card, #ffffff)", border: `1px solid ${theme === "dark" ? "rgba(37, 99, 235, 0.4)" : "#bfdbfe"}`, borderLeft: "4px solid #2563eb", borderRadius: "8px", padding: "16px", boxShadow: "var(--card-shadow)", cursor: "pointer" }}>
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#60a5fa" : "#1e40af", fontWeight: "600" }}>Land Area</span>
          <div style={{ fontSize: "20px", fontWeight: "800", color: "#3b82f6", marginTop: "4px" }}>
            {data.total_land_area.toLocaleString()} <span style={{ fontSize: "12px" }}>Acres</span>
          </div>
        </div>
      </div>

      {/* Section 1: Quick Actions */}
      <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "16px", marginBottom: "24px", boxShadow: "var(--card-shadow)" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700", color: "var(--text-main, #334155)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Quick Operational Actions
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <button
            type="button"
            onClick={() => handleNav("/claims")}
            style={{
              padding: "12px 16px",
              backgroundColor: "var(--btn-secondary-bg, #f8fafc)",
              border: "1px solid var(--btn-secondary-border, #cbd5e1)",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              color: "var(--btn-secondary-text, #0f172a)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: "16px" }}>🔎</span> Search Claims
          </button>

          <button
            type="button"
            onClick={() => handleNav("/map")}
            style={{
              padding: "12px 16px",
              backgroundColor: "#2563eb",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
            }}
          >
            <span style={{ fontSize: "16px" }}>🗺️</span> View WebGIS Map
          </button>

          <button
            type="button"
            onClick={() => handleNav("/claims")}
            style={{
              padding: "12px 16px",
              backgroundColor: theme === "dark" ? "rgba(245, 158, 11, 0.2)" : "#fef3c7",
              border: `1px solid ${theme === "dark" ? "rgba(251, 191, 36, 0.4)" : "#fde68a"}`,
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              color: theme === "dark" ? "#fbbf24" : "#92400e",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "16px" }}>📋</span> View Pending Claims
          </button>

          <button
            type="button"
            onClick={() => handleNav("/analytics")}
            style={{
              padding: "12px 16px",
              backgroundColor: theme === "dark" ? "rgba(168, 85, 247, 0.2)" : "#f3e8ff",
              border: `1px solid ${theme === "dark" ? "rgba(192, 132, 252, 0.4)" : "#e9d5ff"}`,
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              color: theme === "dark" ? "#c084fc" : "#6b21a8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "16px" }}>📊</span> Open Analytics
          </button>
        </div>
      </div>

      {/* Main Grid: Section 2 (Pending Workload) & Section 4 (District Workload) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Section 2: Pending Workload */}
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "20px", boxShadow: "var(--card-shadow)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                Pending Workload Overview
              </h3>
              <span style={{ fontSize: "11px", backgroundColor: theme === "dark" ? "rgba(245, 158, 11, 0.2)" : "#fef3c7", color: theme === "dark" ? "#fbbf24" : "#b45309", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>
                Operational Status
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div style={{ backgroundColor: "var(--bg-primary, #f8fafc)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-color, #f1f5f9)" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted, #64748b)", fontWeight: "600", display: "block" }}>TOTAL PENDING</span>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#f59e0b" }}>
                  {pw.pending_claims ? pw.pending_claims.toLocaleString() : "0"}
                </span>
              </div>

              <div style={{ backgroundColor: theme === "dark" ? "rgba(234, 88, 12, 0.15)" : "#fff7ed", padding: "12px", borderRadius: "6px", border: `1px solid ${theme === "dark" ? "rgba(249, 115, 22, 0.3)" : "#ffedd5"}` }}>
                <span style={{ fontSize: "11px", color: theme === "dark" ? "#fb923c" : "#c2410c", fontWeight: "700", display: "block" }}>LONG-PENDING (180+ DAYS)</span>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#ea580c" }}>
                  {pw.long_pending_claims ? pw.long_pending_claims.toLocaleString() : "0"}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "16px", backgroundColor: "var(--bg-primary, #f8fafc)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-color, #f1f5f9)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                <span style={{ color: "var(--text-muted, #64748b)", fontWeight: "600" }}>AVG PENDING DURATION</span>
                <span style={{ fontWeight: "800", color: "var(--text-main, #0f172a)" }}>
                  {pw.average_pending_days ? `${pw.average_pending_days} days` : "N/A"}
                </span>
              </div>
            </div>

            {/* Section 5: Pending IFR/CFR Breakdown */}
            <div style={{ backgroundColor: "var(--bg-primary, #f1f5f9)", padding: "10px 14px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", marginBottom: "16px" }}>
              <span style={{ fontWeight: "600", color: "var(--text-muted, #475569)" }}>Pending Claims by Type:</span>
              <div style={{ display: "flex", gap: "12px", fontWeight: "700" }}>
                <span style={{ color: "#a855f7" }}>IFR: {pw.pending_ifr ? pw.pending_ifr.toLocaleString() : 0}</span>
                <span style={{ color: "#14b8a6" }}>CFR: {pw.pending_cfr ? pw.pending_cfr.toLocaleString() : 0}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNav("/claims")}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#d97706",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(217, 119, 6, 0.3)",
            }}
          >
            View Pending Claims &rarr;
          </button>
        </div>

        {/* Section 4: District Pending Workload (Top 5) */}
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "20px", boxShadow: "var(--card-shadow)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                District Pending Workload
              </h3>
              <span style={{ fontSize: "11px", backgroundColor: theme === "dark" ? "#334155" : "#f1f5f9", color: "var(--text-muted, #475569)", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>
                Top 5 Districts
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {districtPending.length === 0 ? (
                <div style={{ fontSize: "13px", color: "var(--text-muted, #64748b)", textAlign: "center", padding: "20px" }}>
                  No district pending workload data available.
                </div>
              ) : (
                districtPending.map((item, idx) => {
                  const pct = Math.min(100, Math.round((item.pending_count / maxDistrictPending) * 100));
                  return (
                    <div key={item.district || idx} style={{ fontSize: "13px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "600", color: "var(--text-main, #0f172a)" }}>{item.district}</span>
                        <span style={{ fontWeight: "700", color: "#f59e0b" }}>{item.pending_count} pending</span>
                      </div>
                      <div style={{ height: "6px", width: "100%", backgroundColor: "var(--chart-track, #f1f5f9)", borderRadius: "3px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            backgroundColor: "#f59e0b",
                            borderRadius: "3px",
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNav("/claims")}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "var(--btn-secondary-bg, #f8fafc)",
              border: "1px solid var(--btn-secondary-border, #cbd5e1)",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--btn-secondary-text, #334155)",
              cursor: "pointer",
            }}
          >
            Explore District Workloads &rarr;
          </button>
        </div>
      </div>

      {/* Section 3: Recent Claims */}
      <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
              Recent Claim Submissions
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted, #64748b)" }}>
              5 most recently submitted claims (sorted by submission date)
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleNav("/claims")}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "700",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            View All Claims &rarr;
          </button>
        </div>

        {recentClaims.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted, #64748b)", fontSize: "13px" }}>
            No recent claims available.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--table-header-bg, #f1f5f9)", borderBottom: "1px solid var(--table-border, #e2e8f0)", color: "var(--text-muted, #475569)", fontWeight: "700" }}>
                  <th style={{ padding: "10px 12px" }}>Claim ID</th>
                  <th style={{ padding: "10px 12px" }}>District</th>
                  <th style={{ padding: "10px 12px" }}>Type</th>
                  <th style={{ padding: "10px 12px" }}>Status</th>
                  <th style={{ padding: "10px 12px" }}>Submitted Date</th>
                  <th style={{ padding: "10px 12px" }}>Land Area</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr
                    key={claim.claim_id}
                    onClick={() => setSelectedClaim(claim)}
                    style={{
                      borderBottom: "1px solid var(--table-border, #f1f5f9)",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--table-row-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: "700", color: "#3b82f6" }}>{claim.claim_id}</td>
                    <td style={{ padding: "10px 12px", color: "var(--text-main, #0f172a)" }}>{claim.district}</td>
                    <td style={{ padding: "10px 12px", fontWeight: "600", color: claim.claim_type === "IFR" ? "#a855f7" : "#14b8a6" }}>
                      {claim.claim_type}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            claim.status === "Approved"
                              ? theme === "dark" ? "rgba(22, 163, 74, 0.2)" : "#dcfce7"
                              : claim.status === "Pending"
                              ? theme === "dark" ? "rgba(245, 158, 11, 0.2)" : "#fef9c3"
                              : theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2",
                          color:
                            claim.status === "Approved"
                              ? theme === "dark" ? "#4ade80" : "#15803d"
                              : claim.status === "Pending"
                              ? theme === "dark" ? "#fbbf24" : "#a16207"
                              : theme === "dark" ? "#f87171" : "#b91c1c",
                        }}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted, #475569)", fontWeight: "500" }}>{claim.submission_date}</td>
                    <td style={{ padding: "10px 12px", color: "var(--text-main, #0f172a)" }}>{claim.land_area_acres} Acres</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Claim Detail Modal for Quick Inspection */}
      {selectedClaim && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "var(--modal-overlay, rgba(15, 23, 42, 0.6))",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
            padding: "20px",
          }}
          onClick={() => setSelectedClaim(null)}
        >
          <div
            style={{
              backgroundColor: "var(--modal-bg, #ffffff)",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
              border: "1px solid var(--border-color, #e2e8f0)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ backgroundColor: "var(--bg-header, #1e293b)", color: "#ffffff", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Claim Quick Detail: {selectedClaim.claim_id}</h3>
              <button type="button" onClick={() => setSelectedClaim(null)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}>&times;</button>
            </div>
            <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
              <div><span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", display: "block" }}>DISTRICT</span><strong style={{ color: "var(--text-main)" }}>{selectedClaim.district}</strong></div>
              <div><span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", display: "block" }}>STATUS</span><strong style={{ color: "var(--text-main)" }}>{selectedClaim.status}</strong></div>
              <div><span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", display: "block" }}>CLAIM TYPE</span><strong style={{ color: "var(--text-main)" }}>{selectedClaim.claim_type}</strong></div>
              <div><span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", display: "block" }}>LAND AREA</span><strong style={{ color: "var(--text-main)" }}>{selectedClaim.land_area_acres} Acres</strong></div>
              <div><span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", display: "block" }}>SUBMITTED DATE</span><strong style={{ color: "var(--text-main)" }}>{selectedClaim.submission_date}</strong></div>
            </div>
            <div style={{ backgroundColor: "var(--bg-primary, #f8fafc)", padding: "12px 20px", borderTop: "1px solid var(--border-color, #e2e8f0)", display: "flex", justifyContent: "space-between" }}>
              <button type="button" onClick={() => setSelectedClaim(null)} style={{ padding: "6px 14px", backgroundColor: "var(--btn-secondary-bg, #ffffff)", border: "1px solid var(--btn-secondary-border, #cbd5e1)", color: "var(--btn-secondary-text)", borderRadius: "4px", cursor: "pointer" }}>Close</button>
              <button type="button" onClick={() => { setSelectedClaim(null); handleNav("/claims"); }} style={{ padding: "6px 14px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}>Go to Claims Page &rarr;</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfficerDashboard;
