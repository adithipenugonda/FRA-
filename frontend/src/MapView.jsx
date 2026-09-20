import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ClaimMarkers from "./ClaimMarkers";
import FilterPanel from "./FilterPanel";
import { useTheme } from "./context/ThemeContext";

const DEFAULT_FILTERS = {
  district: "",
  mandal: "",
  village: "",
  status: "All",
  claim_type: "All",
  searchQuery: "",
};

function MapController({ targetPosition }) {
  const map = useMap();
  useEffect(() => {
    if (targetPosition) {
      map.flyTo(targetPosition, 14, { animate: true, duration: 1.2 });
    }
  }, [targetPosition, map]);
}

function MapView({ onNavigate }) {
  const { theme } = useTheme();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [claims, setClaims] = useState([]);
  const [initialAllClaims, setInitialAllClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null);

  const rawCartoKey = import.meta.env.VITE_CARTO_API_KEY || "";
  const cartoApiKey = rawCartoKey.trim().replace(/^["']|["']$/g, "");
  const isPlaceholderKey =
    !cartoApiKey ||
    cartoApiKey === "YOUR_KEY_HERE" ||
    cartoApiKey.toLowerCase().includes("your_key") ||
    cartoApiKey.toLowerCase().includes("placeholder") ||
    cartoApiKey.length < 20;
  const hasValidCartoKey = !isPlaceholderKey;

  let tileUrl = "";
  let referenceTileUrl = "";
  let tileAttribution = "";

  if (theme === "dark") {
    if (hasValidCartoKey) {
      tileUrl = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`;
      tileAttribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    } else {
      tileUrl =
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
      referenceTileUrl =
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";
      tileAttribution =
        'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community';
    }
  } else {
    if (hasValidCartoKey) {
      tileUrl = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`;
      tileAttribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    } else {
      tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      tileAttribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  }

  // Inspect URL query params for claimId (e.g. /map?claimId=FRA00043)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const claimIdParam = params.get("claimId");
    if (claimIdParam) {
      setFilters((prev) => ({ ...prev, searchQuery: claimIdParam }));
    }
  }, []);

  // Initial fetch for baseline options
  useEffect(() => {
    fetch("http://127.0.0.1:8000/map/claims?limit=500")
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data.features || []).map((claim) => {
          const [longitude, latitude] = claim.geometry.coordinates;
          return {
            ...claim,
            position: [latitude, longitude],
          };
        });
        setInitialAllClaims(formatted);
        setClaims(formatted);
      })
      .catch((err) => {
        console.error("Error loading initial claims:", err);
      });
  }, []);

  // Fetch filtered claims whenever backend filters change
  useEffect(() => {
    setLoading(true);
    setError(null);

    let url = "http://127.0.0.1:8000/map/claims?limit=500";
    if (filters.district) {
      url += `&district=${encodeURIComponent(filters.district)}`;
    }
    if (filters.mandal) {
      url += `&mandal=${encodeURIComponent(filters.mandal)}`;
    }
    if (filters.village) {
      url += `&village=${encodeURIComponent(filters.village)}`;
    }
    if (filters.status && filters.status !== "All") {
      url += `&status=${encodeURIComponent(filters.status)}`;
    }
    if (filters.claim_type && filters.claim_type !== "All") {
      url += `&claim_type=${encodeURIComponent(filters.claim_type)}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch claims data");
        }
        return res.json();
      })
      .then((data) => {
        const formatted = (data.features || []).map((claim) => {
          const [longitude, latitude] = claim.geometry.coordinates;
          return {
            ...claim,
            position: [latitude, longitude],
          };
        });
        setClaims(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching filtered claims:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [
    filters.district,
    filters.mandal,
    filters.village,
    filters.status,
    filters.claim_type,
  ]);

  // Derive dropdown options dynamically for cascading selection
  const districts = useMemo(() => {
    const list = initialAllClaims
      .map((c) => c.properties.district)
      .filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [initialAllClaims]);

  const mandals = useMemo(() => {
    const list = initialAllClaims
      .filter((c) => !filters.district || c.properties.district === filters.district)
      .map((c) => c.properties.mandal)
      .filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [initialAllClaims, filters.district]);

  const villages = useMemo(() => {
    const list = initialAllClaims
      .filter(
        (c) =>
          (!filters.district || c.properties.district === filters.district) &&
          (!filters.mandal || c.properties.mandal === filters.mandal)
      )
      .map((c) => c.properties.village)
      .filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [initialAllClaims, filters.district, filters.mandal]);

  // Filter claims by Claim ID search query
  const displayedClaims = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();
    if (!query) return claims;
    return claims.filter((c) =>
      c.properties.claim_id.toLowerCase().includes(query)
    );
  }, [claims, filters.searchQuery]);

  // Auto-focus map when a search query matches an individual claim
  useEffect(() => {
    const query = filters.searchQuery.trim().toLowerCase();
    if (!query) {
      setTargetPosition(null);
      return;
    }
    const exactMatch = displayedClaims.find(
      (c) => c.properties.claim_id.toLowerCase() === query
    );
    if (exactMatch && exactMatch.position) {
      setTargetPosition(exactMatch.position);
    } else if (displayedClaims.length === 1 && displayedClaims[0].position) {
      setTargetPosition(displayedClaims[0].position);
    }
  }, [filters.searchQuery, displayedClaims]);

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setTargetPosition(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 50px)", width: "100%" }}>
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        districts={districts}
        mandals={mandals}
        villages={villages}
        totalResults={displayedClaims.length}
      />

      <div style={{ flex: 1, position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1000,
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: "6px 12px",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              fontSize: "13px",
              fontWeight: 500,
              color: "#2563eb",
            }}
          >
            Loading claims...
          </div>
        )}

        {error && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1000,
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "6px 12px",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Error: {error}
          </div>
        )}

        <MapContainer
          center={[17.4, 78.5]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            key={`${theme}-base`}
            attribution={tileAttribution}
            url={tileUrl}
          />
          {referenceTileUrl && (
            <TileLayer
              key={`${theme}-reference`}
              url={referenceTileUrl}
            />
          )}

          <MapController targetPosition={targetPosition} />

          <ClaimMarkers claims={displayedClaims} onNavigate={onNavigate} />
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;