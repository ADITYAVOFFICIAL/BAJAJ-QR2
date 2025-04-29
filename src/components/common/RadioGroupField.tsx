import React from "react";
import ErrorMessage from "./ErrorMessage";
import { FormFieldOption } from "../../types/form";

interface RadioGroupFieldProps {
  label: string;
  id: string; 
  name: string; 
  options: FormFieldOption[];
  selectedValue: string | undefined | null; 
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  error?: string | null;
  required?: boolean;
  dataTestId?: string;
}

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  label,
  id,
  name,
  options,
  selectedValue,
  onChange,
  error,
  required,
  dataTestId,
}) => {
  return (
    <fieldset className="mb-4" data-testid={dataTestId || `${id}-radiogroup`}>
      <legend className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </legend>
      <div className="mt-2 space-y-2">
        {options.map((option) => {
          const radioId = `${id}-${option.value}`; 
          return (
            <div key={option.value} className="flex items-center">
              <input
                id={radioId}
                name={name}
                type="radio"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={onChange}
                required={required} 
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                data-testid={option.dataTestId || `${radioId}-radio`}
              />
              <label
                htmlFor={radioId}
                className="ml-3 block text-sm text-gray-700"
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {error && <ErrorMessage message={error} />}
    </fieldset>
  );
};

export default RadioGroupField;
