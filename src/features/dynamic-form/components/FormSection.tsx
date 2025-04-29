import React from "react";
import { FormSection as FormSectionType } from "../../../types/form"; // Rename import to avoid conflict
import DynamicFieldRenderer from "../../../components/form/DynamicFieldRenderer"; // The component that renders individual fields

type FormData = Record<string, any>;
type FormErrors = Record<string, string | null>;

interface FormSectionProps {
  section: FormSectionType;
  formData: FormData;
  errors: FormErrors;
  onInputChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-1 text-gray-800">
        {section.title}
      </h2>
      <p className="text-sm text-gray-600 mb-6">{section.description}</p>

      <div className="space-y-4">
        {section.fields.map((field) => (
          <DynamicFieldRenderer
            key={field.fieldId} 
            field={field}
            value={formData[field.fieldId]}
            error={errors[field.fieldId]} 
            onChange={onInputChange}
          />
        ))}
      </div>
    </div>
  );
};

export default FormSection;
