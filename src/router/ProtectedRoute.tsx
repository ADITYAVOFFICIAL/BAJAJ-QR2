import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import Spinner from "../components/common/Spinner"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectIfUnauthenticated?: string;
  redirectIfAuthenticated?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectIfUnauthenticated = "/login",
  redirectIfAuthenticated,
}) => {
  const { user, isLoading } = useAuth(); 
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  if (!user && !redirectIfAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to login.");
    return (
      <Navigate
        to={redirectIfUnauthenticated}
        state={{ from: location }}
        replace
      />
    );
  }

  if (user && redirectIfAuthenticated) {
    console.log(
      `ProtectedRoute: Authenticated, redirecting away from ${location.pathname} to ${redirectIfAuthenticated}.`
    );
    return <Navigate to={redirectIfAuthenticated} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
