import React from "react";
import ErrorMessage from "./ErrorMessage";
import { FormFieldOption } from "../../types/form"; 

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: FormFieldOption[]; 
  error?: string | null;
  placeholder?: string; 
  dataTestId?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  options,
  error,
  required,
  placeholder,
  className = "",
  dataTestId,
  value, 
  ...props
}) => {
  const errorStyle = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";
  const baseStyle =
    "block w-full pl-3 pr-10 py-2 border rounded-md bg-white focus:outline-none sm:text-sm";

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        required={required}
        className={`${baseStyle} ${errorStyle} ${className}`}
        data-testid={dataTestId || `${id}-select`}
        value={value ?? ""} 
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            data-testid={option.dataTestId}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default SelectField;
