import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // <-- Uses <Routes>
import Spinner from "../components/common/Spinner";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../features/auth/hooks/useAuth"; // Adjust path if needed

const LoginPage = lazy(() => import("../pages/LoginPage"));
const FormPage = lazy(() => import("../pages/FormPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const RootRedirector: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  return <Navigate to={user ? "/form" : "/login"} replace />;
};

const AppRouter: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner />
          <span className="ml-2">Loading page...</span>
        </div>
      }
    >
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedRoute redirectIfAuthenticated="/form">
              <LoginPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/form"
          element={
            <ProtectedRoute redirectIfUnauthenticated="/login">
              <FormPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<RootRedirector />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
