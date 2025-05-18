import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { token, user, loading } = useAuth();

  if (loading) return null;
  if (!token || !user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;

  return children;
}