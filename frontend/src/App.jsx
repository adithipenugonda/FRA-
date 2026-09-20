import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import MapView from "./MapView";
import Dashboard from "./Dashboard";
import Login from "./Login";
import WelcomePage from "./pages/WelcomePage";
import SignUp from "./pages/SignUp";
import OfficerDashboard from "./pages/OfficerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import SystemSettings from "./pages/SystemSettings";
import ClaimsList from "./pages/ClaimsList";
import ClaimDetail from "./pages/ClaimDetail";
import AIDSS from "./pages/AIDSS";

function MainApp() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || "/");

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path.split("?")[0]);
  };

  const role = user?.role || "officer";

  // Auto-redirection logic for authenticated vs unauthenticated users
  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      // If authenticated user visits public landing, login, or signup pages, redirect to their role dashboard
      if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
        const targetPath = role === "admin" ? "/admin" : "/dashboard";
        window.history.replaceState({}, "", targetPath);
        setCurrentPath(targetPath);
      } else if ((currentPath === "/users" || currentPath === "/settings") && role !== "admin") {
        // Officer trying to access admin-only route
        window.history.replaceState({}, "", "/dashboard");
        setCurrentPath("/dashboard");
      }
    }
  }, [isAuthenticated, loading, currentPath, role]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "var(--bg-primary, #f8fafc)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "var(--text-muted, #475569)",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        Initializing FRA Atlas Session...
      </div>
    );
  }

  // PUBLIC UNAUTHENTICATED ROUTING
  if (!isAuthenticated) {
    if (currentPath === "/login") {
      return <Login onNavigate={navigate} />;
    }
    if (currentPath === "/signup") {
      return <SignUp onNavigate={navigate} />;
    }
    // Default public page for unauthenticated users is WelcomePage ("/")
    return <WelcomePage onNavigate={navigate} />;
  }

  // AUTHENTICATED APPLICATION ROUTING
  const navButton = (path, label, isAdminOnly = false) => {
    if (isAdminOnly && role !== "admin") return null;

    const isActive =
      currentPath === path ||
      (path === "/dashboard" && currentPath === "/admin") ||
      (path === "/claims" && currentPath.startsWith("/claims"));

    return (
      <button
        key={path}
        type="button"
        onClick={() => navigate(path)}
        style={{
          padding: "6px 14px",
          fontSize: "13px",
          fontWeight: "600",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          backgroundColor: isActive ? "#2563eb" : "transparent",
          color: isActive ? "#ffffff" : "#94a3b8",
          transition: "all 0.15s ease",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </button>
    );
  };

  const handleInnerNavigate = (tabOrPath) => {
    if (typeof tabOrPath === "string") {
      if (tabOrPath.startsWith("/")) {
        navigate(tabOrPath);
      } else {
        navigate(`/${tabOrPath}`);
      }
    }
  };

  const renderContent = () => {
    // Dynamic matching for /claims/:claimId
    const claimIdMatch = currentPath.match(/^\/claims\/([A-Za-z0-9_]+)$/);
    if (claimIdMatch) {
      const claimId = claimIdMatch[1];
      return <ClaimDetail claimId={claimId} onNavigate={handleInnerNavigate} />;
    }

    switch (currentPath) {
      case "/admin":
        return role === "admin" ? (
          <AdminDashboard onNavigate={handleInnerNavigate} />
        ) : (
          <OfficerDashboard onNavigate={handleInnerNavigate} />
        );
      case "/dashboard":
        return role === "admin" ? (
          <AdminDashboard onNavigate={handleInnerNavigate} />
        ) : (
          <OfficerDashboard onNavigate={handleInnerNavigate} />
        );
      case "/map":
        return <MapView onNavigate={handleInnerNavigate} />;
      case "/claims":
        return <ClaimsList onNavigate={handleInnerNavigate} />;
      case "/analytics":
        return <Dashboard />;
      case "/ai":
        return <AIDSS />;
      case "/users":
        return role === "admin" ? (
          <UserManagement onNavigate={handleInnerNavigate} />
        ) : (
          <OfficerDashboard onNavigate={handleInnerNavigate} />
        );
      case "/settings":
        return role === "admin" ? (
          <SystemSettings onNavigate={handleInnerNavigate} />
        ) : (
          <OfficerDashboard onNavigate={handleInnerNavigate} />
        );
      default:
        return role === "admin" ? (
          <AdminDashboard onNavigate={handleInnerNavigate} />
        ) : (
          <OfficerDashboard onNavigate={handleInnerNavigate} />
        );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Navigation Header Bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 20px",
          backgroundColor: "var(--bg-header, #1e293b)",
          color: "#ffffff",
          zIndex: 2000,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          flexWrap: "wrap",
          gap: "10px",
          borderBottom: "1px solid var(--border-color, #334155)",
        }}
      >
        {/* Logo / System Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "0.5px", cursor: "pointer" }}
            onClick={() => navigate(role === "admin" ? "/admin" : "/dashboard")}
          >
            FRA Atlas System
          </span>
          <span
            style={{
              fontSize: "11px",
              backgroundColor: "#334155",
              color: "#cbd5e1",
              padding: "2px 8px",
              borderRadius: "4px",
              fontWeight: "600",
            }}
          >
            Prototype Dataset
          </span>
        </div>

        {/* Role-Aware View Switcher Navigation */}
        <div style={{ display: "flex", gap: "4px", backgroundColor: "#0f172a", padding: "3px", borderRadius: "6px", overflowX: "auto" }}>
          {navButton("/dashboard", "Dashboard")}
          {navButton("/map", "WebGIS Map")}
          {navButton("/claims", "Claims")}
          {navButton("/analytics", "Analytics")}
          {navButton("/ai", "AI / DSS")}
          {navButton("/users", "User Management", true)}
          {navButton("/settings", "System Settings", true)}
        </div>

        {/* Logged-in User Identity, Theme Toggle & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            style={{
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: "700",
              backgroundColor: "#334155",
              color: "#f8fafc",
              border: "1px solid #475569",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            <span style={{ color: "#94a3b8" }}>
              {role === "admin" ? "Admin:" : "Officer:"}
            </span>
            <span style={{ fontWeight: "700", color: "#f8fafc" }}>
              {user?.username}
            </span>
            <span
              style={{
                fontSize: "11px",
                backgroundColor: role === "admin" ? "#dc2626" : "#2563eb",
                color: "#ffffff",
                padding: "1px 6px",
                borderRadius: "3px",
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              {role}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: "600",
              backgroundColor: "#334155",
              color: "#f1f5f9",
              border: "1px solid #475569",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, position: "relative" }}>
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;