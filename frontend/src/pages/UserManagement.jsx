import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function UserManagement({ onNavigate }) {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New User Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("officer");
  const [createError, setCreateError] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const fetchUsers = () => {
    if (!token) return;
    setLoading(true);

    fetch("http://127.0.0.1:8000/auth/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          throw new Error("403 Forbidden: You do not have permission to access User Management. Admin role required.");
        }
        if (!res.ok) {
          throw new Error(`Failed to load users (HTTP ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!newUsername.trim() || !newEmail.trim() || !newPassword) {
      setCreateError("All fields are required.");
      return;
    }

    setCreateSubmitting(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername.trim(),
          email: newEmail.trim(),
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.detail || "Failed to create user account.");
        setCreateSubmitting(false);
        return;
      }

      setCreateSubmitting(false);
      setShowCreateModal(false);
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("officer");
      fetchUsers();
    } catch (err) {
      setCreateError("Connection error while creating user.");
      setCreateSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/auth/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "Unable to update status.");
        return;
      }

      fetchUsers();
    } catch (err) {
      alert("Error toggling user status.");
    }
  };

  // Frontend Role Guard check
  if (user?.role !== "admin") {
    return (
      <div style={{ padding: "40px 24px", maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", border: `1px solid ${theme === "dark" ? "#b91c1c" : "#fca5a5"}`, borderRadius: "8px", padding: "20px", color: theme === "dark" ? "#f87171" : "#991b1b" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>403 Forbidden: Access Restricted</h2>
          <p style={{ margin: "0 0 16px", fontSize: "14px" }}>
            User Management is an <strong>Admin-only</strong> feature. Your account (<code>{user?.username}</code>) is assigned the <strong>Officer</strong> role.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            style={{ padding: "8px 16px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}
          >
            Return to Officer Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted, #475569)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        Loading Registered System Users...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", border: `1px solid ${theme === "dark" ? "#b91c1c" : "#fca5a5"}`, borderRadius: "8px", padding: "20px", color: theme === "dark" ? "#f87171" : "#991b1b" }}>
          <h3 style={{ margin: "0 0 8px" }}>Access Error</h3>
          <p style={{ margin: "0 0 16px" }}>{error}</p>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            style={{ padding: "6px 14px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "var(--bg-primary, #f8fafc)", minHeight: "calc(100vh - 50px)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>
            User Management Portal
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
            Admin Panel — View and manage registered system accounts, roles, and status privileges.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2", color: theme === "dark" ? "#f87171" : "#991b1b", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
            ADMIN PRIVILEGE
          </span>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "700",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
            }}
          >
            + Create New User
          </button>
        </div>
      </div>

      {/* Users Table Card */}
      <div style={{ backgroundColor: "var(--bg-card, #ffffff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--table-header-bg, #f1f5f9)", borderBottom: "1px solid var(--table-border, #e2e8f0)", color: "var(--text-muted, #475569)", fontWeight: "700" }}>
                <th style={{ padding: "12px 16px" }}>ID</th>
                <th style={{ padding: "12px 16px" }}>Username</th>
                <th style={{ padding: "12px 16px" }}>Email</th>
                <th style={{ padding: "12px 16px" }}>Role</th>
                <th style={{ padding: "12px 16px" }}>Account Status</th>
                <th style={{ padding: "12px 16px" }}>Created Date</th>
                <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--table-border, #f1f5f9)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted, #64748b)" }}>#{u.id}</td>
                  <td style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text-main, #0f172a)" }}>{u.username}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-main, #334155)" }}>{u.email}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        backgroundColor: u.role === "admin"
                          ? theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fef2f2"
                          : theme === "dark" ? "rgba(37, 99, 235, 0.2)" : "#eff6ff",
                        color: u.role === "admin"
                          ? theme === "dark" ? "#f87171" : "#dc2626"
                          : theme === "dark" ? "#60a5fa" : "#2563eb",
                        border: `1px solid ${u.role === "admin" ? (theme === "dark" ? "rgba(248, 113, 113, 0.3)" : "#fecaca") : (theme === "dark" ? "rgba(96, 165, 250, 0.3)" : "#bfdbfe")}`,
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "12px", color: u.is_active ? "#16a34a" : "#dc2626", fontWeight: "700" }}>
                      ● {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted, #64748b)", fontSize: "13px" }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    {u.id !== user.id && (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id, u.is_active)}
                        style={{
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: "600",
                          backgroundColor: u.is_active
                            ? theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fee2e2"
                            : theme === "dark" ? "rgba(22, 163, 74, 0.2)" : "#dcfce7",
                          color: u.is_active
                            ? theme === "dark" ? "#f87171" : "#b91c1c"
                            : theme === "dark" ? "#4ade80" : "#15803d",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {u.is_active ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin User Creation Modal */}
      {showCreateModal && (
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
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              backgroundColor: "var(--modal-bg, #ffffff)",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
              border: "1px solid var(--border-color, #e2e8f0)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ backgroundColor: "var(--bg-header, #1e293b)", color: "#ffffff", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Admin: Create System User Account</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleCreateUser} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {createError && (
                <div style={{ backgroundColor: theme === "dark" ? "rgba(220, 38, 38, 0.2)" : "#fef2f2", border: `1px solid ${theme === "dark" ? "#b91c1c" : "#fecaca"}`, color: theme === "dark" ? "#f87171" : "#991b1b", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                  {createError}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-main, #374151)", marginBottom: "4px" }}>
                  Username <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "13px", border: "1px solid var(--input-border, #cbd5e1)", borderRadius: "6px", boxSizing: "border-box", outline: "none", backgroundColor: "var(--input-bg, #ffffff)", color: "var(--input-text, #0f172a)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-main, #374151)", marginBottom: "4px" }}>
                  Email Address <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="user@fra.gov.in"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "13px", border: "1px solid var(--input-border, #cbd5e1)", borderRadius: "6px", boxSizing: "border-box", outline: "none", backgroundColor: "var(--input-bg, #ffffff)", color: "var(--input-text, #0f172a)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-main, #374151)", marginBottom: "4px" }}>
                  Password <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="password"
                  placeholder="Set initial password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "13px", border: "1px solid var(--input-border, #cbd5e1)", borderRadius: "6px", boxSizing: "border-box", outline: "none", backgroundColor: "var(--input-bg, #ffffff)", color: "var(--input-text, #0f172a)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-main, #374151)", marginBottom: "4px" }}>
                  Role Assignment <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "13px", border: "1px solid var(--input-border, #cbd5e1)", borderRadius: "6px", backgroundColor: "var(--input-bg, #ffffff)", color: "var(--input-text, #0f172a)" }}
                >
                  <option value="officer">Officer (Standard Operational Access)</option>
                  <option value="admin">Admin (Full System &amp; User Administration)</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: "8px 14px", backgroundColor: "var(--btn-secondary-bg, #ffffff)", border: "1px solid var(--btn-secondary-border, #cbd5e1)", color: "var(--btn-secondary-text)", borderRadius: "4px", fontSize: "13px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                >
                  {createSubmitting ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
