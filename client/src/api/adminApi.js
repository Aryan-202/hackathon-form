import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Set up axios defaults with auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTeams = async (filter = "all") => {
  try {
    const response = await axios.get(`${API_URL}/teams?filter=${filter}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminLogout = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`);
    localStorage.removeItem('adminToken');
    return response.data;
  } catch (error) {
    localStorage.removeItem('adminToken');
    throw error;
  }
};

export const qualifyTeam = async (teamId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/teams/${teamId}/status`,
      { status: 'qualified' }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const exportTeams = async (filter = "all") => {
  try {
    const response = await axios.get(
      `${API_URL}/teams/export/excel?filter=${filter}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    return { success: true, url };
  } catch (error) {
    throw error;
  }
};