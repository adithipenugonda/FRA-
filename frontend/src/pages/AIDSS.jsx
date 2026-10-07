import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Color helper function based on health category / score
const getCategoryTheme = (categoryOrScore, theme = "light") => {
  let cat = categoryOrScore;
  if (typeof categoryOrScore === "number") {
    if (categoryOrScore >= 80) cat = "Healthy";
    else if (categoryOrScore >= 60) cat = "Moderate";
    else if (categoryOrScore >= 40) cat = "Needs Attention";
    else cat = "Critical";
  }

  const isDark = theme === "dark";

  switch (cat) {
    case "Healthy":
      return {
        color: "#16a34a",
        bg: isDark ? "rgba(22, 163, 74, 0.18)" : "#f0fdf4",
        border: isDark ? "rgba(74, 222, 128, 0.4)" : "#bbf7d0",
        badgeBg: isDark ? "rgba(22, 163, 74, 0.3)" : "#dcfce7",
        badgeText: isDark ? "#4ade80" : "#15803d",
      };
    case "Moderate":
      return {
        color: "#2563eb",
        bg: isDark ? "rgba(37, 99, 235, 0.18)" : "#eff6ff",
        border: isDark ? "rgba(96, 165, 250, 0.4)" : "#bfdbfe",
        badgeBg: isDark ? "rgba(37, 99, 235, 0.3)" : "#dbeafe",
        badgeText: isDark ? "#60a5fa" : "#1d4ed8",
      };
    case "Needs Attention":
      return {
        color: "#d97706",
        bg: isDark ? "rgba(217, 119, 6, 0.18)" : "#fffbeb",
        border: isDark ? "rgba(251, 191, 36, 0.4)" : "#fde68a",
        badgeBg: isDark ? "rgba(217, 119, 6, 0.3)" : "#fef3c7",
        badgeText: isDark ? "#fbbf24" : "#b45309",
      };
    case "Critical":
    default:
      return {
        color: "#dc2626",
        bg: isDark ? "rgba(220, 38, 38, 0.18)" : "#fef2f2",
        border: isDark ? "rgba(248, 113, 113, 0.4)" : "#fecaca",
        badgeBg: isDark ? "rgba(220, 38, 38, 0.3)" : "#fee2e2",
        badgeText: isDark ? "#f87171" : "#b91c1c",
      };
  }
};

// Color helper function based on Priority Category
const getPriorityCategoryTheme = (category, theme = "light") => {
  const isDark = theme === "dark";
  switch (category) {
    case "Critical Priority":
      return {
        color: "#dc2626",
        bg: isDark ? "rgba(220, 38, 38, 0.18)" : "#fef2f2",
        border: isDark ? "rgba(248, 113, 113, 0.4)" : "#fecaca",
        badgeBg: isDark ? "rgba(220, 38, 38, 0.3)" : "#fee2e2",
        badgeText: isDark ? "#f87171" : "#b91c1c",
      };
    case "High Priority":
      return {
        color: "#ea580c",
        bg: isDark ? "rgba(234, 88, 12, 0.18)" : "#fff7ed",
        border: isDark ? "rgba(251, 146, 60, 0.4)" : "#fed7aa",
        badgeBg: isDark ? "rgba(234, 88, 12, 0.3)" : "#ffedd5",
        badgeText: isDark ? "#fb923c" : "#c2410c",
      };
    case "Medium Priority":
      return {
        color: "#d97706",
        bg: isDark ? "rgba(217, 119, 6, 0.18)" : "#fffbeb",
        border: isDark ? "rgba(251, 191, 36, 0.4)" : "#fde68a",
        badgeBg: isDark ? "rgba(217, 119, 6, 0.3)" : "#fef3c7",
        badgeText: isDark ? "#fbbf24" : "#b45309",
      };
    case "Low Priority":
    default:
      return {
        color: "#16a34a",
        bg: isDark ? "rgba(22, 163, 74, 0.18)" : "#f0fdf4",
        border: isDark ? "rgba(74, 222, 128, 0.4)" : "#bbf7d0",
        badgeBg: isDark ? "rgba(22, 163, 74, 0.3)" : "#dcfce7",
        badgeText: isDark ? "#4ade80" : "#15803d",
      };
  }
};

// Color helper function based on Delay Risk
const getDelayRiskTheme = (risk, theme = "light") => {
  const isDark = theme === "dark";
  switch (risk) {
    case "High Delay Bottleneck Risk":
      return {
        color: "#dc2626",
        bg: isDark ? "rgba(220, 38, 38, 0.18)" : "#fef2f2",
        border: isDark ? "rgba(248, 113, 113, 0.4)" : "#fecaca",
        badgeBg: isDark ? "rgba(220, 38, 38, 0.3)" : "#fee2e2",
        badgeText: isDark ? "#f87171" : "#b91c1c",
      };
    case "Moderate Delay Risk":
      return {
        color: "#d97706",
        bg: isDark ? "rgba(217, 119, 6, 0.18)" : "#fffbeb",
        border: isDark ? "rgba(251, 191, 36, 0.4)" : "#fde68a",
        badgeBg: isDark ? "rgba(217, 119, 6, 0.3)" : "#fef3c7",
        badgeText: isDark ? "#fbbf24" : "#b45309",
      };
    case "Low Delay Risk":
    default:
      return {
        color: "#16a34a",
        bg: isDark ? "rgba(22, 163, 74, 0.18)" : "#f0fdf4",
        border: isDark ? "rgba(74, 222, 128, 0.4)" : "#bbf7d0",
        badgeBg: isDark ? "rgba(22, 163, 74, 0.3)" : "#dcfce7",
        badgeText: isDark ? "#4ade80" : "#15803d",
      };
  }
};

