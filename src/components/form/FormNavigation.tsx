import React from "react";
import Button from "../common/Button";

interface FormNavigationProps {
  currentSectionIndex: number;
  totalSections: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void; 
  isNextDisabled?: boolean; 
  isSubmitting?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentSectionIndex,
  totalSections,
  onPrev,
  onNext,
  onSubmit,
  isNextDisabled = false,
  isSubmitting = false,
}) => {
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === totalSections - 1;

  return (
    <div className="mt-8 pt-5">
      <div className="flex justify-between">
        <Button
          type="button" 
          onClick={onPrev}
          disabled={isFirstSection || isSubmitting}
          variant="secondary"
          className={isFirstSection ? "invisible" : ""} 
        >
          Previous
        </Button>

        {isLastSection ? (
          <Button
            type="button" 
            onClick={onSubmit}
            disabled={isNextDisabled || isSubmitting} 
            isLoading={isSubmitting}
            variant="primary"
          >
            Submit
          </Button>
        ) : (
          <Button
            type="button" 
            onClick={onNext}
            disabled={isNextDisabled || isSubmitting} 
            variant="primary"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;
