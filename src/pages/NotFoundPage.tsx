import React from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";

const NotFoundPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <Link
          to="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Go to Login
        </Link>
      </div>
    </PageWrapper>
  );
};

export default NotFoundPage; 
