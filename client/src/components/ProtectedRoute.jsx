import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentAdmin, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to the correct login path
  return currentAdmin ? children : <Navigate to="/auth/login" />;
}