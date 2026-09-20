import React from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

function createClaimIcon(status) {
  let color = "#2563eb";

  if (status === "Approved") {
    color = "#16a34a";
  } else if (status === "Pending") {
    color = "#f59e0b";
  } else if (status === "Rejected") {
    color = "#dc2626";
  }

  return L.divIcon({
    className: "custom-claim-marker",
    html: `
      <div
        style="
          width: 18px;
          height: 18px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        "
      ></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

function ClaimMarkers({ claims = [], onNavigate }) {
  return (
    <MarkerClusterGroup chunkedLoading spiderfyOnMaxZoom>
      {claims.map((claim) => {
        const properties = claim.properties;

        return (
          <Marker
            key={properties.claim_id}
            position={claim.position}
            icon={createClaimIcon(properties.status)}
          >
            <Popup>
              <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                <strong style={{ fontSize: "14px", color: "var(--text-main, #0f172a)" }}>{properties.claim_id}</strong>
                <br />
                <span style={{ color: "var(--text-muted, #475569)", fontSize: "12px" }}>District: {properties.district}</span>
                <br />
                <span style={{ color: "var(--text-muted, #475569)", fontSize: "12px" }}>Mandal: {properties.mandal}</span>
                <br />
                <span style={{ color: "var(--text-muted, #475569)", fontSize: "12px" }}>Village: {properties.village}</span>
                <br />
                <span style={{ color: "var(--text-muted, #475569)", fontSize: "12px" }}>Type: {properties.claim_type}</span>
                <br />
                <span style={{ color: "var(--text-muted, #475569)", fontSize: "12px" }}>Status: {properties.status}</span>
                <br />
                <span style={{ color: "var(--text-muted, #475569)", fontSize: "12px" }}>Land Area: {properties.land_area_acres} acres</span>

                <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid var(--border-color, #e2e8f0)" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(`/claims/${properties.claim_id}`);
                      } else {
                        window.history.pushState({}, "", `/claims/${properties.claim_id}`);
                        window.dispatchEvent(new Event("popstate"));
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "5px 10px",
                      fontSize: "11px",
                      fontWeight: "700",
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    View Claim Details &rarr;
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
}

export default ClaimMarkers;