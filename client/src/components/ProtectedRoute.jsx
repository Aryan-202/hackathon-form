// client/src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentAdmin, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // or a spinner component
  }
  return currentAdmin ? children : <Navigate to="/auth/login" />;
}