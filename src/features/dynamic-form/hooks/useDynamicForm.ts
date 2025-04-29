// src/features/dynamic-form/hooks/useDynamicForm.ts
import { useState, useCallback, useMemo, useEffect } from "react";
import { FormResponse, FormField, FormSection } from "../../../types/form"; // Adjust path if your types are elsewhere
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateEmail,
  validatePhoneNumber,
  // Import other validators if you created them
} from "../../../utils/validation"; // Adjust path to your validation utils

// Define the structure for form data and errors
// Using Record for flexibility, keys are fieldId, values depend on field type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormData = Record<string, any>;
// Keys are fieldId, value is the error message string or null if valid
type FormErrors = Record<string, string | null>;

// Define the return type of the hook for clarity
interface UseDynamicFormReturn {
  formData: FormData;
  errors: FormErrors;
  currentSectionIndex: number;
  isCurrentSectionValid: boolean;
  isSubmitting: boolean;
  handleInputChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSubmit: () => void;
  currentSectionData: FormSection | null; // Expose current section details
  totalSections: number; // Expose total number of sections
}

/**
 * Custom hook to manage the state and logic of a dynamic multi-section form.
 * @param formDefinition The structure of the form fetched from the API.
 * @returns An object containing form state, errors, navigation handlers, and validation status.
 */
