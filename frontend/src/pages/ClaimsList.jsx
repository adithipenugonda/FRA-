import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function ClaimsList({ onNavigate }) {
  const { theme } = useTheme();
  const [claims, setClaims] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [mandalFilter, setMandalFilter] = useState("");
  const [villageFilter, setVillageFilter] = useState("");

  // Parse initial query params (e.g. /claims?status=Pending&district=Adilabad)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status")) setStatusFilter(params.get("status"));
    if (params.get("claim_type")) setTypeFilter(params.get("claim_type"));
    if (params.get("district")) setDistrictFilter(params.get("district"));
    if (params.get("mandal")) setMandalFilter(params.get("mandal"));
    if (params.get("village")) setVillageFilter(params.get("village"));
    if (params.get("search")) setSearch(params.get("search"));
  }, []);

  const fetchClaims = () => {
    setLoading(true);
    setError(null);
    let url = `http://127.0.0.1:8000/claims?page=${page}&limit=${limit}`;

    if (statusFilter && statusFilter !== "All") url += `&status=${encodeURIComponent(statusFilter)}`;
    if (typeFilter && typeFilter !== "All") url += `&claim_type=${encodeURIComponent(typeFilter)}`;
    if (districtFilter.trim()) url += `&district=${encodeURIComponent(districtFilter.trim())}`;
    if (mandalFilter.trim()) url += `&mandal=${encodeURIComponent(mandalFilter.trim())}`;
    if (villageFilter.trim()) url += `&village=${encodeURIComponent(villageFilter.trim())}`;
    if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load claims");
        return res.json();
      })
      .then((data) => {
        setClaims(data.items || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unable to load claims");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClaims();
  }, [page, limit, statusFilter, typeFilter, districtFilter, mandalFilter, villageFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchClaims();
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
    setDistrictFilter("");
    setMandalFilter("");
    setVillageFilter("");
    setPage(1);
    // Clear URL search params
    window.history.pushState({}, "", "/claims");
  };

  const handleViewClaim = (claimId) => {
    if (onNavigate) {
      onNavigate(`/claims/${claimId}`);
    } else {
      window.history.pushState({}, "", `/claims/${claimId}`);
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div style={{ padding: "24px", backgroundColor: "var(--bg-primary, #f8fafc)", minHeight: "calc(100vh - 50px)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
            FRA Claims Registry &amp; Management
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
            Operational registry of Forest Rights Act claims with status tracking.
          </p>
        </div>

        <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted, #475569)", backgroundColor: "var(--bg-card, #e2e8f0)", border: "1px solid var(--border-color, #cbd5e1)", padding: "6px 14px", borderRadius: "20px" }}>
          Total Claims in Dataset: <span style={{ color: "#3b82f6", fontWeight: "700" }}>{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          backgroundColor: "var(--bg-card, #ffffff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "20px",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          {/* Search Input */}
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted, #475569)", marginBottom: "4px" }}>
              Search Claim ID / Claimant
            </label>
            <input
              type="text"
              placeholder="e.g. FRA00433"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                border: "1px solid var(--input-border, #cbd5e1)",
                borderRadius: "6px",
                boxSizing: "border-box",
                outline: "none",
                backgroundColor: "var(--input-bg, #ffffff)",
                color: "var(--input-text, #0f172a)",
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ flex: "0 0 140px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted, #475569)", marginBottom: "4px" }}>
              Claim Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                border: "1px solid var(--input-border, #cbd5e1)",
                borderRadius: "6px",
                outline: "none",
                backgroundColor: "var(--input-bg, #ffffff)",
                color: "var(--input-text, #0f172a)",
              }}
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Claim Type Filter */}
          <div style={{ flex: "0 0 140px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted, #475569)", marginBottom: "4px" }}>
              Claim Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                border: "1px solid var(--input-border, #cbd5e1)",
                borderRadius: "6px",
                outline: "none",
                backgroundColor: "var(--input-bg, #ffffff)",
                color: "var(--input-text, #0f172a)",
              }}
            >
              <option value="">All Types</option>
              <option value="IFR">IFR</option>
              <option value="CFR">CFR</option>
            </select>
          </div>

          {/* District Filter Input */}
          <div style={{ flex: "0 0 140px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted, #475569)", marginBottom: "4px" }}>
              District
            </label>
            <input
              type="text"
              placeholder="District name"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                border: "1px solid var(--input-border, #cbd5e1)",
                borderRadius: "6px",
                boxSizing: "border-box",
                outline: "none",
                backgroundColor: "var(--input-bg, #ffffff)",
                color: "var(--input-text, #0f172a)",
              }}
            />
          </div>

          {/* Mandal Filter Input */}
          <div style={{ flex: "0 0 130px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted, #475569)", marginBottom: "4px" }}>
              Mandal
            </label>
            <input
              type="text"
              placeholder="Mandal name"
              value={mandalFilter}
              onChange={(e) => setMandalFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                border: "1px solid var(--input-border, #cbd5e1)",
                borderRadius: "6px",
                boxSizing: "border-box",
                outline: "none",
                backgroundColor: "var(--input-bg, #ffffff)",
                color: "var(--input-text, #0f172a)",
              }}
            />
          </div>

          {/* Village Filter Input */}
          <div style={{ flex: "0 0 130px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted, #475569)", marginBottom: "4px" }}>
              Village
            </label>
            <input
              type="text"
              placeholder="Village name"
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                border: "1px solid var(--input-border, #cbd5e1)",
                borderRadius: "6px",
                boxSizing: "border-box",
                outline: "none",
                backgroundColor: "var(--input-bg, #ffffff)",
                color: "var(--input-text, #0f172a)",
              }}
            />
          </div>

          {/* Filter Action Buttons */}
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: "600",
                backgroundColor: "var(--btn-secondary-bg, #f1f5f9)",
                color: "var(--btn-secondary-text, #475569)",
                border: "1px solid var(--btn-secondary-border, #cbd5e1)",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Claims Data Table */}
      <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted, #64748b)", fontSize: "14px" }}>
            Loading claims...
          </div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#dc2626", fontSize: "14px" }}>
            Unable to load claims: {error}
          </div>
        ) : claims.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted, #64748b)", fontSize: "14px" }}>
            No claims found
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--table-header-bg, #f1f5f9)", borderBottom: "1px solid var(--table-border, #e2e8f0)", color: "var(--text-muted, #475569)", fontWeight: "700" }}>
                  <th style={{ padding: "12px 14px" }}>Claim ID</th>
                  <th style={{ padding: "12px 14px" }}>Claimant Name</th>
                  <th style={{ padding: "12px 14px" }}>District</th>
                  <th style={{ padding: "12px 14px" }}>Mandal</th>
                  <th style={{ padding: "12px 14px" }}>Village</th>
                  <th style={{ padding: "12px 14px" }}>Claim Type</th>
                  <th style={{ padding: "12px 14px" }}>Land Area</th>
                  <th style={{ padding: "12px 14px" }}>Status</th>
                  <th style={{ padding: "12px 14px" }}>Submission Date</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr
                    key={c.claim_id}
                    onClick={() => handleViewClaim(c.claim_id)}
                    style={{
                      borderBottom: "1px solid var(--table-border, #f1f5f9)",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--table-row-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "12px 14px", fontWeight: "700", color: "#3b82f6" }}>{c.claim_id}</td>
                    <td style={{ padding: "12px 14px", fontWeight: "600", color: "var(--text-main, #0f172a)" }}>{c.claimant_name || "—"}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text-main, #334155)" }}>{c.district}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text-main, #334155)" }}>{c.mandal}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text-main, #334155)" }}>{c.village}</td>
                    <td style={{ padding: "12px 14px", fontWeight: "600", color: c.claim_type === "IFR" ? "#a855f7" : "#14b8a6" }}>
                      {c.claim_type}
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--text-main, #0f172a)" }}>{c.land_area_acres} Acres</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            c.status === "Approved"
                              ? theme === "dark" ? "rgba(22, 163, 74, 0.2)" : "#dcfce7"
                              : c.status === "Pending"
                              ? theme === "dark" ? "rgba(245, 158, 11, 0.2)" : "#fef9c3"
                              : theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2",
                          color:
                            c.status === "Approved"
                              ? theme === "dark" ? "#4ade80" : "#15803d"
                              : c.status === "Pending"
                              ? theme === "dark" ? "#fbbf24" : "#a16207"
                              : theme === "dark" ? "#f87171" : "#b91c1c",
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--text-muted, #64748b)" }}>{c.submission_date || "—"}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewClaim(c.claim_id);
                        }}
                        style={{
                          padding: "4px 12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "var(--bg-card, #ffffff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: "8px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
          Page <span style={{ fontWeight: "700", color: "var(--text-main, #0f172a)" }}>{page}</span> of{" "}
          <span style={{ fontWeight: "700", color: "var(--text-main, #0f172a)" }}>{totalPages}</span> ({total.toLocaleString()} total claims)
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "4px",
              border: "1px solid var(--btn-secondary-border, #cbd5e1)",
              backgroundColor: page <= 1 ? "var(--table-header-bg, #f1f5f9)" : "var(--btn-secondary-bg, #ffffff)",
              color: page <= 1 ? "var(--text-muted, #94a3b8)" : "var(--text-main, #334155)",
              cursor: page <= 1 ? "not-allowed" : "pointer",
            }}
          >
            &larr; Previous
          </button>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "4px",
              border: "1px solid var(--btn-secondary-border, #cbd5e1)",
              backgroundColor: page >= totalPages ? "var(--table-header-bg, #f1f5f9)" : "var(--btn-secondary-bg, #ffffff)",
              color: page >= totalPages ? "var(--text-muted, #94a3b8)" : "var(--text-main, #334155)",
              cursor: page >= totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClaimsList;
