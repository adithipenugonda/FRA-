import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

function Login({ onNavigate }) {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(username, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error);
    }
  };

  const handleQuickFill = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrorMessage("");
  };

  const handleBackToWelcome = () => {
    if (onNavigate) {
      onNavigate("/");
    } else {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary, #f1f5f9)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "20px",
        boxSizing: "border-box",
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "var(--bg-card, #ffffff)",
          borderRadius: "8px",
          boxShadow: "var(--card-shadow, 0 4px 6px -1px rgba(0,0,0,0.1))",
          border: "1px solid var(--border-color, #e2e8f0)",
          overflow: "hidden",
        }}
      >
        {/* Card Header */}
        <div
          style={{
            backgroundColor: "var(--bg-header, #1e293b)",
            color: "#ffffff",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <button
              type="button"
              onClick={handleBackToWelcome}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                padding: "2px 0",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              &larr; Back to Welcome
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={toggleTheme}
                title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
                style={{
                  padding: "3px 8px",
                  fontSize: "11px",
                  fontWeight: "700",
                  backgroundColor: "#334155",
                  color: "#f8fafc",
                  border: "1px solid #475569",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>

              <div
                style={{
                  fontSize: "11px",
                  backgroundColor: "#334155",
                  color: "#cbd5e1",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: "600",
                }}
              >
                PROTOTYPE
              </div>
            </div>
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "700", textAlign: "center" }}>
            FRA Atlas System
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>
            Forest Rights Act Decision Support &amp; WebGIS Portal
          </p>
        </div>

        {/* Card Body */}
        <div style={{ padding: "24px" }}>
          {errorMessage && (
            <div
              style={{
                backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fef2f2",
                border: `1px solid ${theme === "dark" ? "#b91c1c" : "#fecaca"}`,
                color: theme === "dark" ? "#f87171" : "#991b1b",
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Username / Email */}
            <div>
              <label
                htmlFor="login-username"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-main, #374151)",
                  marginBottom: "6px",
                }}
              >
                Username or Email <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id="login-username"
                type="text"
                placeholder="Enter username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  fontSize: "14px",
                  border: "1px solid var(--input-border, #cbd5e1)",
                  borderRadius: "6px",
                  boxSizing: "border-box",
                  outline: "none",
                  backgroundColor: "var(--input-bg, #ffffff)",
                  color: "var(--input-text, #0f172a)",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-main, #374151)",
                  marginBottom: "6px",
                }}
              >
                Password <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 40px 9px 12px",
                    fontSize: "14px",
                    border: "1px solid var(--input-border, #cbd5e1)",
                    borderRadius: "6px",
                    boxSizing: "border-box",
                    outline: "none",
                    backgroundColor: "var(--input-bg, #ffffff)",
                    color: "var(--input-text, #0f172a)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "var(--text-muted, #64748b)",
                    padding: "2px",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "11px",
                backgroundColor: isSubmitting ? "#93c5fd" : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                marginTop: "4px",
                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
              }}
            >
              {isSubmitting ? "Signing in..." : "Sign In to FRA Atlas"}
            </button>
          </form>

          {/* Footer Link to Sign Up */}
          <div
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border-color, #f1f5f9)",
              textAlign: "center",
              fontSize: "13px",
              color: "var(--text-muted, #64748b)",
            }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate("/signup") : (window.location.href = "/signup"))}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                fontWeight: "700",
                cursor: "pointer",
                padding: 0,
                fontSize: "13px",
                textDecoration: "underline",
              }}
            >
              Create Account
            </button>
          </div>

          {/* Development / Demo Accounts Helper */}
          <div
            style={{
              marginTop: "16px",
              paddingTop: "14px",
              borderTop: "1px dashed var(--border-color, #e2e8f0)",
              fontSize: "12px",
              color: "var(--text-muted, #64748b)",
            }}
          >
            <span style={{ fontWeight: "700", color: "var(--text-main, #475569)", display: "block", marginBottom: "8px" }}>
              DEVELOPMENT ACCOUNTS:
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => handleQuickFill("officer", "officer123")}
                style={{
                  flex: 1,
                  padding: "6px",
                  fontSize: "12px",
                  backgroundColor: "var(--btn-secondary-bg, #f8fafc)",
                  border: "1px solid var(--btn-secondary-border, #cbd5e1)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: "var(--btn-secondary-text, #334155)",
                  fontWeight: "600",
                }}
              >
                Officer (officer/officer123)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("admin", "admin123")}
                style={{
                  flex: 1,
                  padding: "6px",
                  fontSize: "12px",
                  backgroundColor: "var(--btn-secondary-bg, #f8fafc)",
                  border: "1px solid var(--btn-secondary-border, #cbd5e1)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: "var(--btn-secondary-text, #334155)",
                  fontWeight: "600",
                }}
              >
                Admin (admin/admin123)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
