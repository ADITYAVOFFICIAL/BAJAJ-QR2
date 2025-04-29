import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth"; 
import { getFormStructure } from "../features/dynamic-form/services/formService"; 
import { FormResponse } from "../types/form"; 
import Spinner from "../components/common/Spinner";
import ErrorMessage from "../components/common/ErrorMessage";
import PageWrapper from "../components/layout/PageWrapper";
import FormSection from "../features/dynamic-form/components/FormSection";
import FormNavigation from "../components/form/FormNavigation";
import { useDynamicForm } from "../features/dynamic-form/hooks/useDynamicForm"; 
import Button from "../components/common/Button"; 

const FormPage: React.FC = () => {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [formDefinition, setFormDefinition] = useState<
    FormResponse["form"] | null
  >(null);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleLogout = () => {
    console.log("Logging out...");
    logout(); 
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user?.rollNumber) {
      console.warn("No user roll number found, redirecting to login.");
      navigate("/login", { replace: true });
      return;
    }

    let isMounted = true;
    const fetchForm = async () => {
      setIsLoadingForm(true);
      setFetchError(null);
      try {
        const response = await getFormStructure(user.rollNumber);
        if (isMounted) {
          if (response && response.form) {
            setFormDefinition(response.form);
          } else {
            throw new Error("Invalid form structure received from API.");
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch form structure:", err);
        if (isMounted) {
          setFetchError(
            err.message || "Could not load the form. Please try again later."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingForm(false);
        }
      }
    };

    fetchForm();

    return () => {
      isMounted = false;
    };
  }, [user, isAuthLoading, navigate]);

  const {
    formData,
    errors,
    currentSectionIndex,
    handleInputChange,
    handleNext,
    handlePrev,
    handleSubmit,
    isCurrentSectionValid,
    isSubmitting,
    currentSectionData,
    totalSections,
  } = useDynamicForm(formDefinition);

  if (isAuthLoading || isLoadingForm) {
    return (
      <PageWrapper>
        <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
          <Spinner size="lg" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Loading Form...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (fetchError) {
    return (
      <PageWrapper>
        <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
          <ErrorMessage
            message={`Error loading form: ${fetchError}`}
            className="text-lg"
          />
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200"
          >
            Retry
          </button>
        </div>
      </PageWrapper>
    );
  }

  if (!formDefinition || totalSections === 0 || !currentSectionData) {
    return (
      <PageWrapper>
        <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
          <ErrorMessage
            message="No form sections found or form structure is invalid."
            className="text-lg"
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {formDefinition.formTitle}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Version: {formDefinition.version} | Form ID:{" "}
                {formDefinition.formId}
              </p>
              {totalSections > 1 && (
                <p className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Step {currentSectionIndex + 1} of {totalSections}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 ml-4 mt-1 sm:mt-0">
              {" "}
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="text-sm" 
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <FormSection
              key={currentSectionData.sectionId}
              section={currentSectionData}
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />
            <div className="mt-8">
              <FormNavigation
                currentSectionIndex={currentSectionIndex}
                totalSections={totalSections}
                onPrev={handlePrev}
                onNext={handleNext}
                onSubmit={handleSubmit}
                isNextDisabled={!isCurrentSectionValid}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FormPage;
