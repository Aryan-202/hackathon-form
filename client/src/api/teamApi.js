// client/src/api/teamApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set up axios defaults
axios.defaults.withCredentials = true;

export const registerTeam = async (teamData) => {
  try {
    const response = await axios.post(`${API_URL}/teams`, teamData); // Remove /register
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (teamId, otpValues) => {
  try {
    const response = await axios.post(`${API_URL}/teams/verify-otp`, {
      teamId,
      otpValues
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};