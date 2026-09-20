import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function SignUp({ onNavigate }) {
  const { theme, toggleTheme } = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Frontend Validations
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!username.trim()) {
      setErrorMessage("Please enter a username.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          username: username.trim(),
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.detail || "Registration failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Account created successfully. Please sign in.");
      setIsSubmitting(false);

      // Redirect to /login after a brief delay
      setTimeout(() => {
        onNavigate("/login");
      }, 1500);
    } catch (err) {
      setErrorMessage("Unable to connect to the server. Please check backend connection.");
      setIsSubmitting(false);
    }
  };

  const handleBackToWelcome = () => {
    onNavigate("/");
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
            Create Officer Account
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>
            Register to access FRA Atlas Monitoring &amp; Decision Support
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

          {successMessage && (
            <div
              style={{
                backgroundColor: theme === "dark" ? "rgba(16, 185, 129, 0.2)" : "#ecfdf5",
                border: `1px solid ${theme === "dark" ? "#059669" : "#a7f3d0"}`,
                color: theme === "dark" ? "#34d399" : "#065f46",
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-fullname"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-main, #374151)",
                  marginBottom: "5px",
                }}
              >
                Full Name <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id="signup-fullname"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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

            {/* Email */}
            <div>
              <label
                htmlFor="signup-email"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-main, #374151)",
                  marginBottom: "5px",
                }}
              >
                Email Address <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            {/* Username */}
            <div>
              <label
                htmlFor="signup-username"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-main, #374151)",
                  marginBottom: "5px",
                }}
              >
                Username <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id="signup-username"
                type="text"
                placeholder="Choose a username"
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
                htmlFor="signup-password"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-main, #374151)",
                  marginBottom: "5px",
                }}
              >
                Password <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="signup-confirmpassword"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-main, #374151)",
                  marginBottom: "5px",
                }}
              >
                Confirm Password <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="signup-confirmpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
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
                marginTop: "8px",
                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
              }}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer Link */}
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
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("/login")}
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
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
