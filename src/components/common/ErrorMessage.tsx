// src/components/common/ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  message: string | null | undefined;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  if (!message) {
    return null; // Don't render anything if there's no message
  }

  return (
    <p className={`mt-1 text-sm text-red-600 ${className}`} role="alert">
      {message}
    </p>
  );
};

export default ErrorMessage;
