// client/src/api/teamApi.js
import axios from 'axios';

console.log('Environment variables:', import.meta.env);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

const API_URL = import.meta.env.VITE_API_URL;

// Set up axios defaults
axios.defaults.withCredentials = true;

export const registerTeam = async (teamData) => {
  try {
    const response = await axios.post(`${API_URL}/api/teams`, teamData); // Remove /register
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (teamId, otpValues) => {
  try {
    const response = await axios.post(`${API_URL}/api/otp/verify`, {
      teamId,
      otpValues
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};