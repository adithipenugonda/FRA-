import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://127.0.0.1:8000";

function ReportsPage() {
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateReport = async () => {
    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ report_type: "overall" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to generate report");
      setReport(data);
    } catch (err) {
      setError(err.message || "Report generation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [token]);

  if (loading && !report) {
    return <div style={{ padding: "24px", fontSize: "15px", color: "var(--text-muted, #64748b)" }}>Generating FRA Atlas report...</div>;
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "var(--bg-primary, #f8fafc)", minHeight: "calc(100vh - 50px)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>AI Claims Report</h1>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>Generated from live PostgreSQL claims data.</p>
        </div>
        <button type="button" onClick={generateReport} style={{ padding: "10px 16px", borderRadius: "8px", backgroundColor: "#2563eb", color: "#fff", border: "none", cursor: "pointer", fontWeight: "700" }}>
          Generate Report
        </button>
      </div>

      {error && <div style={{ marginBottom: "12px", color: "#dc2626", fontWeight: "600" }}>{error}</div>}

      {report && (
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "12px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ margin: "0 0 10px", fontSize: "20px", color: "var(--text-main, #0f172a)" }}>{report.title}</h2>
          <div style={{ fontSize: "12px", color: "var(--text-muted, #64748b)", marginBottom: "18px" }}>Generated at: {report.generated_at}</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px" }}>
            <MetricCard label="Total Claims" value={report.total_claims} />
            <MetricCard label="Approved" value={report.approved_count} accent="#16a34a" />
            <MetricCard label="Pending" value={report.pending_count} accent="#f59e0b" />
            <MetricCard label="Rejected" value={report.rejected_count} accent="#dc2626" />
            <MetricCard label="IFR" value={report.ifr_count} accent="#a855f7" />
            <MetricCard label="CFR" value={report.cfr_count} accent="#14b8a6" />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <h3 style={{ margin: "0 0 10px", color: "var(--text-main, #0f172a)" }}>Summary</h3>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted, #475569)", lineHeight: "1.6" }}>{report.summary}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
            <div>
              <h3 style={{ margin: "0 0 10px" }}>District Stats</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--table-header-bg, #f1f5f9)" }}>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>District</th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Total</th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {(report.district_statistics || []).slice(0, 6).map((item) => (
                    <tr key={item.district}>
                      <td style={{ padding: "8px 10px" }}>{item.district}</td>
                      <td style={{ padding: "8px 10px" }}>{item.total_count}</td>
                      <td style={{ padding: "8px 10px" }}>{item.pending_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 style={{ margin: "0 0 10px" }}>Processing Statistics</h3>
              <div style={{ fontSize: "13px", lineHeight: "1.8", color: "var(--text-main, #0f172a)" }}>
                <div>Average processing days: {report.processing_statistics?.average_processing_days ?? 0}</div>
                <div>Average pending days: {report.processing_statistics?.average_pending_days ?? 0}</div>
              </div>
              <h3 style={{ margin: "18px 0 10px" }}>Observations</h3>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "var(--text-muted, #475569)", lineHeight: "1.7" }}>
                {(report.observations || []).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, accent = "#2563eb" }) {
  return (
    <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "14px", boxShadow: "var(--card-shadow)" }}>
      <div style={{ fontSize: "11px", color: "var(--text-muted, #64748b)", textTransform: "uppercase", fontWeight: "700" }}>{label}</div>
      <div style={{ marginTop: "8px", fontSize: "22px", fontWeight: "800", color: accent }}>{value}</div>
    </div>
  );
}

export default ReportsPage;
