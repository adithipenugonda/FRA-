import React from "react";

function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  districts = [],
  mandals = [],
  villages = [],
  totalResults = 0,
}) {
  const handleDistrictChange = (e) => {
    onFilterChange({
      ...filters,
      district: e.target.value,
      mandal: "",
      village: "",
    });
  };

  const handleMandalChange = (e) => {
    onFilterChange({
      ...filters,
      mandal: e.target.value,
      village: "",
    });
  };

  const handleVillageChange = (e) => {
    onFilterChange({
      ...filters,
      village: e.target.value,
    });
  };

  const handleStatusChange = (e) => {
    onFilterChange({
      ...filters,
      status: e.target.value,
    });
  };

  const handleClaimTypeChange = (e) => {
    onFilterChange({
      ...filters,
      claim_type: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    onFilterChange({
      ...filters,
      searchQuery: e.target.value,
    });
  };

  const selectStyle = {
    padding: "5px 8px",
    borderRadius: "4px",
    border: "1px solid var(--input-border, #cbd5e1)",
    fontSize: "13px",
    color: "var(--input-text, #0f172a)",
    backgroundColor: "var(--input-bg, #ffffff)",
    boxSizing: "border-box",
    outline: "none",
    height: "32px",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--text-main, #374151)",
    marginBottom: "3px",
    display: "block",
  };

  const optionStyle = {
    color: "var(--input-text, #0f172a)",
    backgroundColor: "var(--input-bg, #ffffff)",
    fontSize: "13px",
  };

  return (
    <div
      style={{
        padding: "8px 16px",
        backgroundColor: "var(--bg-card, #ffffff)",
        borderBottom: "1px solid var(--border-color, #e5e7eb)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Header Row: Title + Claim Count Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--text-main, #111827)",
            letterSpacing: "-0.01em",
          }}
        >
          FRA Claims Atlas
        </h2>
        <span
          style={{
            fontSize: "12px",
            backgroundColor: "rgba(37, 99, 235, 0.15)",
            color: "#3b82f6",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            padding: "2px 10px",
            borderRadius: "12px",
            fontWeight: "600",
          }}
        >
          {totalResults} {totalResults === 1 ? "Claim" : "Claims"} Displayed
        </span>
      </div>

      {/* Filter Controls Row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "flex-end",
        }}
      >
        {/* District Filter (220px) */}
        <div style={{ width: "220px" }}>
          <label htmlFor="district-select" style={labelStyle}>
            District
          </label>
          <select
            id="district-select"
            value={filters.district}
            onChange={handleDistrictChange}
            style={{ ...selectStyle, width: "100%" }}
          >
            <option value="" style={optionStyle}>
              All Districts
            </option>
            {districts.map((dist) => (
              <option key={dist} value={dist} style={optionStyle}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Mandal Filter (180px) */}
        <div style={{ width: "180px" }}>
          <label htmlFor="mandal-select" style={labelStyle}>
            Mandal
          </label>
          <select
            id="mandal-select"
            value={filters.mandal}
            onChange={handleMandalChange}
            style={{ ...selectStyle, width: "100%" }}
          >
            <option value="" style={optionStyle}>
              All Mandals
            </option>
            {mandals.map((mnd) => (
              <option key={mnd} value={mnd} style={optionStyle}>
                {mnd}
              </option>
            ))}
          </select>
        </div>

        {/* Village Filter (200px) */}
        <div style={{ width: "200px" }}>
          <label htmlFor="village-select" style={labelStyle}>
            Village
          </label>
          <select
            id="village-select"
            value={filters.village}
            onChange={handleVillageChange}
            style={{ ...selectStyle, width: "100%" }}
          >
            <option value="" style={optionStyle}>
              All Villages
            </option>
            {villages.map((vlg) => (
              <option key={vlg} value={vlg} style={optionStyle}>
                {vlg}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter (150px) */}
        <div style={{ width: "150px" }}>
          <label htmlFor="status-select" style={labelStyle}>
            Status
          </label>
          <select
            id="status-select"
            value={filters.status}
            onChange={handleStatusChange}
            style={{ ...selectStyle, width: "100%" }}
          >
            <option value="All" style={optionStyle}>
              All Statuses
            </option>
            <option value="Approved" style={optionStyle}>
              Approved
            </option>
            <option value="Pending" style={optionStyle}>
              Pending
            </option>
            <option value="Rejected" style={optionStyle}>
              Rejected
            </option>
          </select>
        </div>

        {/* Claim Type Filter (150px) */}
        <div style={{ width: "150px" }}>
          <label htmlFor="type-select" style={labelStyle}>
            Claim Type
          </label>
          <select
            id="type-select"
            value={filters.claim_type}
            onChange={handleClaimTypeChange}
            style={{ ...selectStyle, width: "100%" }}
          >
            <option value="All" style={optionStyle}>
              All Types
            </option>
            <option value="IFR" style={optionStyle}>
              IFR
            </option>
            <option value="CFR" style={optionStyle}>
              CFR
            </option>
          </select>
        </div>
      </div>

      {/* Search & Clear Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "2px",
        }}
      >
        {/* Claim ID Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label
            htmlFor="claim-search"
            style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-main, #374151)" }}
          >
            Search Claim ID:
          </label>
          <input
            id="claim-search"
            type="text"
            placeholder="e.g. FRA00043"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            style={{
              padding: "5px 10px",
              border: "1px solid var(--input-border, #d1d5db)",
              borderRadius: "4px",
              fontSize: "13px",
              color: "var(--input-text, #111827)",
              backgroundColor: "var(--input-bg, #ffffff)",
              width: "180px",
              height: "32px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        {/* Clear Filters Button */}
        <button
          type="button"
          onClick={onClearFilters}
          style={{
            padding: "5px 14px",
            backgroundColor: "var(--btn-secondary-bg, #f3f4f6)",
            color: "var(--btn-secondary-text, #374151)",
            border: "1px solid var(--btn-secondary-border, #d1d5db)",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            height: "32px",
            boxSizing: "border-box",
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
