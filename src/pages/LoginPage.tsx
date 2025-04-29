import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { createUser } from "../features/auth/services/authService"; 
import { getFormStructure } from "../features/dynamic-form/services/formService"; 
import InputField from "../components/common/InputField"; 
import Button from "../components/common/Button"; 
import Spinner from "../components/common/Spinner";
import ErrorMessage from "../components/common/ErrorMessage"; 
import PageWrapper from "../components/layout/PageWrapper";
import { User } from "../features/auth/types"; 

const LoginPage: React.FC = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, login, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthLoading && user) {
      const from = location.state?.from?.pathname || "/form";
      console.log(`User already logged in, redirecting to: ${from}`);
      navigate(from, { replace: true });
    }
  }, [user, isAuthLoading, navigate, location.state]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!rollNumber.trim() || !name.trim()) {
      setError("Both Roll Number and Name are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Attempting to create user...");
      await createUser({ rollNumber, name });

      console.log("createUser succeeded.");
      const loggedInUser: User = { rollNumber, name };
      login(loggedInUser);
      const from = location.state?.from?.pathname || "/form";
      navigate(from, { replace: true });
    } catch (createUserError: any) {
      console.warn(
        "createUser failed, attempting getForm as fallback:",
        createUserError
      );

      try {
        console.log(`Attempting getForm for roll number: ${rollNumber}`);
        await getFormStructure(rollNumber);

        console.log(
          "getForm succeeded after createUser failed - logging in existing user."
        );
        const loggedInUser: User = { rollNumber, name };
        login(loggedInUser);
        const from = location.state?.from?.pathname || "/form";
        navigate(from, { replace: true });
      } catch (getFormError: any) {
        console.error("Both createUser and getForm failed:", {
          createUserError,
          getFormError,
        });

        const errorMessage =
          createUserError?.response?.data?.message ||
          createUserError?.message ||
          "Login failed. Please check Roll Number or Name.";
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <PageWrapper>
        <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
          <Spinner size="lg" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Checking session...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (user) {
    return (
      <PageWrapper>
        <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
          <Spinner size="lg" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Redirecting...
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex justify-center items-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          <div className="text-center">
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Student Portal
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Login or Register to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4 rounded-md shadow-sm">
              <InputField
                label="Roll Number"
                id="rollNumber"
                name="rollNumber"
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your Roll Number"
                required
                disabled={isSubmitting}
                error={
                  error && error.toLowerCase().includes("roll number")
                    ? error
                    : undefined
                }
                dataTestId="rollNumber-input"
              />
              <InputField
                label="Name"
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Name"
                required
                disabled={isSubmitting}
                error={
                  error && error.toLowerCase().includes("name")
                    ? error
                    : undefined
                }
                dataTestId="name-input"
              />
            </div>

            {error &&
              !(
                error.toLowerCase().includes("roll number") ||
                error.toLowerCase().includes("name")
              ) && (
                <div className="pt-2">
                  {" "}
                  <ErrorMessage message={error} />
                </div>
              )}
            {error === "Both Roll Number and Name are required." && (
              <div className="pt-2">
                <ErrorMessage message={error} />
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full" 
                isLoading={isSubmitting}
                variant="primary"
              >
                Login / Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
