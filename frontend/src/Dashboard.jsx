import React, { useEffect, useState } from "react";
import { useTheme } from "./context/ThemeContext";

// Donut Chart Component using SVG
function DonutChart({ data = [], total = 0, colors = {} }) {
  if (!data || data.length === 0 || total === 0) {
    return <div style={{ padding: "20px", color: "var(--text-muted, #6b7280)" }}>No data available</div>;
  }

  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  const slices = data.map((item) => {
    const key = item.status || item.claim_type;
    const value = item.count;
    const percentage = ((value / total) * 100).toFixed(1);
    const strokeDasharray = `${(value / total) * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += (value / total) * circumference;
    const color = colors[key] || "#3b82f6";

    return {
      key,
      value,
      percentage,
      color,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice) => (
            <circle
              key={slice.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main, #111827)" }}>
            {total.toLocaleString()}
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted, #6b7280)", fontWeight: "500" }}>
            Total
          </span>
        </div>
      </div>

      {/* Legend & Percentages */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "160px" }}>
        {slices.map((slice) => (
          <div
            key={slice.key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  backgroundColor: slice.color,
                  display: "inline-block",
                }}
              />
              <span style={{ fontWeight: "600", color: "var(--text-main, #374151)" }}>{slice.key}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: "700", color: "var(--text-main, #111827)" }}>
                {slice.value.toLocaleString()}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted, #6b7280)" }}>
                ({slice.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Horizontal Bar Chart Component
function HorizontalBarChart({ data = [], maxCount = 1 }) {
  if (!data || data.length === 0) {
    return <div style={{ padding: "20px", color: "var(--text-muted, #6b7280)" }}>No district data available</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.map((item) => {
        const percentage = Math.min(100, Math.max(2, (item.count / maxCount) * 100));

        return (
          <div
            key={item.district}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text-main, #374151)",
              }}
            >
              <span>{item.district}</span>
              <span>
                {item.count.toLocaleString()} Claims ({item.total_land_area.toLocaleString()} Acres)
              </span>
            </div>
            <div
              style={{
                width: "100%",
                backgroundColor: "var(--chart-track, #f3f4f6)",
                borderRadius: "4px",
                height: "14px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  backgroundColor: "#2563eb",
                  height: "100%",
                  borderRadius: "4px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Processing Comparison Bar Chart
function ProcessingChart({ districtData = [] }) {
  if (!districtData || districtData.length === 0) {
    return <div style={{ padding: "20px", color: "var(--text-muted, #6b7280)" }}>No processing data available</div>;
  }

  const maxVal = Math.max(
    ...districtData.map((d) => Math.max(d.avg_processing_days || 0, d.avg_pending_days || 0)),
    100
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", gap: "16px", fontSize: "12px", marginBottom: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "12px", height: "12px", backgroundColor: "#0284c7", borderRadius: "2px" }} />
          <span style={{ color: "var(--text-main, #374151)", fontWeight: "600" }}>Avg Processing Days (Decided)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "12px", height: "12px", backgroundColor: "#f59e0b", borderRadius: "2px" }} />
          <span style={{ color: "var(--text-main, #374151)", fontWeight: "600" }}>Avg Pending Days (Pending)</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {districtData.map((d) => {
          const procWidth = Math.min(100, Math.max(2, ((d.avg_processing_days || 0) / maxVal) * 100));
          const pendWidth = Math.min(100, Math.max(2, ((d.avg_pending_days || 0) / maxVal) * 100));

          return (
            <div key={d.district} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", color: "var(--text-main, #374151)" }}>
                <span>{d.district}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted, #6b7280)" }}>
                  Proc: {d.avg_processing_days || 0}d | Pend: {d.avg_pending_days || 0}d
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ width: "100%", backgroundColor: "var(--chart-track, #f3f4f6)", height: "8px", borderRadius: "2px" }}>
                  <div style={{ width: `${procWidth}%`, backgroundColor: "#0284c7", height: "100%", borderRadius: "2px" }} />
                </div>
                <div style={{ width: "100%", backgroundColor: "var(--chart-track, #f3f4f6)", height: "8px", borderRadius: "2px" }}>
                  <div style={{ width: `${pendWidth}%`, backgroundColor: "#f59e0b", height: "100%", borderRadius: "2px" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Dashboard() {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = () => {
    setLoading(true);
    setError(null);
    fetch("http://127.0.0.1:8000/dashboard/summary")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard API Error:", err);
        setError(err.message || "Failed to load dashboard statistics.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          color: "var(--text-muted, #4b5563)",
          fontSize: "16px",
          fontWeight: 500,
        }}
      >
        Loading FRA Analytics Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2",
            border: `1px solid ${theme === "dark" ? "#b91c1c" : "#fca5a5"}`,
            borderRadius: "6px",
            padding: "16px 20px",
            color: theme === "dark" ? "#f87171" : "#991b1b",
          }}
        >
          <h3 style={{ margin: "0 0 8px", fontSize: "16px" }}>Dashboard Load Failed</h3>
          <p style={{ margin: "0 0 12px", fontSize: "14px" }}>{error}</p>
          <button
            type="button"
            onClick={fetchDashboardData}
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              border: "none",
              padding: "6px 14px",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    Approved: "#16a34a",
    Pending: "#f59e0b",
    Rejected: "#dc2626",
  };

  const typeColors = {
    IFR: "#7c3aed",
    CFR: "#0d9488",
  };

  const maxDistrictCount = data.district_distribution?.length > 0
    ? Math.max(...data.district_distribution.map((d) => d.count))
    : 1;

  return (
    <div
      style={{
        padding: "20px 24px",
        backgroundColor: "var(--bg-primary, #f9fafb)",
        minHeight: "calc(100vh - 50px)",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "700",
                color: "var(--text-main, #111827)",
              }}
            >
              FRA Implementation Dashboard
            </h1>
            <span
              style={{
                fontSize: "12px",
                backgroundColor: theme === "dark" ? "#334155" : "#f3f4f6",
                color: theme === "dark" ? "#cbd5e1" : "#4b5563",
                padding: "2px 10px",
                borderRadius: "12px",
                fontWeight: "600",
                border: `1px solid ${theme === "dark" ? "#475569" : "#e5e7eb"}`,
              }}
            >
              Prototype Dataset
            </span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted, #6b7280)" }}>
            PostgreSQL-Based FRA Analytics &amp; Decision Support System
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          style={{
            padding: "6px 14px",
            backgroundColor: "var(--btn-secondary-bg, #ffffff)",
            color: "var(--btn-secondary-text, #374151)",
            border: "1px solid var(--btn-secondary-border, #d1d5db)",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          🔄 Refresh Metrics
        </button>
      </div>

      {/* Summary Cards Grid (7 Cards) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {/* Total Claims */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate("/claims");
            else window.location.href = "/claims";
          }}
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: "1px solid var(--border-color, #e5e7eb)",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-muted, #6b7280)", fontWeight: "600" }}>
            Total Claims
          </span>
          <div
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "var(--text-main, #111827)",
              marginTop: "4px",
            }}
          >
            {data.total_claims.toLocaleString()}
          </div>
        </div>

        {/* Approved Claims */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate("/claims?status=Approved");
            else window.location.href = "/claims?status=Approved";
          }}
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: `1px solid ${theme === "dark" ? "rgba(22, 163, 74, 0.4)" : "#bbf7d0"}`,
            borderLeft: "4px solid #16a34a",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#4ade80" : "#166534", fontWeight: "600" }}>
            Approved Claims
          </span>
          <div
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#16a34a",
              marginTop: "4px",
            }}
          >
            {data.approved_claims.toLocaleString()}
          </div>
        </div>

        {/* Pending Claims */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate("/claims?status=Pending");
            else window.location.href = "/claims?status=Pending";
          }}
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: `1px solid ${theme === "dark" ? "rgba(245, 158, 11, 0.4)" : "#fef08a"}`,
            borderLeft: "4px solid #f59e0b",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#fbbf24" : "#854d0e", fontWeight: "600" }}>
            Pending Claims
          </span>
          <div
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#f59e0b",
              marginTop: "4px",
            }}
          >
            {data.pending_claims.toLocaleString()}
          </div>
        </div>

        {/* Rejected Claims */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate("/claims?status=Rejected");
            else window.location.href = "/claims?status=Rejected";
          }}
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: `1px solid ${theme === "dark" ? "rgba(220, 38, 38, 0.4)" : "#fecaca"}`,
            borderLeft: "4px solid #dc2626",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#f87171" : "#991b1b", fontWeight: "600" }}>
            Rejected Claims
          </span>
          <div
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#dc2626",
              marginTop: "4px",
            }}
          >
            {data.rejected_claims.toLocaleString()}
          </div>
        </div>

        {/* Total Land Area */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate("/claims");
            else window.location.href = "/claims";
          }}
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: `1px solid ${theme === "dark" ? "rgba(37, 99, 235, 0.4)" : "#bfdbfe"}`,
            borderLeft: "4px solid #2563eb",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#60a5fa" : "#1e40af", fontWeight: "600" }}>
            Total Land Area
          </span>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#3b82f6",
              marginTop: "4px",
            }}
          >
            {data.total_land_area.toLocaleString()}{" "}
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Acres</span>
          </div>
        </div>

        {/* IFR Claims */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate("/claims?claim_type=IFR");
            else window.location.href = "/claims?claim_type=IFR";
          }}
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: `1px solid ${theme === "dark" ? "rgba(124, 58, 237, 0.4)" : "#ddd6fe"}`,
            borderLeft: "4px solid #7c3aed",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#c084fc" : "#5b21b6", fontWeight: "600" }}>
            IFR Claims
          </span>
          <div
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#a855f7",
              marginTop: "4px",
            }}
          >
            {data.ifr_claims.toLocaleString()}
          </div>
        </div>

        {/* CFR Claims */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate("/claims?claim_type=CFR");
            else window.location.href = "/claims?claim_type=CFR";
          }}
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: `1px solid ${theme === "dark" ? "rgba(13, 148, 136, 0.4)" : "#99f6e4"}`,
            borderLeft: "4px solid #0d9488",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "12px", color: theme === "dark" ? "#2dd4bf" : "#115e59", fontWeight: "600" }}>
            CFR Claims
          </span>
          <div
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#14b8a6",
              marginTop: "4px",
            }}
          >
            {data.cfr_claims.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 1: Status & Type Distribution */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Status Distribution */}
        <div
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: "1px solid var(--border-color, #e5e7eb)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: "16px",
              fontWeight: "700",
              color: "var(--text-main, #111827)",
            }}
          >
            Claim Status Distribution
          </h3>
          <DonutChart
            data={data.status_distribution}
            total={data.total_claims}
            colors={statusColors}
          />
        </div>

        {/* Claim Type Distribution */}
        <div
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: "1px solid var(--border-color, #e5e7eb)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: "16px",
              fontWeight: "700",
              color: "var(--text-main, #111827)",
            }}
          >
            Claim Type Distribution
          </h3>
          <DonutChart
            data={data.claim_type_distribution}
            total={data.total_claims}
            colors={typeColors}
          />
        </div>
      </div>

      {/* Charts Grid - Row 2: District Distribution & Processing Analysis */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "20px",
        }}
      >
        {/* District-wise Claim Distribution */}
        <div
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: "1px solid var(--border-color, #e5e7eb)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: "16px",
              fontWeight: "700",
              color: "var(--text-main, #111827)",
            }}
          >
            District-wise Claim Distribution
          </h3>
          <HorizontalBarChart
            data={data.district_distribution}
            maxCount={maxDistrictCount}
          />
        </div>

        {/* Processing / Pending Analysis */}
        <div
          style={{
            backgroundColor: "var(--bg-card, #ffffff)",
            border: "1px solid var(--border-color, #e5e7eb)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "700",
              color: "var(--text-main, #111827)",
            }}
          >
            Processing &amp; Pending Analysis
          </h3>

          {/* Processing Metrics Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: theme === "dark" ? "rgba(2, 132, 199, 0.15)" : "#f0f9ff",
                border: `1px solid ${theme === "dark" ? "rgba(56, 189, 248, 0.3)" : "#bae6fd"}`,
                borderRadius: "6px",
                padding: "10px",
              }}
            >
              <span style={{ fontSize: "11px", color: theme === "dark" ? "#38bdf8" : "#0369a1", fontWeight: "600" }}>
                Avg Proc (Approved)
              </span>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0284c7" }}>
                {data.processing_summary?.avg_processing_approved || 0}d
              </div>
            </div>

            <div
              style={{
                backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.15)" : "#fef2f2",
                border: `1px solid ${theme === "dark" ? "rgba(248, 113, 113, 0.3)" : "#fecaca"}`,
                borderRadius: "6px",
                padding: "10px",
              }}
            >
              <span style={{ fontSize: "11px", color: theme === "dark" ? "#f87171" : "#b91c1c", fontWeight: "600" }}>
                Avg Proc (Rejected)
              </span>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#dc2626" }}>
                {data.processing_summary?.avg_processing_rejected || 0}d
              </div>
            </div>

            <div
              style={{
                backgroundColor: theme === "dark" ? "rgba(245, 158, 11, 0.15)" : "#fffbeb",
                border: `1px solid ${theme === "dark" ? "rgba(251, 191, 36, 0.3)" : "#fde68a"}`,
                borderRadius: "6px",
                padding: "10px",
              }}
            >
              <span style={{ fontSize: "11px", color: theme === "dark" ? "#fbbf24" : "#92400e", fontWeight: "600" }}>
                Avg Pending Duration
              </span>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#d97706" }}>
                {data.processing_summary?.avg_pending_days || 0}d
              </div>
            </div>
          </div>

          <ProcessingChart
            districtData={data.processing_summary?.district_processing || []}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
