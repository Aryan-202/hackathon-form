// client/src/pages/Admin/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { currentAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {currentAdmin?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/teams"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">All Teams</h3>
              <p className="mt-2 text-sm text-gray-500">
                View and manage all registered teams
              </p>
            </div>
          </Link>

          <Link
            to="/admin/qualified"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Qualified Teams</h3>
              <p className="mt-2 text-sm text-gray-500">
                View and manage teams qualified for Round 2
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}