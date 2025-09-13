// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import StudentRoutes from './pages/Student/StudentRoutes';
import AdminRoutes from './pages/Admin/AdminRoutes';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student/*" element={<StudentRoutes />} />
            <Route 
              path="/auth/*" 
              element={
                <ProtectedRoute>
                  <AdminRoutes />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;