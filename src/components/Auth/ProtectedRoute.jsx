import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineLoading } from "react-icons/ai";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  adminOnly = false,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AiOutlineLoading className="animate-spin text-primary h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && (!isAuthenticated || user?.role !== "admin")) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    if (location.pathname === "/login") {
      return <Navigate to="/" replace />;
    }
    if (location.pathname === "/admin/login" && user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
