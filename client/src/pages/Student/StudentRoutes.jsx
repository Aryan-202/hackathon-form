// client/src/pages/Student/StudentRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import OTPVerify from './OTPVerify';
import SuccessPage from './SuccessPage';

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="register" element={<RegisterForm />} />
      <Route path="verify-otp" element={<OTPVerify />} />
      <Route path="success" element={<SuccessPage />} />
    </Routes>
  );
}