// Color helper function based on Prediction State
const getPredictionStateTheme = (state, theme = "light") => {
  const isDark = theme === "dark";
  switch (state) {
    case "Already beyond predicted duration":
      return {
        color: "#ea580c",
        bg: isDark ? "rgba(234, 88, 12, 0.18)" : "#fff7ed",
        border: isDark ? "rgba(251, 146, 60, 0.4)" : "#fed7aa",
        badgeBg: isDark ? "rgba(234, 88, 12, 0.3)" : "#ffedd5",
        badgeText: isDark ? "#fb923c" : "#c2410c",
      };
    case "Within predicted duration":
    default:
      return {
        color: "#2563eb",
        bg: isDark ? "rgba(37, 99, 235, 0.18)" : "#eff6ff",
        border: isDark ? "rgba(96, 165, 250, 0.4)" : "#bfdbfe",
        badgeBg: isDark ? "rgba(37, 99, 235, 0.3)" : "#dbeafe",
        badgeText: isDark ? "#60a5fa" : "#1d4ed8",
      };
  }
};

// SVG Circular Gauge Component for Health Score
function ScoreGauge({ score = 0, category = "Moderate" }) {
  const { theme } = useTheme();
  const catTheme = getCategoryTheme(category, theme);

  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Arc Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={theme === "dark" ? "#334155" : "#e2e8f0"}
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={catTheme.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
      </svg>
      {/* Center Label */}
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
        <span style={{ fontSize: "28px", fontWeight: "800", color: catTheme.color, lineHeight: "1.1" }}>
          {score.toFixed(1)}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted, #64748b)" }}>
          out of 100
        </span>
      </div>
    </div>
  );
}

