import React from "react";
import { FormField } from "../../types/form"; 
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import TextareaField from "../common/TextareaField";
import RadioGroupField from "../common/RadioGroupField";
import CheckboxField from "../common/CheckboxField";

interface DynamicFieldRendererProps {
  field: FormField;
  value: any; 
  error?: string | null; 
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void; 
  onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; 
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field,
  value,
  error,
  onChange,
  onCheckboxChange, 
}) => {
  const commonProps = {
    id: field.fieldId,
    name: field.fieldId, 
    label: field.label,
    required: field.required,
    placeholder: field.placeholder,
    error: error,
    "data-testid": field.dataTestId, 
  };

  switch (field.type) {
    case "text":
    case "email":
    case "tel":
    case "date": 
      return (
        <InputField
          {...commonProps}
          type={field.type}
          value={value ?? ""} 
          onChange={onChange}
          minLength={field.minLength}
          maxLength={field.maxLength}
        />
      );

    case "textarea":
      return (
        <TextareaField
          {...commonProps}
          value={value ?? ""}
          onChange={onChange}
          minLength={field.minLength}
          maxLength={field.maxLength}
        />
      );

    case "dropdown":
      return (
        <SelectField
          {...commonProps}
          options={field.options || []}
          value={value ?? ""} 
          onChange={onChange}
        />
      );

    case "radio":
      return (
        <RadioGroupField
          label={commonProps.label}
          id={commonProps.id}
          name={commonProps.name}
          options={field.options || []}
          selectedValue={value}
          onChange={onChange}
          required={commonProps.required}
          error={commonProps.error}
          dataTestId={commonProps["data-testid"]}
        />
      );

    case "checkbox":
      const handleChange = onCheckboxChange ?? onChange;
      return (
        <CheckboxField
          {...commonProps}
          checked={!!value} 
          onChange={handleChange}
        />
      );

    default:
      console.warn(`Unsupported field type: ${field.type}`);
      return (
        <div className="mb-4 p-2 border border-dashed border-red-400 bg-red-50 text-red-700">
          Unsupported field type: "{field.type}" for field "{field.label}"
        </div>
      );
  }
};

export default DynamicFieldRenderer;
