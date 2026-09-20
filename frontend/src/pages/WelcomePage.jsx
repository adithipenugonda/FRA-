import React from "react";
import { useTheme } from "../context/ThemeContext";

function WelcomePage({ onNavigate }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary, #0f172a)",
        color: "var(--text-main, #f8fafc)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          borderBottom: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
          backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontSize: "18px",
              color: "#ffffff",
              boxShadow: "0 0 12px rgba(37, 99, 235, 0.5)",
            }}
          >
            F
          </div>
          <div>
            <span style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "0.5px", color: "var(--text-main)" }}>
              FRA Atlas System
            </span>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "11px",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
                border: "1px solid rgba(96, 165, 250, 0.3)",
                padding: "2px 8px",
                borderRadius: "4px",
                fontWeight: "600",
              }}
            >
              Academic Prototype
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            style={{
              padding: "7px 12px",
              fontSize: "12px",
              fontWeight: "700",
              borderRadius: "6px",
              border: "1px solid var(--btn-secondary-border, #475569)",
              backgroundColor: "var(--btn-secondary-bg, #1e293b)",
              color: "var(--btn-secondary-text, #f8fafc)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          <button
            type="button"
            onClick={() => onNavigate("/login")}
            style={{
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: "600",
              borderRadius: "6px",
              border: "1px solid var(--border-color, #475569)",
              backgroundColor: "transparent",
              color: "var(--text-main, #f1f5f9)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => onNavigate("/signup")}
            style={{
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: "600",
              borderRadius: "6px",
              border: "1px solid #3b82f6",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
              transition: "all 0.15s ease",
            }}
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px 40px",
          textAlign: "center",
          position: "relative",
          background:
            theme === "dark"
              ? "radial-gradient(circle at 50% 30%, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 1) 70%)"
              : "radial-gradient(circle at 50% 30%, rgba(219, 234, 254, 0.6) 0%, rgba(248, 250, 252, 1) 70%)",
        }}
      >
        {/* Academic Prototype Banner */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: theme === "dark" ? "rgba(30, 41, 59, 0.8)" : "#e2e8f0",
            border: `1px solid ${theme === "dark" ? "rgba(148, 163, 184, 0.2)" : "#cbd5e1"}`,
            borderRadius: "20px",
            padding: "4px 14px",
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--text-muted, #94a3b8)",
            letterSpacing: "0.5px",
            marginBottom: "24px",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }}></span>
          ACADEMIC PROTOTYPE
        </div>

        {/* Hero Headings */}
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: "800",
            margin: "0 0 12px 0",
            color: "var(--text-main, #ffffff)",
            letterSpacing: "-0.5px",
            lineHeight: 1.15,
          }}
        >
          FRA Atlas System
        </h1>

        <h2
          style={{
            fontSize: "clamp(16px, 2.5vw, 22px)",
            fontWeight: "500",
            color: "#2563eb",
            margin: "0 0 20px 0",
            maxWidth: "750px",
            lineHeight: 1.4,
          }}
        >
          AI-Powered Forest Rights Act Monitoring &amp; WebGIS Decision Support System
        </h2>

        {/* Short Description */}
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-muted, #cbd5e1)",
            maxWidth: "680px",
            lineHeight: "1.6",
            margin: "0 0 32px 0",
          }}
        >
          An integrated prototype for visualizing, monitoring and analysing Forest Rights Act implementation using geospatial technologies and data-driven decision support.
        </p>

        {/* Main Action Buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => onNavigate("/login")}
            style={{
              padding: "14px 28px",
              fontSize: "15px",
              fontWeight: "700",
              borderRadius: "8px",
              border: "1px solid var(--border-color, #475569)",
              backgroundColor: "var(--bg-card, #1e293b)",
              color: "var(--text-main, #ffffff)",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.15s ease",
            }}
          >
            Sign In &rarr;
          </button>

          <button
            type="button"
            onClick={() => onNavigate("/signup")}
            style={{
              padding: "14px 28px",
              fontSize: "15px",
              fontWeight: "700",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
              transition: "transform 0.15s ease, background-color 0.15s ease",
            }}
          >
            Create Account
          </button>
        </div>
      </section>

      {/* Feature Preview Section */}
      <section
        style={{
          padding: "40px 20px 60px",
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main, #f8fafc)", margin: "0 0 6px 0" }}>
            Platform Modules &amp; Capabilities
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", margin: 0 }}>
            Academic research prototype platform for spatial monitoring
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Card 1: WebGIS Atlas */}
          <div
            style={{
              backgroundColor: "var(--bg-card, #1e293b)",
              borderRadius: "10px",
              padding: "24px",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(37, 99, 235, 0.15)",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              🗺️
            </div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main, #ffffff)" }}>
              WebGIS Atlas
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
              Interactive spatial visualization of FRA claims.
            </p>
          </div>

          {/* Card 2: Claims Analytics */}
          <div
            style={{
              backgroundColor: "var(--bg-card, #1e293b)",
              borderRadius: "10px",
              padding: "24px",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              📊
            </div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main, #ffffff)" }}>
              Claims Analytics
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
              Monitor claim status, distribution and processing trends.
            </p>
          </div>

          {/* Card 3: Decision Support */}
          <div
            style={{
              backgroundColor: "var(--bg-card, #1e293b)",
              borderRadius: "10px",
              padding: "24px",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              ⚖️
            </div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main, #ffffff)" }}>
              Decision Support
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
              Generate analytical insights for implementation monitoring.
            </p>
          </div>

          {/* Card 4: AI-Assisted Analysis */}
          <div
            style={{
              backgroundColor: "var(--bg-card, #1e293b)",
              borderRadius: "10px",
              padding: "24px",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(168, 85, 247, 0.15)",
                color: "#a855f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              🤖
            </div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main, #ffffff)" }}>
              AI-Assisted Analysis
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
              Support prioritization, prediction and claim-level analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer
        style={{
          padding: "20px",
          textAlign: "center",
          borderTop: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
          backgroundColor: theme === "dark" ? "#0b1329" : "#f1f5f9",
          fontSize: "12px",
          color: "var(--text-muted, #64748b)",
        }}
      >
        <p style={{ margin: 0 }}>
          FRA Atlas System &bull; Academic Research Prototype &bull; Forest Rights Act Decision Support Portal
        </p>
      </footer>
    </div>
  );
}

export default WelcomePage;
