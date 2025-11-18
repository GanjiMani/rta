import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false, amcOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Checking auth...</div>; // Wait for auth to initialize

  const isLoggedIn = Boolean(user);
  const role = user?.role || null;

  const adminRoles = new Set(["admin", "RTA CEO"]);

  if (!isLoggedIn) {
    if (adminOnly) return <Navigate to="/admin/login" replace />;
    if (amcOnly) return <Navigate to="/amc/login" replace />;
    return <Navigate to="/login" replace />;
  }

  if ((adminOnly || amcOnly) && (role === "investor" || role === "user")) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !adminRoles.has(role)) {
    return <Navigate to="/admin/login" replace />;
  }

  if (amcOnly && role !== "amc") {
    return <Navigate to="/amc/login" replace />;
  }

  if (!adminOnly && !amcOnly) {
    if (adminRoles.has(role)) {
      return <Navigate to="/admin/admindashboard" replace />;
    }
    if (role === "amc") {
      return <Navigate to="/amc" replace />;
    }
    if (role === "investor" || role === "user") {
      return children;
    }
  }

  return <Navigate to="/" replace />;
}
