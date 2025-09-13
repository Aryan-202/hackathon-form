// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { adminLogin } from "../api/adminApi";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on app load
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");

    if (token && adminData) {
      setCurrentAdmin(JSON.parse(adminData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await adminLogin(credentials);
      if (response.success) {
        setCurrentAdmin(response.admin);
      }
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCurrentAdmin(null);
      localStorage.removeItem("adminToken");
    }
  };

  const value = {
    currentAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