function AIDSS() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("health_score");
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Priority Ranking State
  const [priorityData, setPriorityData] = useState(null);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [priorityError, setPriorityError] = useState(null);
  const [prioritySearchTerm, setPrioritySearchTerm] = useState("");
  const [prioritySortBy, setPrioritySortBy] = useState("priority_desc");

  // Predictive Analytics State
  const [predictiveData, setPredictiveData] = useState(null);
  const [predictiveLoading, setPredictiveLoading] = useState(false);
  const [predictiveError, setPredictiveError] = useState(null);
  const [predSearchTerm, setPredSearchTerm] = useState("");
  const [predDistrictFilter, setPredDistrictFilter] = useState("ALL");
  const [predTypeFilter, setPredTypeFilter] = useState("ALL");
  const [predRiskFilter, setPredRiskFilter] = useState("ALL");
  const [predPage, setPredPage] = useState(1);

  const handleClearPredFilters = () => {
    setPredSearchTerm("");
    setPredDistrictFilter("ALL");
    setPredTypeFilter("ALL");
    setPredRiskFilter("ALL");
    setPredPage(1);
  };

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isDistrictInspectorOpen, setIsDistrictInspectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("score_desc");

  const handleDistrictDetails = (district) => {
    setSelectedDistrict(district);
    setIsDistrictInspectorOpen(true);
  };

  const handleCloseDistrictInspector = () => {
    setIsDistrictInspectorOpen(false);
    setSelectedDistrict(null);
  };

  const fetchHealthScores = () => {
    setLoading(true);
    setError(null);
    fetch("http://127.0.0.1:8000/ai/health-score/districts")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setHealthData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("AI Health Score API Error:", err);
        setError(err.message || "Failed to load Implementation Health Scores.");
        setLoading(false);
      });
  };

  const fetchPriorityRanking = () => {
    setPriorityLoading(true);
    setPriorityError(null);
    fetch("http://127.0.0.1:8000/ai/priority-ranking")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setPriorityData(json);
        setPriorityLoading(false);
      })
      .catch((err) => {
        console.error("AI Priority Ranking API Error:", err);
        setPriorityError(err.message || "Failed to load District Priority Ranking.");
        setPriorityLoading(false);
      });
  };

  const fetchPredictiveAnalytics = () => {
    setPredictiveLoading(true);
    setPredictiveError(null);
    fetch("http://127.0.0.1:8000/ai/prediction/claims")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setPredictiveData(json);
        setPredictiveLoading(false);
      })
      .catch((err) => {
        console.error("AI Predictive Analytics API Error:", err);
        setPredictiveError(err.message || "Failed to load Predictive Analytics data.");
        setPredictiveLoading(false);
      });
  };

  useEffect(() => {
    fetchHealthScores();
  }, []);

  useEffect(() => {
    if (activeTab === "priority_ranking" && !priorityData && !priorityLoading) {
      fetchPriorityRanking();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "predictive" && !predictiveData && !predictiveLoading) {
      fetchPredictiveAnalytics();
    }
  }, [activeTab]);

  const upcomingModules = [
    {
      id: "priority",
      title: "Implementation Priority Analysis",
      description: "Spatial prioritization of pending FRA claims based on pendency duration, claim area, and ecological sensitivity.",
      icon: "🎯",
    },
    {
      id: "predictive",
      title: "Predictive Analytics",
      description: "Forecasting claim approval rates, processing duration bottlenecks, and mandal-level pendency trends using ML.",
      icon: "📈",
    },
    {
      id: "duplicate",
      title: "Duplicate Claim Detection",
      description: "Geospatial boundary overlap and identity deduplication algorithms to prevent double allocation of forest land.",
      icon: "🔍",
    },
    {
      id: "xai",
      title: "Explainable AI (XAI)",
      description: "Interpretable decision justification models providing transparent feature contribution rationale for risk scoring.",
      icon: "🧠",
    },
  ];

  // Filtering and Sorting Districts for Health Score
  const filteredDistricts = (healthData?.districts || []).filter((d) =>
    d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.district_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDistricts = [...filteredDistricts].sort((a, b) => {
    if (sortBy === "score_desc") return b.health_score - a.health_score;
    if (sortBy === "score_asc") return a.health_score - b.health_score;
    if (sortBy === "name_asc") return a.district.localeCompare(b.district);
    if (sortBy === "pending_desc") return b.pending_claims - a.pending_claims;
    if (sortBy === "long_pending_desc") return b.long_pending_claims - a.long_pending_claims;
    return 0;
  });

  // Filtering and Sorting Districts for Priority Ranking
  const priorityDistricts = priorityData?.districts || [];
  const filteredPriorityDistricts = priorityDistricts.filter((d) => {
    const term = prioritySearchTerm.toLowerCase();
    const name = (d.district_name || d.district || "").toLowerCase();
    const id = (d.district_id || "").toLowerCase();
    const cat = (d.priority_category || "").toLowerCase();
    return name.includes(term) || id.includes(term) || cat.includes(term);
  });

  const sortedPriorityDistricts = [...filteredPriorityDistricts].sort((a, b) => {
    if (prioritySortBy === "priority_desc") return b.priority_score - a.priority_score;
    if (prioritySortBy === "priority_asc") return a.priority_score - b.priority_score;
    if (prioritySortBy === "name_asc") return (a.district_name || a.district).localeCompare(b.district_name || b.district);
    if (prioritySortBy === "pending_desc") return b.pending_claims - a.pending_claims;
    if (prioritySortBy === "long_pending_desc") return b.long_pending_claims - a.long_pending_claims;
    return 0;
  });

  // Filtering and Pagination for Predictive Analytics
  const claimsList = predictiveData?.claims || predictiveData?.predictions || [];
  const uniqueDistricts = Array.from(new Set(claimsList.map((c) => c.district).filter(Boolean))).sort();
  const uniqueTypes = Array.from(new Set(claimsList.map((c) => c.claim_type).filter(Boolean))).sort();
  const uniqueRisks = ["Low Delay Risk", "Moderate Delay Risk", "High Delay Bottleneck Risk"];

  const filteredClaims = claimsList.filter((c) => {
    const term = predSearchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (c.claim_id && c.claim_id.toLowerCase().includes(term)) ||
      (c.district && c.district.toLowerCase().includes(term)) ||
      (c.mandal && c.mandal.toLowerCase().includes(term)) ||
      (c.village && c.village.toLowerCase().includes(term));

    const matchesDistrict =
      predDistrictFilter === "ALL" ||
      predDistrictFilter === "All Districts" ||
      c.district === predDistrictFilter;

    const matchesType =
      predTypeFilter === "ALL" ||
      predTypeFilter === "All Claim Types" ||
      c.claim_type === predTypeFilter;

    const matchesRisk =
      predRiskFilter === "ALL" ||
      predRiskFilter === "All Delay Risks" ||
      c.delay_risk === predRiskFilter;

    return matchesSearch && matchesDistrict && matchesType && matchesRisk;
  });

  const pageSize = 25;
  const totalPages = Math.ceil(filteredClaims.length / pageSize) || 1;
  const currentPage = Math.min(Math.max(1, predPage), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedClaims = filteredClaims.slice(startIndex, startIndex + pageSize);

  const overall = healthData?.overall;
  const overallTheme = overall ? getCategoryTheme(overall.health_category, theme) : null;

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "var(--bg-primary, #f8fafc)",
        minHeight: "calc(100vh - 50px)",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Header */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
              AI &amp; Decision Support System (DSS)
            </h1>
            <span
              style={{
                fontSize: "11px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: "4px",
                fontWeight: "700",
              }}
            >
              Modules 1, 2 &amp; 3 Active
            </span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
            Data-driven composite indicators and analytical decision tools for Forest Rights Act monitoring.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "6px", backgroundColor: "var(--bg-card, #ffffff)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("health_score")}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "700",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "health_score" ? "#2563eb" : "transparent",
              color: activeTab === "health_score" ? "#ffffff" : "var(--text-muted, #64748b)",
              transition: "all 0.15s ease",
            }}
          >
            📊 Implementation Health Score
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("priority_ranking")}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "700",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "priority_ranking" ? "#2563eb" : "transparent",
              color: activeTab === "priority_ranking" ? "#ffffff" : "var(--text-muted, #64748b)",
              transition: "all 0.15s ease",
            }}
          >
            🎯 District Priority Ranking
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("predictive")}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "700",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "predictive" ? "#2563eb" : "transparent",
              color: activeTab === "predictive" ? "#ffffff" : "var(--text-muted, #64748b)",
              transition: "all 0.15s ease",
            }}
          >
            📈 Predictive Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "700",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "upcoming" ? "#2563eb" : "transparent",
              color: activeTab === "upcoming" ? "#ffffff" : "var(--text-muted, #64748b)",
              transition: "all 0.15s ease",
            }}
          >
            ⚡ Roadmap &amp; Other AI Modules
          </button>
        </div>
      </div>

      {activeTab === "upcoming" ? (
        /* Upcoming AI Modules Section */
        <div>
          <div style={{ marginBottom: "16px", padding: "12px 16px", backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "15px", color: "var(--text-main, #0f172a)" }}>AI/DSS Development Roadmap</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
              Implementation Health Score (Module 1), District Priority Ranking (Module 2), and Predictive Analytics (Module 3) are live. Additional specialized ML and spatial algorithms are planned for subsequent phases.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {upcomingModules.map((m) => {
              const isLive = m.id === "priority" || m.id === "predictive";
              const liveText = m.id === "priority" ? "Module 2 Live" : "Module 3 Live";

              return (
                <div
                  key={m.id}
                  style={{
                    backgroundColor: "var(--bg-card, #ffffff)",
                    border: "1px solid var(--border-color, #e2e8f0)",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
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
                        backgroundColor: isLive
                          ? (theme === "dark" ? "rgba(37, 99, 235, 0.2)" : "#dbeafe")
                          : (theme === "dark" ? "rgba(245, 158, 11, 0.2)" : "#fef3c7"),
                        color: isLive
                          ? (theme === "dark" ? "#60a5fa" : "#1d4ed8")
                          : (theme === "dark" ? "#fbbf24" : "#d97706"),
                        border: `1px solid ${isLive ? (theme === "dark" ? "rgba(96, 165, 250, 0.4)" : "#bfdbfe") : (theme === "dark" ? "rgba(251, 191, 36, 0.4)" : "#fde68a")}`,
                        padding: "3px 10px",
                        borderRadius: "4px",
                      }}
                    >
                      {isLive ? liveText : "Scheduled Next"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === "predictive" ? (
        /* PREDICTIVE ANALYTICS SECTION (Module 3) */
        <div>
          {predictiveLoading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted, #64748b)" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🔄</div>
              Loading ML Claim Processing Duration Predictions from API...
            </div>
          ) : predictiveError ? (
            <div style={{ padding: "20px", backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", borderRadius: "8px", color: "#dc2626" }}>
              <strong>Error loading Predictive Analytics:</strong> {predictiveError}
              <div style={{ marginTop: "10px" }}>
                <button type="button" onClick={fetchPredictiveAnalytics} style={{ padding: "6px 12px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "var(--bg-card, #ffffff)",
                border: "1px solid var(--border-color, #e2e8f0)",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
              }}
            >
              {/* Header Title + Subtitle */}
              <div style={{ marginBottom: "16px" }}>
                <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                  Predictive Analytics
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
                  Experimental ML-based estimation of claim processing duration.
                </p>
              </div>

              {/* Disclaimer Box */}
              <div
                style={{
                  backgroundColor: theme === "dark" ? "rgba(245, 158, 11, 0.15)" : "#fffbeb",
                  border: `1px solid ${theme === "dark" ? "rgba(251, 191, 36, 0.4)" : "#fde68a"}`,
                  borderRadius: "10px",
                  padding: "16px 20px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>⚠️</span>
                  <strong style={{ fontSize: "13px", color: theme === "dark" ? "#fbbf24" : "#b45309" }}>
                    {predictiveData?.disclaimer || "Experimental ML Prediction — Estimates expected turnaround duration from submission-time metadata. Not a guaranteed completion date."}
                  </strong>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "12px", color: "var(--text-main, #334155)", borderTop: `1px solid ${theme === "dark" ? "rgba(251, 191, 36, 0.2)" : "#fef3c7"}`, paddingTop: "10px" }}>
                  <div>
                    <span style={{ color: "var(--text-muted, #64748b)" }}>Model: </span>
                    <strong style={{ color: "var(--text-main, #0f172a)" }}>{predictiveData?.model_type || "Random Forest Regressor"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted, #64748b)" }}>Validation MAE: </span>
                    <strong style={{ color: "#2563eb" }}>{predictiveData?.validation_mae_days ?? 247.19} days</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted, #64748b)" }}>Validation R²: </span>
                    <strong style={{ color: "#16a34a" }}>{predictiveData?.validation_r2 ?? 0.3742}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted, #64748b)" }}>Total Pending Claims: </span>
                    <strong style={{ color: "#d97706" }}>{(predictiveData?.total_pending_claims || claimsList.length).toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Filters Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
                  {/* Claim ID Search */}
                  <input
                    type="text"
                    placeholder="Search Claim ID, District, Mandal..."
                    value={predSearchTerm}
                    onChange={(e) => {
                      setPredSearchTerm(e.target.value);
                      setPredPage(1);
                    }}
                    style={{
                      padding: "6px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color, #cbd5e1)",
                      backgroundColor: "var(--bg-primary, #f8fafc)",
                      color: "var(--text-main, #0f172a)",
                      outline: "none",
                      minWidth: "220px",
                    }}
                  />

                  {/* District Filter */}
                  <select
                    value={predDistrictFilter}
                    onChange={(e) => {
                      setPredDistrictFilter(e.target.value);
                      setPredPage(1);
                    }}
                    style={{
                      padding: "6px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color, #cbd5e1)",
                      backgroundColor: "var(--bg-primary, #f8fafc)",
                      color: "var(--text-main, #0f172a)",
                      cursor: "pointer",
                    }}
                  >
                    <option value="ALL">All Districts ({uniqueDistricts.length})</option>
                    {uniqueDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  {/* Claim Type Filter */}
                  <select
                    value={predTypeFilter}
                    onChange={(e) => {
                      setPredTypeFilter(e.target.value);
                      setPredPage(1);
                    }}
                    style={{
                      padding: "6px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color, #cbd5e1)",
                      backgroundColor: "var(--bg-primary, #f8fafc)",
                      color: "var(--text-main, #0f172a)",
                      cursor: "pointer",
                    }}
                  >
                    <option value="ALL">All Claim Types</option>
                    {uniqueTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  {/* Delay Risk Filter */}
                  <select
                    value={predRiskFilter}
                    onChange={(e) => {
                      setPredRiskFilter(e.target.value);
                      setPredPage(1);
                    }}
                    style={{
                      padding: "6px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color, #cbd5e1)",
                      backgroundColor: "var(--bg-primary, #f8fafc)",
                      color: "var(--text-main, #0f172a)",
                      cursor: "pointer",
                    }}
                  >
                    <option value="ALL">All Delay Risks</option>
                    {uniqueRisks.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  {/* Clear Filters Button */}
                  <button
                    type="button"
                    onClick={handleClearPredFilters}
                    style={{
                      padding: "6px 12px",
                      fontSize: "13px",
                      fontWeight: "600",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color, #cbd5e1)",
                      backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "#f1f5f9",
                      color: "var(--text-main, #0f172a)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Clear Filters
                  </button>
                </div>

                <div style={{ fontSize: "12px", color: "var(--text-muted, #64748b)", fontWeight: "600" }}>
                  Showing {filteredClaims.length.toLocaleString()} matching claims
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--bg-primary, #f1f5f9)", color: "var(--text-muted, #475569)", borderBottom: "1px solid var(--border-color, #cbd5e1)" }}>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Claim ID</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>District</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Claim Type</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Land Area</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Submission Date</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Current Pending Days</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Estimated Processing Days</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Prediction State</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Delay Risk</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Remaining Estimate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClaims.length === 0 ? (
                      <tr>
                        <td colSpan="10" style={{ padding: "30px", textAlign: "center", color: "var(--text-muted, #64748b)" }}>
                          No pending claims match the selected filter criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedClaims.map((c) => {
                        const riskTheme = getDelayRiskTheme(c.delay_risk, theme);
                        const stateTheme = getPredictionStateTheme(c.prediction_state, theme);
                        const isBeyond = c.prediction_state === "Already beyond predicted duration";

                        return (
                          <tr
                            key={c.claim_id}
                            style={{
                              borderBottom: "1px solid var(--border-color, #e2e8f0)",
                              transition: "background-color 0.15s ease",
                            }}
                          >
                            <td style={{ padding: "10px 12px", fontWeight: "700", color: "#2563eb" }}>
                              {c.claim_id}
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: "600", color: "var(--text-main, #0f172a)" }}>
                              {c.district}{" "}
                              <span style={{ fontSize: "11px", color: "var(--text-muted, #64748b)", fontWeight: "400" }}>
                                ({c.district_id})
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", backgroundColor: "var(--bg-primary, #f1f5f9)", color: "var(--text-main, #334155)", border: "1px solid var(--border-color, #cbd5e1)" }}>
                                {c.claim_type}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: "500" }}>
                              {c.land_area_acres} acres
                            </td>
                            <td style={{ padding: "10px 12px", color: "var(--text-muted, #64748b)" }}>
                              {c.submission_date}
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: "700", color: "#d97706" }}>
                              {c.current_pending_days} days
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                              {typeof c.predicted_processing_days === "number" ? c.predicted_processing_days.toFixed(1) : c.predicted_processing_days} days
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  backgroundColor: stateTheme.badgeBg,
                                  color: stateTheme.badgeText,
                                  border: `1px solid ${stateTheme.border}`,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {c.prediction_state}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  backgroundColor: riskTheme.badgeBg,
                                  color: riskTheme.badgeText,
                                  border: `1px solid ${riskTheme.border}`,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {c.delay_risk}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: "700", color: isBeyond ? "#dc2626" : "#16a34a" }}>
                              {isBeyond ? "0 days" : `${c.predicted_remaining_days} days`}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-color, #e2e8f0)", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-muted, #64748b)" }}>
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredClaims.length.toLocaleString()} claims, 25 per page)
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => setPredPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "4px",
                        border: "1px solid var(--border-color, #cbd5e1)",
                        backgroundColor: currentPage === 1 ? "var(--bg-primary, #f1f5f9)" : "var(--bg-card, #ffffff)",
                        color: currentPage === 1 ? "var(--text-muted, #94a3b8)" : "var(--text-main, #0f172a)",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      ← Previous
                    </button>

                    <span style={{ fontSize: "12px", padding: "0 6px", color: "var(--text-muted, #64748b)" }}>
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPredPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "4px",
                        border: "1px solid var(--border-color, #cbd5e1)",
                        backgroundColor: currentPage === totalPages ? "var(--bg-primary, #f1f5f9)" : "var(--bg-card, #ffffff)",
                        color: currentPage === totalPages ? "var(--text-muted, #94a3b8)" : "var(--text-main, #0f172a)",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : activeTab === "priority_ranking" ? (
        /* DISTRICT PRIORITY RANKING SECTION (Module 2) */
        <div>
          {priorityLoading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted, #64748b)" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🔄</div>
              Calculating real-time District Priority Scores from PostgreSQL dataset...
            </div>
          ) : priorityError ? (
            <div style={{ padding: "20px", backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", borderRadius: "8px", color: "#dc2626" }}>
              <strong>Error loading District Priority Ranking:</strong> {priorityError}
              <div style={{ marginTop: "10px" }}>
                <button type="button" onClick={fetchPriorityRanking} style={{ padding: "6px 12px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "var(--bg-card, #ffffff)",
                border: "1px solid var(--border-color, #e2e8f0)",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
              }}
            >
              {/* Header + Search + Sort Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                    District Priority Ranking
                  </h2>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted, #64748b)", maxWidth: "700px", lineHeight: "1.4" }}>
                    Districts are ranked according to operational urgency based on pending workload, long-pending claims, processing delay and pending land-area impact.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="Search district name or ID..."
                    value={prioritySearchTerm}
                    onChange={(e) => setPrioritySearchTerm(e.target.value)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color, #cbd5e1)",
                      backgroundColor: "var(--bg-primary, #f8fafc)",
                      color: "var(--text-main, #0f172a)",
                      outline: "none",
                      minWidth: "180px",
                    }}
                  />

                  <select
                    value={prioritySortBy}
                    onChange={(e) => setPrioritySortBy(e.target.value)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color, #cbd5e1)",
                      backgroundColor: "var(--bg-primary, #f8fafc)",
                      color: "var(--text-main, #0f172a)",
                      cursor: "pointer",
                    }}
                  >
                    <option value="priority_desc">Sort: Priority Score (High → Low)</option>
                    <option value="priority_asc">Sort: Priority Score (Low → High)</option>
                    <option value="name_asc">Sort: District Name (A → Z)</option>
                    <option value="pending_desc">Sort: Highest Pending Claims</option>
                    <option value="long_pending_desc">Sort: Highest Long-Pending Claims</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--bg-primary, #f1f5f9)", color: "var(--text-muted, #475569)", borderBottom: "1px solid var(--border-color, #cbd5e1)" }}>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Rank</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>District</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Priority Score</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Priority Category</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Total Claims</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Pending Claims</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Long-Pending Claims</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Pending Rate</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700" }}>Average Processing Days</th>
                      <th style={{ padding: "10px 12px", fontWeight: "700", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPriorityDistricts.length === 0 ? (
                      <tr>
                        <td colSpan="10" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted, #64748b)" }}>
                          {prioritySearchTerm
                            ? `No districts match the search term "${prioritySearchTerm}".`
                            : "No district priority data available."}
                        </td>
                      </tr>
                    ) : (
                      sortedPriorityDistricts.map((d, index) => {
                        const itemTheme = getPriorityCategoryTheme(d.priority_category, theme);
                        const isSelected = selectedDistrict?.district_id === d.district_id;

                        return (
                          <tr
                            key={d.district_id}
                            onClick={() => handleDistrictDetails(d)}
                            style={{
                              borderBottom: "1px solid var(--border-color, #e2e8f0)",
                              backgroundColor: isSelected
                                ? (theme === "dark" ? "rgba(37, 99, 235, 0.2)" : "#eff6ff")
                                : "transparent",
                              cursor: "pointer",
                              transition: "background-color 0.15s ease",
                            }}
                          >
                            <td style={{ padding: "10px 12px", fontWeight: "700", color: "var(--text-muted, #64748b)" }}>
                              {index + 1}
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                              {d.district_name || d.district}{" "}
                              <span style={{ fontSize: "11px", color: "var(--text-muted, #64748b)", fontWeight: "500" }}>
                                ({d.district_id})
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontWeight: "800", color: itemTheme.color, minWidth: "40px" }}>
                                  {typeof d.priority_score === "number" ? d.priority_score.toFixed(1) : d.priority_score}
                                </span>
                                <div style={{ flex: 1, maxWidth: "80px", height: "6px", backgroundColor: "var(--bg-primary, #e2e8f0)", borderRadius: "3px", overflow: "hidden" }}>
                                  <div style={{ width: `${Math.min(100, Math.max(0, d.priority_score))}%`, height: "100%", backgroundColor: itemTheme.color, borderRadius: "3px" }} />
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <span
                                style={{
                                  padding: "2px 10px",
                                  borderRadius: "12px",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  backgroundColor: itemTheme.badgeBg,
                                  color: itemTheme.badgeText,
                                  border: `1px solid ${itemTheme.border}`,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {d.priority_category}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px", fontWeight: "600" }}>{d.total_claims.toLocaleString()}</td>
                            <td style={{ padding: "10px 12px", fontWeight: "600", color: "#d97706" }}>{d.pending_claims.toLocaleString()}</td>
                            <td style={{ padding: "10px 12px", fontWeight: "600", color: "#dc2626" }}>{d.long_pending_claims.toLocaleString()}</td>
                            <td style={{ padding: "10px 12px", fontWeight: "600", color: "#2563eb" }}>{d.pending_rate}%</td>
                            <td style={{ padding: "10px 12px", fontWeight: "600", color: "var(--text-main, #334155)" }}>{d.average_processing_days}d</td>
                            <td style={{ padding: "10px 12px", textAlign: "center" }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDistrictDetails(d);
                                }}
                                style={{
                                  padding: "3px 10px",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  backgroundColor: "#2563eb",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted, #64748b)" }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>🔄</div>
          Calculating real-time Implementation Health Scores from PostgreSQL dataset...
        </div>
      ) : error ? (
        <div style={{ padding: "20px", backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", borderRadius: "8px", color: "#dc2626" }}>
          <strong>Error loading Health Score data:</strong> {error}
          <div style={{ marginTop: "10px" }}>
            <button type="button" onClick={fetchHealthScores} style={{ padding: "6px 12px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Retry
            </button>
          </div>
        </div>
      ) : (
        /* LIVE HEALTH SCORE DASHBOARD */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Main Top Banner: Overall Score + Components */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Overall Score Card */}
            <div
              style={{
                backgroundColor: "var(--bg-card, #ffffff)",
                border: `1px solid ${overallTheme.border}`,
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted, #64748b)", marginBottom: "12px" }}>
                Overall System Implementation Health
              </div>

              <ScoreGauge score={overall.health_score} category={overall.health_category} />

              <div
                style={{
                  marginTop: "16px",
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "800",
                  backgroundColor: overallTheme.badgeBg,
                  color: overallTheme.badgeText,
                  border: `1px solid ${overallTheme.border}`,
                }}
              >
                {overall.health_category}
              </div>

              <p style={{ marginTop: "12px", marginBottom: "16px", fontSize: "13px", color: "var(--text-main, #334155)", lineHeight: "1.4", maxWidth: "340px" }}>
                {overall.recommendation}
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", fontSize: "11px", fontWeight: "600" }}>
                <span style={{ backgroundColor: "var(--bg-primary, #f1f5f9)", padding: "3px 8px", borderRadius: "4px", color: "var(--text-main, #1e293b)" }}>
                  Total: {overall.total_claims.toLocaleString()}
                </span>
                <span style={{ backgroundColor: theme === "dark" ? "rgba(22, 163, 74, 0.2)" : "#dcfce7", padding: "3px 8px", borderRadius: "4px", color: "#16a34a" }}>
                  Approved: {overall.approved_claims.toLocaleString()}
                </span>
                <span style={{ backgroundColor: theme === "dark" ? "rgba(245, 158, 11, 0.2)" : "#fef3c7", padding: "3px 8px", borderRadius: "4px", color: "#d97706" }}>
                  Pending: {overall.pending_claims.toLocaleString()}
                </span>
                <span style={{ backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", padding: "3px 8px", borderRadius: "4px", color: "#dc2626" }}>
                  Long Pending: {overall.long_pending_claims.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Component Indicators Breakdown Cards (XAI Explainability) */}
            <div
              style={{
                backgroundColor: "var(--bg-card, #ffffff)",
                border: "1px solid var(--border-color, #e2e8f0)",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                  Health Score Component Breakdown (XAI)
                </h3>
                <span style={{ fontSize: "11px", color: "var(--text-muted, #64748b)", fontWeight: "600" }}>
                  Transparent Composite Weights
                </span>
              </div>

              {/* Indicator 1: Resolution Rate */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-main, #334155)" }}>
                    1. Resolution Rate (Weight 25%)
                  </span>
                  <span style={{ fontWeight: "700", color: "#16a34a" }}>
                    {overall.resolution_rate}% (Score: {overall.components.resolution_rate_score}/100)
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-primary, #f1f5f9)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${overall.components.resolution_rate_score}%`, height: "100%", backgroundColor: "#16a34a", borderRadius: "4px", transition: "width 0.5s ease" }} />
                </div>
              </div>

              {/* Indicator 2: Pending Rate */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-main, #334155)" }}>
                    2. Pending Rate (Weight 20%)
                  </span>
                  <span style={{ fontWeight: "700", color: "#2563eb" }}>
                    {overall.pending_rate}% (Score: {overall.components.pending_rate_score}/100)
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-primary, #f1f5f9)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${overall.components.pending_rate_score}%`, height: "100%", backgroundColor: "#2563eb", borderRadius: "4px", transition: "width 0.5s ease" }} />
                </div>
              </div>

              {/* Indicator 3: Long-Pending Rate */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-main, #334155)" }}>
                    3. Long-Pending Rate (&ge;180d) (Weight 25%)
                  </span>
                  <span style={{ fontWeight: "700", color: "#d97706" }}>
                    {overall.long_pending_rate}% (Score: {overall.components.long_pending_rate_score}/100)
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-primary, #f1f5f9)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${overall.components.long_pending_rate_score}%`, height: "100%", backgroundColor: "#d97706", borderRadius: "4px", transition: "width 0.5s ease" }} />
                </div>
              </div>

              {/* Indicator 4: Processing Efficiency */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-main, #334155)" }}>
                    4. Processing Efficiency (Weight 15%)
                  </span>
                  <span style={{ fontWeight: "700", color: "#8b5cf6" }}>
                    Avg {overall.average_processing_days}d (Score: {overall.components.processing_days_score}/100)
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-primary, #f1f5f9)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${overall.components.processing_days_score}%`, height: "100%", backgroundColor: "#8b5cf6", borderRadius: "4px", transition: "width 0.5s ease" }} />
                </div>
              </div>

              {/* Indicator 5: Backlog Workload */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-main, #334155)" }}>
                    5. Workload Capacity (Weight 15%)
                  </span>
                  <span style={{ fontWeight: "700", color: "#06b6d4" }}>
                    Score: {overall.components.backlog_score}/100
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-primary, #f1f5f9)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${overall.components.backlog_score}%`, height: "100%", backgroundColor: "#06b6d4", borderRadius: "4px", transition: "width 0.5s ease" }} />
                </div>
              </div>
            </div>
          </div>

          {/* District Health Ranking Section */}
          <div
            style={{
              backgroundColor: "var(--bg-card, #ffffff)",
              border: "1px solid var(--border-color, #e2e8f0)",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.05))",
            }}
          >
            {/* Header + Search + Sort Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                  District Implementation Health Ranking ({healthData.total_districts} Districts)
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted, #64748b)" }}>
                  Comparative implementation scores calculated separately for every district.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Search district name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "13px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color, #cbd5e1)",
                    backgroundColor: "var(--bg-primary, #f8fafc)",
                    color: "var(--text-main, #0f172a)",
                    outline: "none",
                    minWidth: "180px",
                  }}
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "13px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color, #cbd5e1)",
                    backgroundColor: "var(--bg-primary, #f8fafc)",
                    color: "var(--text-main, #0f172a)",
                    cursor: "pointer",
                  }}
                >
                  <option value="score_desc">Sort: Health Score (High → Low)</option>
                  <option value="score_asc">Sort: Health Score (Low → High)</option>
                  <option value="name_asc">Sort: District Name (A → Z)</option>
                  <option value="pending_desc">Sort: Highest Pending Claims</option>
                  <option value="long_pending_desc">Sort: Highest Long-Pending Claims</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-primary, #f1f5f9)", color: "var(--text-muted, #475569)", borderBottom: "1px solid var(--border-color, #cbd5e1)" }}>
                    <th style={{ padding: "10px 12px", fontWeight: "700" }}>#</th>
                    <th style={{ padding: "10px 12px", fontWeight: "700" }}>District</th>
                    <th style={{ padding: "10px 12px", fontWeight: "700" }}>Health Score</th>
                    <th style={{ padding: "10px 12px", fontWeight: "700" }}>Category</th>
                    <th style={{ padding: "10px 12px", fontWeight: "700" }}>Total Claims</th>
                    <th style={{ padding: "10px 12px", fontWeight: "700" }}>Pending</th>
                    <th style={{ padding: "10px 12px", fontWeight: "700" }}>Long-Pending (&ge;180d)</th>
                    <th style={{ padding: "10px 12px", fontWeight: "700" }}>Resolution Rate</th>
                    <th style={{ padding: "10px 12px", fontWeight: "700" }}>Avg Proc. Days</th>
                    <th style={{ padding: "10px 12px", fontWeight: "700", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDistricts.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted, #64748b)" }}>
                        No districts match the search term "{searchTerm}".
                      </td>
                    </tr>
                  ) : (
                    sortedDistricts.map((d, index) => {
                      const itemTheme = getCategoryTheme(d.health_category, theme);
                      const isSelected = selectedDistrict?.district_id === d.district_id;

                      return (
                        <tr
                          key={d.district_id}
                          onClick={() => handleDistrictDetails(d)}
                          style={{
                            borderBottom: "1px solid var(--border-color, #e2e8f0)",
                            backgroundColor: isSelected
                              ? (theme === "dark" ? "rgba(37, 99, 235, 0.2)" : "#eff6ff")
                              : "transparent",
                            cursor: "pointer",
                            transition: "background-color 0.15s ease",
                          }}
                        >
                          <td style={{ padding: "10px 12px", fontWeight: "600", color: "var(--text-muted, #64748b)" }}>
                            {index + 1}
                          </td>
                          <td style={{ padding: "10px 12px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                            {d.district}{" "}
                            <span style={{ fontSize: "11px", color: "var(--text-muted, #64748b)", fontWeight: "500" }}>
                              ({d.district_id})
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontWeight: "800", color: itemTheme.color, minWidth: "40px" }}>
                                {d.health_score.toFixed(1)}
                              </span>
                              <div style={{ flex: 1, maxWidth: "80px", height: "6px", backgroundColor: "var(--bg-primary, #e2e8f0)", borderRadius: "3px", overflow: "hidden" }}>
                                <div style={{ width: `${d.health_score}%`, height: "100%", backgroundColor: itemTheme.color, borderRadius: "3px" }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: "700",
                                backgroundColor: itemTheme.badgeBg,
                                color: itemTheme.badgeText,
                                border: `1px solid ${itemTheme.border}`,
                              }}
                            >
                              {d.health_category}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", fontWeight: "600" }}>{d.total_claims.toLocaleString()}</td>
                          <td style={{ padding: "10px 12px", fontWeight: "600", color: "#d97706" }}>{d.pending_claims.toLocaleString()}</td>
                          <td style={{ padding: "10px 12px", fontWeight: "600", color: "#dc2626" }}>{d.long_pending_claims.toLocaleString()}</td>
                          <td style={{ padding: "10px 12px", fontWeight: "600", color: "#16a34a" }}>{d.resolution_rate}%</td>
                          <td style={{ padding: "10px 12px", fontWeight: "600", color: "var(--text-main, #334155)" }}>{d.average_processing_days}d</td>
                          <td style={{ padding: "10px 12px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDistrictDetails(d);
                              }}
                              style={{
                                padding: "3px 8px",
                                fontSize: "11px",
                                fontWeight: "700",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* District Detailed Breakdown Modal / Inspector Overlay */}
      {isDistrictInspectorOpen && selectedDistrict && (() => {
        const distCat = selectedDistrict.priority_category || selectedDistrict.health_category || "Moderate";
        const distTheme = selectedDistrict.priority_category
          ? getPriorityCategoryTheme(selectedDistrict.priority_category, theme)
          : getCategoryTheme(selectedDistrict.health_category, theme);
        const distScore = selectedDistrict.priority_score ?? selectedDistrict.health_score ?? 0;

        return (
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
            onClick={handleCloseDistrictInspector}
          >
            <div
              style={{
                backgroundColor: "var(--bg-card, #ffffff)",
                border: `2px solid ${distTheme.color}`,
                borderRadius: "12px",
                padding: "24px",
                maxWidth: "720px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
                position: "relative",
                color: "var(--text-main, #0f172a)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleCloseDistrictInspector}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "var(--text-muted, #64748b)",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                  District Analysis: {selectedDistrict.district_name || selectedDistrict.district} ({selectedDistrict.district_id})
                </h3>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "800",
                    backgroundColor: distTheme.badgeBg,
                    color: distTheme.badgeText,
                    border: `1px solid ${distTheme.border}`,
                  }}
                >
                  Score: {typeof distScore === "number" ? distScore.toFixed(1) : distScore} / 100 ({distCat})
                </span>
              </div>

              {/* Recommendation */}
              <div style={{ padding: "12px 16px", backgroundColor: distTheme.bg, borderRadius: "8px", border: `1px solid ${distTheme.border}`, marginBottom: "20px" }}>
                <strong style={{ color: distTheme.color, fontSize: "13px" }}>Operational Recommendation:</strong>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-main, #1e293b)" }}>
                  {selectedDistrict.recommendation}
                </p>
              </div>

              {/* Detailed Metrics Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: (selectedDistrict.components || selectedDistrict.volume_score !== undefined) ? "20px" : "0" }}>
                <div style={{ padding: "12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted, #64748b)", fontWeight: "600" }}>Total Claims</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-main, #0f172a)", marginTop: "2px" }}>
                    {selectedDistrict.total_claims?.toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: "12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)" }}>
                  <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>Approved Claims</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#16a34a", marginTop: "2px" }}>
                    {selectedDistrict.approved_claims?.toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: "12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)" }}>
                  <div style={{ fontSize: "11px", color: "#d97706", fontWeight: "600" }}>Pending Claims</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#d97706", marginTop: "2px" }}>
                    {selectedDistrict.pending_claims?.toLocaleString()} ({selectedDistrict.pending_rate}%)
                  </div>
                </div>

                <div style={{ padding: "12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)" }}>
                  <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: "600" }}>Long-Pending (&ge;180d)</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#dc2626", marginTop: "2px" }}>
                    {selectedDistrict.long_pending_claims?.toLocaleString()} ({selectedDistrict.long_pending_rate}%)
                  </div>
                </div>

                <div style={{ padding: "12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)" }}>
                  <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>Resolution Rate</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#16a34a", marginTop: "2px" }}>
                    {selectedDistrict.resolution_rate}%
                  </div>
                </div>

                <div style={{ padding: "12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)" }}>
                  <div style={{ fontSize: "11px", color: "#8b5cf6", fontWeight: "600" }}>Avg Processing Time</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#8b5cf6", marginTop: "2px" }}>
                    {selectedDistrict.average_processing_days !== null && selectedDistrict.average_processing_days !== undefined ? `${selectedDistrict.average_processing_days} days` : "N/A"}
                  </div>
                </div>

                {selectedDistrict.pending_land_area_acres !== undefined && (
                  <div style={{ padding: "12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "8px", border: "1px solid var(--border-color, #e2e8f0)" }}>
                    <div style={{ fontSize: "11px", color: "#0284c7", fontWeight: "600" }}>Pending Land Area</div>
                    <div style={{ fontSize: "20px", fontWeight: "800", color: "#0284c7", marginTop: "2px" }}>
                      {selectedDistrict.pending_land_area_acres?.toLocaleString()} acres
                    </div>
                  </div>
                )}
              </div>

              {/* Health Score Component Breakdown Scores (XAI) */}
              {selectedDistrict.components && (
                <div style={{ borderTop: "1px solid var(--border-color, #e2e8f0)", paddingTop: "16px" }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                    Health Score Sub-Components (XAI Breakdown)
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Resolution Score</span>
                      <strong style={{ color: "#16a34a", fontSize: "14px" }}>{selectedDistrict.components.resolution_rate_score}/100</strong>
                    </div>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Pending Score</span>
                      <strong style={{ color: "#2563eb", fontSize: "14px" }}>{selectedDistrict.components.pending_rate_score}/100</strong>
                    </div>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Long-Pending Score</span>
                      <strong style={{ color: "#d97706", fontSize: "14px" }}>{selectedDistrict.components.long_pending_rate_score}/100</strong>
                    </div>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Processing Score</span>
                      <strong style={{ color: "#8b5cf6", fontSize: "14px" }}>{selectedDistrict.components.processing_days_score}/100</strong>
                    </div>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Backlog Score</span>
                      <strong style={{ color: "#06b6d4", fontSize: "14px" }}>{selectedDistrict.components.backlog_score}/100</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Priority Score Sub-Indicators */}
              {selectedDistrict.volume_score !== undefined && (
                <div style={{ borderTop: "1px solid var(--border-color, #e2e8f0)", paddingTop: "16px" }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
                    Priority Score Indicators Breakdown
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Workload Volume (25%)</span>
                      <strong style={{ color: "#2563eb", fontSize: "14px" }}>{selectedDistrict.volume_score}/100</strong>
                    </div>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Long-Pending Risk (25%)</span>
                      <strong style={{ color: "#dc2626", fontSize: "14px" }}>{selectedDistrict.long_pending_score}/100</strong>
                    </div>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Pending Proportion (20%)</span>
                      <strong style={{ color: "#d97706", fontSize: "14px" }}>{selectedDistrict.pending_rate_score}/100</strong>
                    </div>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Processing Delay (15%)</span>
                      <strong style={{ color: "#8b5cf6", fontSize: "14px" }}>{selectedDistrict.processing_delay_score}/100</strong>
                    </div>
                    <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary, #f8fafc)", borderRadius: "6px", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-muted, #64748b)", display: "block" }}>Land Area Impact (15%)</span>
                      <strong style={{ color: "#0284c7", fontSize: "14px" }}>{selectedDistrict.land_area_score}/100</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer close button */}
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button
                  type="button"
                  onClick={handleCloseDistrictInspector}
                  style={{
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: "700",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default AIDSS;
