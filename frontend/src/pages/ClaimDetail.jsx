import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function createMiniMarkerIcon(status) {
  let color = "#2563eb";
  if (status === "Approved") color = "#16a34a";
  else if (status === "Pending") color = "#f59e0b";
  else if (status === "Rejected") color = "#dc2626";

  return L.divIcon({
    className: "mini-claim-marker",
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function ClaimDetail({ claimId, onNavigate }) {
  const { theme } = useTheme();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!claimId) return;

    setLoading(true);
    setError(null);
    fetch(`http://127.0.0.1:8000/claims/${claimId}`)
      .then((res) => {
        if (res.status === 404) throw new Error("Claim not found");
        if (!res.ok) throw new Error(`Unable to load claim details (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setClaim(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Claim not found");
        setLoading(false);
      });
  }, [claimId]);

  const handleBackToClaims = () => {
    if (onNavigate) {
      onNavigate("/claims");
    } else {
      window.history.pushState({}, "", "/claims");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const handleViewOnWebGIS = () => {
    if (onNavigate) {
      onNavigate(`/map?claimId=${claimId}`);
    } else {
      window.history.pushState({}, "", `/map?claimId=${claimId}`);
      window.dispatchEvent(new Event("popstate"));
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted, #64748b)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        Loading claim details...
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div style={{ padding: "40px 24px", maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", border: `1px solid ${theme === "dark" ? "#b91c1c" : "#fca5a5"}`, color: theme === "dark" ? "#f87171" : "#991b1b", padding: "24px", borderRadius: "10px" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "700" }}>Claim Not Found</h3>
          <p style={{ margin: "0 0 16px", fontSize: "14px" }}>
            The requested claim identifier (<code>{claimId}</code>) does not exist in the database.
          </p>
          <button
            type="button"
            onClick={handleBackToClaims}
            style={{ padding: "8px 16px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
          >
            &larr; Back to Claims
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    let bg = theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2";
    let color = theme === "dark" ? "#f87171" : "#b91c1c";

    if (status === "Approved") {
      bg = theme === "dark" ? "rgba(22, 163, 74, 0.2)" : "#dcfce7";
      color = theme === "dark" ? "#4ade80" : "#15803d";
    } else if (status === "Pending") {
      bg = theme === "dark" ? "rgba(245, 158, 11, 0.2)" : "#fef9c3";
      color = theme === "dark" ? "#fbbf24" : "#a16207";
    }

    return (
      <span
        style={{
          fontSize: "12px",
          fontWeight: "700",
          padding: "4px 12px",
          borderRadius: "6px",
          backgroundColor: bg,
          color: color,
        }}
      >
        {status}
      </span>
    );
  };

  const hasCoords = claim.latitude !== null && claim.longitude !== null;
  const miniMapCenter = hasCoords ? [claim.latitude, claim.longitude] : [17.4, 78.5];

  return (
    <div style={{ padding: "24px", backgroundColor: "var(--bg-primary, #f8fafc)", minHeight: "calc(100vh - 50px)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Top Header Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <button
            type="button"
            onClick={handleBackToClaims}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
              marginBottom: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            &larr; Back to Claims
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
              Claim Overview: {claim.claim_id}
            </h1>
            {getStatusBadge(claim.status)}
          </div>
        </div>

        <button
          type="button"
          onClick={handleViewOnWebGIS}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "700",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
          }}
        >
          🗺️ View on Map &rarr;
        </button>
      </div>

      {/* Grid Layout: Specification Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Card 1: Overview */}
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#3b82f6", borderBottom: "1px solid var(--border-color, #e2e8f0)", paddingBottom: "8px" }}>
            📋 Claim Overview
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>CLAIMANT NAME</span>
              <strong style={{ color: "var(--text-main, #0f172a)", fontSize: "15px" }}>{claim.claimant_name || "—"}</strong>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>CLAIM TYPE</span>
                <span style={{ fontWeight: "700", color: claim.claim_type === "IFR" ? "#a855f7" : "#14b8a6" }}>
                  {claim.claim_type} ({claim.claim_type === "IFR" ? "Individual" : "Community"})
                </span>
              </div>

              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>LAND AREA</span>
                <span style={{ fontWeight: "700", color: "var(--text-main, #0f172a)" }}>{claim.land_area_acres} Acres</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>STATE</span>
                <span style={{ color: "var(--text-main, #0f172a)", fontWeight: "600" }}>{claim.state || "Telangana"}</span>
              </div>

              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>DISTRICT</span>
                <span style={{ color: "var(--text-main, #0f172a)", fontWeight: "600" }}>{claim.district}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>MANDAL</span>
                <span style={{ color: "var(--text-main, #0f172a)" }}>{claim.mandal}</span>
              </div>

              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>VILLAGE</span>
                <span style={{ color: "var(--text-main, #0f172a)" }}>{claim.village}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Date & Processing Metrics */}
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#3b82f6", borderBottom: "1px solid var(--border-color, #e2e8f0)", paddingBottom: "8px" }}>
            ⏱️ Processing Information
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>SUBMISSION DATE</span>
                <strong style={{ color: "var(--text-main, #0f172a)" }}>{claim.submission_date || "—"}</strong>
              </div>

              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>DECISION DATE</span>
                <strong style={{ color: "var(--text-main, #0f172a)" }}>{claim.decision_date ? claim.decision_date : "Not decided"}</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>PROCESSING DAYS</span>
                <span style={{ fontWeight: "600", color: "var(--text-main, #475569)" }}>
                  {claim.processing_days !== null ? `${claim.processing_days} days` : "Currently pending"}
                </span>
              </div>

              <div>
                <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>PENDING DAYS</span>
                <span style={{ fontWeight: "600", color: "#f59e0b" }}>
                  {claim.pending_days !== null ? `${claim.pending_days} days` : "—"}
                </span>
              </div>
            </div>

            <div>
              <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>TOTAL CLAIM AGE</span>
              <span style={{ fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                {claim.claim_age_days !== null ? `${claim.claim_age_days} days` : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Location & Mini Map */}
        <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "20px", boxShadow: "var(--card-shadow)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#3b82f6", borderBottom: "1px solid var(--border-color, #e2e8f0)", paddingBottom: "8px" }}>
            📍 Location &amp; Spatial View
          </h3>

          <div style={{ marginBottom: "12px", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted, #64748b)", fontSize: "11px", fontWeight: "600", display: "block" }}>LOCATION ID</span>
            <span style={{ color: "var(--text-main, #0f172a)", fontFamily: "monospace", fontWeight: "600" }}>{claim.location_id || "LOC_31"}</span>
          </div>

          <div style={{ flex: 1, minHeight: "180px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color, #e2e8f0)" }}>
            {hasCoords ? (
              <MapContainer
                center={miniMapCenter}
                zoom={12}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%", minHeight: "180px" }}
              >
                <TileLayer
                  url={
                    theme === "dark"
                      ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                />
                {theme === "dark" && (
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}" />
                )}
                <Marker position={miniMapCenter} icon={createMiniMarkerIcon(claim.status)}>
                  <Popup>
                    <strong>{claim.claim_id}</strong><br />
                    {claim.village}, {claim.district}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted, #64748b)", fontSize: "13px" }}>
                Geometry location centered on {claim.village}, {claim.district}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section: Visual Claim Timeline */}
      <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "20px", boxShadow: "var(--card-shadow)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
          📈 Claim Processing Lifecycle Timeline
        </h3>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", padding: "10px 0" }}>
          {/* Step 1: Submission */}
          <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
              1
            </div>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-main, #0f172a)", display: "block" }}>Claim Submitted</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted, #64748b)" }}>{claim.submission_date || "—"}</span>
            </div>
          </div>

          <div style={{ height: "2px", flex: "1 1 40px", backgroundColor: "var(--border-color, #cbd5e1)", minWidth: "20px" }} />

          {/* Step 2: Processing */}
          <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f59e0b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
              2
            </div>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-main, #0f172a)", display: "block" }}>Processing</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted, #64748b)" }}>
                {claim.processing_days !== null ? `${claim.processing_days} days` : claim.pending_days !== null ? `${claim.pending_days} days pending` : "Under Verification"}
              </span>
            </div>
          </div>

          <div style={{ height: "2px", flex: "1 1 40px", backgroundColor: "var(--border-color, #cbd5e1)", minWidth: "20px" }} />

          {/* Step 3: Decision / Pending */}
          <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: claim.status === "Approved" ? "#16a34a" : claim.status === "Rejected" ? "#dc2626" : "#f59e0b",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              3
            </div>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-main, #0f172a)", display: "block" }}>
                {claim.status === "Approved" ? "Approved" : claim.status === "Rejected" ? "Rejected" : "Currently Pending"}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted, #64748b)" }}>
                {claim.decision_date ? claim.decision_date : "Awaiting Decision"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaimDetail;
