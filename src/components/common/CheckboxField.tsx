import React from "react";
import ErrorMessage from "./ErrorMessage";

interface CheckboxFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string; 
  id: string;
  error?: string | null;
  dataTestId?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  error,
  required, 
  className = "",
  dataTestId,
  checked,
  onChange,
  ...props
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            required={required}
            className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ${className}`}
            data-testid={dataTestId || `${id}-checkbox`}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={id} className="font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
      </div>
      {error && <ErrorMessage message={error} className="mt-1 ml-7" />}{" "}
    </div>
  );
};

export default CheckboxField;
