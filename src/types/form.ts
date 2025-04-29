export interface FormResponse {
  message: string;
  form: {
    formTitle: string;
    formId: string;
    version: string;
    sections: FormSection[];
  };
}

export interface FormSection {
  sectionId: number;
  title: string;
  description: string;
  fields: FormField[];
}

export type FieldType =
  | "text"
  | "tel"
  | "email"
  | "textarea"
  | "date"
  | "dropdown"
  | "radio"
  | "checkbox";

export interface FormFieldOption {
  value: string;
  label: string;
  dataTestId?: string;
}

export interface FormFieldValidation {
  message: string;
}

export interface FormField {
  fieldId: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  dataTestId: string;
  validation?: FormFieldValidation;
  options?: FormFieldOption[]; 
  maxLength?: number;
  minLength?: number;
}
