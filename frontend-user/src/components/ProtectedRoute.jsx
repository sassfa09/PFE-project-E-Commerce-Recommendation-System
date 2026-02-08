import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // إيلا كان باقي السيت كيتحقق من المستخدم، ما نبينو والو (أو نبينو Spinner)
  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-pacific animate-pulse">Chargement...</div>;

  // إيلا كان المستخدم موجود، نبينو الصفحة (Outlet)، إيلا لا، نصيفطوه للـ Login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;