import React from "react";
import ErrorMessage from "./ErrorMessage";

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string | null;
  dataTestId?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  id,
  error,
  required,
  className = "",
  dataTestId,
  ...props
}) => {
  const errorStyle = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";
  const baseStyle =
    "block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm";

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        required={required}
        className={`${baseStyle} ${errorStyle} ${className}`}
        data-testid={dataTestId || `${id}-textarea`}
        {...props}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default TextareaField;
