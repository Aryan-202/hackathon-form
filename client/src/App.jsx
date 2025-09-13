// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import StudentRoutes from './pages/Student/StudentRoutes';
import AdminRoutes from './pages/Admin/AdminRoutes';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Admin/Login'; // Import Login directly
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student/*" element={<StudentRoutes />} />
            
            {/* Login route - not protected */}
            <Route path="/auth/login" element={<Login />} />
            
            {/* All other auth routes are protected */}
            <Route 
              path="/admin/*" 
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