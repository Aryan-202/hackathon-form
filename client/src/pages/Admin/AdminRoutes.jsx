// client/src/pages/Admin/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import TeamsList from './TeamsList';
import QualifiedTeams from './QualifiedTeams';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="teams" element={<TeamsList />} />
      <Route path="qualified" element={<QualifiedTeams />} />
    </Routes>
  );
}