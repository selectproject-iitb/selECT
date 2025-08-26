import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineLoading } from "react-icons/ai";

const PublicRoute = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

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

  if (isAuthenticated) {
    if (user?.role === "admin" && redirectTo === "/") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;
