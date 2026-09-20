import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("fra_atlas_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("fra_atlas_token") || null;
  });

  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    if (token) {
      fetch("http://127.0.0.1:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((userData) => {
          setUser(userData);
          localStorage.setItem("fra_atlas_user", JSON.stringify(userData));
          setLoading(false);
        })
        .catch(() => {
          // Token expired or invalid
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || "Invalid credentials. Please try again.",
        };
      }

      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("fra_atlas_token", data.access_token);
      localStorage.setItem("fra_atlas_user", JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      console.error("Login API error:", err);
      return {
        success: false,
        error: "Unable to connect to authentication server.",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("fra_atlas_token");
    localStorage.removeItem("fra_atlas_user");
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
