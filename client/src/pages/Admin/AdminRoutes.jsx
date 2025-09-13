// client/src/pages/Admin/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import TeamsList from './TeamsList';
import QualifiedTeams from './QualifiedTeams';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} /> {/* Default admin route */}
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="teams" element={<TeamsList />} />
      <Route path="qualified" element={<QualifiedTeams />} />
    </Routes>
  );
}