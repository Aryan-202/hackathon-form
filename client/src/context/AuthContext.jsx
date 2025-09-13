// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { adminLogin, adminLogout } from "../api/adminApi"; // Added adminLogout import

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
        // Store admin data in localStorage
        localStorage.setItem("adminData", JSON.stringify(response.admin));
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
      localStorage.removeItem("adminData"); // Also remove adminData
    }
  };

  const value = {
    currentAdmin,
    login,
    logout,
    loading // Make sure to expose loading state
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* Remove the conditional rendering */}
    </AuthContext.Provider>
  );
}