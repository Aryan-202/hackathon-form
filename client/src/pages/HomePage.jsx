// client/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Hackathon Registration
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Welcome to the annual coding competition
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/student/register" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
          >
            Register as Student
          </Link>
          
          <Link 
            to="/admin/login" 
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
