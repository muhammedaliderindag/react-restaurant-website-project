import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}