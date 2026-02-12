import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext);

  if (loading) return null; 

  if (!admin) {
    
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;