export const useDynamicForm = (
  formDefinition: FormResponse["form"] | null
): UseDynamicFormReturn => {
  // State for the form data (fieldId -> value)
  const [formData, setFormData] = useState<FormData>({});
  // State for validation errors (fieldId -> errorMessage | null)
  const [errors, setErrors] = useState<FormErrors>({});
  // State for the currently displayed section index
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  // State to track submission status (for loading indicators/disabling buttons)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Effects ---

  // Reset form state completely if the form definition itself changes
  useEffect(() => {
    console.log("Form definition changed, resetting form state.");
    setFormData({});
    setErrors({});
    setCurrentSectionIndex(0);
    setIsSubmitting(false);
  }, [formDefinition]); // Dependency: run only when formDefinition object reference changes

  // --- Memoized Values ---

  // Memoize sections array to avoid recalculating on every render
  const sections = useMemo(
    () => formDefinition?.sections ?? [],
    [formDefinition]
  );

  // Memoize the data for the current section
  const currentSectionData = useMemo(() => {
    return sections[currentSectionIndex] ?? null;
  }, [sections, currentSectionIndex]);

  // Memoize the total number of sections
  const totalSections = useMemo(() => sections.length, [sections]);

  // --- Validation Logic ---

  /**
   * Validates a single field based on its definition and current value.
   * @param field The FormField definition object.
   * @param value The current value of the field from formData.
   * @returns An error message string if invalid, or null if valid.
   */
  const validateField = useCallback(
    (field: FormField, value: unknown): string | null => {
      // 1. Required Check: Handles null, undefined, empty strings, empty arrays
      if (field.required && !validateRequired(value)) {
        return field.validation?.message || `${field.label} is required.`;
      }

      // Optimization: If not required and the value is empty, skip further checks
      if (!field.required && !validateRequired(value)) {
        return null;
      }

      const stringValue =
        typeof value === "string" || typeof value === "number"
          ? String(value)
          : "";

      if (
        field.minLength !== undefined &&
        typeof value === "string" &&
        !validateMinLength(value, field.minLength)
      ) {
        return (
          field.validation?.message ||
          `${field.label} must be at least ${field.minLength} characters long.`
        );
      }

      if (
        field.maxLength !== undefined &&
        typeof value === "string" &&
        !validateMaxLength(value, field.maxLength)
      ) {
        return (
          field.validation?.message ||
          `${field.label} must be no more than ${field.maxLength} characters long.`
        );
      }

      switch (field.type) {
        case "email":
          if (!validateEmail(stringValue)) {
            return (
              field.validation?.message ||
              `Please enter a valid email address for ${field.label}.`
            );
          }
          break;
        case "tel":
          if (!validatePhoneNumber(stringValue)) {
            return (
              field.validation?.message ||
              `Please enter a valid phone number for ${field.label}.`
            );
          }
          break;
        // Add cases for other types like 'number' ranges, 'date' formats if needed
        // case 'number':
        //     if (isNaN(numberValue)) return `${field.label} must be a number.`;
        //     if (field.min !== undefined && numberValue < field.min) return `${field.label} must be at least ${field.min}.`;
        //     if (field.max !== undefined && numberValue > field.max) return `${field.label} must be no more than ${field.max}.`;
        //     break;
      }

      return null;
    },
    []
  ); 

  const validateSection = useCallback(
    (sectionIndex: number): { sectionErrors: FormErrors; isValid: boolean } => {
      const section = sections[sectionIndex];
      if (!section) {
        console.warn(
          `Attempted to validate non-existent section index: ${sectionIndex}`
        );
        return { sectionErrors: {}, isValid: true }; 
      }

      let isValid = true;
      const sectionErrors: FormErrors = {};

      console.log(`Validating Section ${sectionIndex}: "${section.title}"`);
      for (const field of section.fields) {
        const value = formData[field.fieldId]; 
        const error = validateField(field, value); 
        console.log(
          `  - Field "${field.label}" (ID: ${field.fieldId}), Value:`,
          value,
          `Error: ${error}`
        );
        sectionErrors[field.fieldId] = error; 
        if (error) {
          isValid = false; 
        }
      }
      console.log(
        `Section ${sectionIndex} Validation Result: isValid=${isValid}`
      );
      return { sectionErrors, isValid };
    },
    [sections, formData, validateField]);


  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = event.target;
      const isCheckbox = type === "checkbox";
      const targetValue = isCheckbox
        ? (event.target as HTMLInputElement).checked
        : value;

      setFormData((prevData) => ({
        ...prevData,
        [name]: targetValue, 
      }));

      setErrors((prevErrors) => {
        if (prevErrors[name] === undefined) return prevErrors; 
        const newErrors = { ...prevErrors };
        newErrors[name] = null;
        return newErrors;
      });
    },
    []
  ); 

  const handleNext = useCallback(() => {
    const { sectionErrors, isValid } = validateSection(currentSectionIndex);

    setErrors((prevErrors) => ({ ...prevErrors, ...sectionErrors }));

    if (isValid) {
      if (currentSectionIndex < totalSections - 1) {
        setCurrentSectionIndex((prevIndex) => prevIndex + 1);
        window.scrollTo(0, 0);
      } else {
        console.warn("handleNext called on the last section.");
      }
    } else {
      console.log("Navigation blocked: Current section has validation errors.");
    }
  }, [currentSectionIndex, totalSections, validateSection]);

  const handlePrev = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prevIndex) => prevIndex - 1);
      window.scrollTo(0, 0);
    }
  }, [currentSectionIndex]);

  const handleSubmit = useCallback(() => {
    if (currentSectionIndex !== totalSections - 1) {
      console.error("handleSubmit called before reaching the last section.");
      return;
    }

    const { sectionErrors, isValid } = validateSection(currentSectionIndex);
    setErrors((prevErrors) => ({ ...prevErrors, ...sectionErrors })); 
    if (!isValid) {
      console.error(
        "Submission failed: Final section is invalid.",
        sectionErrors
      );
      alert("Please fix the errors in the final section before submitting."); 
      setIsSubmitting(false); 
      return;
    }

    console.log("Form is valid. Submitting...");
    setIsSubmitting(true); 
    console.log("--- Collected Form Data ---");
    console.log(JSON.stringify(formData, null, 2));
    console.log("---------------------------");

    setTimeout(() => {
      setIsSubmitting(false); 
      alert("Form data successfully logged to the console!");
    }, 100); 
  }, [currentSectionIndex, totalSections, formData, validateSection]);

  const isCurrentSectionValid = useMemo(() => {
    const section = sections[currentSectionIndex];
    if (!section) return true; 

    for (const field of section.fields) {
      const error = validateField(field, formData[field.fieldId]);
      if (error) {
        return false; 
      }
    }
    return true; 
  }, [sections, currentSectionIndex, formData, validateField]); 

  return {
    formData,
    errors,
    currentSectionIndex,
    isCurrentSectionValid,
    isSubmitting,
    handleInputChange,
    handleNext,
    handlePrev,
    handleSubmit,
    currentSectionData,
    totalSections,
  };
};
