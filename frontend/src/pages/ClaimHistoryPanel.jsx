import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function ClaimHistoryPanel({ claimId }) {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [newStatus, setNewStatus] = useState("Pending");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    if (!claimId || !token) return;
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/claims/${claimId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to load claim history");
      const data = await response.json();
      setHistory(data || []);
    } catch (err) {
      setError(err.message || "Unable to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [claimId, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!claimId || !token) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`http://127.0.0.1:8000/claims/${claimId}/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_status: newStatus, remarks }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Status update failed");
      setRemarks("");
      await fetchHistory();
    } catch (err) {
      setError(err.message || "Unable to update claim status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
      <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>Claim History / Status Tracking</h3>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "minmax(150px, 180px) 1fr auto", gap: "12px", marginBottom: "20px" }}>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--border-color, #cbd5e1)", backgroundColor: "var(--input-bg, #fff)", color: "var(--input-text, #0f172a)" }}>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="In Review">In Review</option>
          <option value="Field Verification">Field Verification</option>
        </select>
        <input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add remarks / reason" style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-color, #cbd5e1)", backgroundColor: "var(--input-bg, #fff)", color: "var(--input-text, #0f172a)" }} />
        <button type="submit" disabled={submitting} style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#2563eb", color: "#fff", border: "none", cursor: submitting ? "not-allowed" : "pointer", fontWeight: "700" }}>
          {submitting ? "Updating..." : "Add Update"}
        </button>
      </form>

      {error && <div style={{ marginBottom: "10px", color: "#dc2626", fontWeight: "600" }}>{error}</div>}

      {loading ? (
        <div style={{ color: "var(--text-muted, #64748b)", fontSize: "13px" }}>Loading history...</div>
      ) : history.length === 0 ? (
        <div style={{ color: "var(--text-muted, #64748b)", fontSize: "13px" }}>No history recorded for this claim.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {history.map((item) => (
            <div key={item.id} style={{ position: "relative", paddingLeft: "18px", borderLeft: "2px solid #cbd5e1" }}>
              <div style={{ position: "absolute", left: "-7px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: item.new_status === "Approved" ? "#16a34a" : item.new_status === "Rejected" ? "#dc2626" : "#f59e0b" }} />
              <div style={{ fontSize: "13px", color: "var(--text-main, #0f172a)", fontWeight: "700" }}>
                {item.previous_status || "Initial"} → {item.new_status}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted, #64748b)", marginTop: "4px" }}>
                {item.changed_at ? new Date(item.changed_at).toLocaleString() : "Unknown time"} • Officer/User: {item.changed_by || "System"}
              </div>
              {item.remarks && <div style={{ fontSize: "12px", color: "var(--text-muted, #475569)", marginTop: "5px" }}>{item.remarks}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClaimHistoryPanel;
