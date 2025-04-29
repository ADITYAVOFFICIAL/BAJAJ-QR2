import React from "react";
import Spinner from "./Spinner"; 
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  isLoading = false,
  disabled,
  variant = "primary", 
  ...props
}) => {
  const baseStyle =
    "flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = {
    primary:
      "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
  };
  const disabledStyle = "opacity-50 cursor-not-allowed";

  const combinedClassName = `
        ${baseStyle}
        ${variantStyles[variant]}
        ${disabled || isLoading ? disabledStyle : ""}
        ${className} // Allow overriding or adding styles
    `;

  return (
    <button
      className={combinedClassName.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : children}
    </button>
  );
};

export default Button;
