# Dynamic Form Builder - Qualifier 2 (React + TypeScript + Vite)

This project is a React application built with TypeScript and Vite, designed to dynamically render and manage a multi-section form based on a structure fetched from an API. It fulfills the requirements of the "Dynamic Form Builder — Qualifier 2" task.

## Problem Statement

Build a React-based application that allows a student to:

1.  **Login/Register:** Enter Roll Number and Name.
2.  **API Interaction:**
    *   Register the user via `POST /create-user`.
    *   Fetch a dynamic form structure using `GET /get-form` after successful login/registration.
3.  **Dynamic Rendering:** Render the form (sections and fields) based on the fetched structure. No hardcoding of fields.
4.  **Validation:** Implement dynamic validation (required, minLength, maxLength, etc.) based on field metadata from the API.
5.  **Multi-Section Navigation:**
    *   Validate each section independently.
    *   Prevent navigation to the next section if the current one is invalid.
    *   Include "Previous" and "Next" buttons for navigation between sections.
    *   The final section should have a "Submit" button instead of "Next".
6.  **Submission:** On final form submission, log the collected data to the console.

## Features

*   **User Authentication:** Simple login/registration using Roll Number and Name. Session persistence using `sessionStorage`.
*   **API Integration:** Uses Axios (`apiClient`) to communicate with the backend for user creation and form structure retrieval.
*   **Dynamic Form Rendering:** Renders complex, multi-section forms based entirely on the JSON structure received from the `/get-form` API endpoint.
*   **Component-Based Architecture:** Leverages reusable common UI components (Input, Button, Select, etc.).
*   **Multi-Section Form:** Supports forms divided into logical sections with dedicated navigation.
*   **Section-wise Validation:** Validates each section's fields before allowing the user to proceed to the next section. Includes checks for required fields, min/max length, email, phone number formats.
*   **Protected Routes:** Ensures users cannot access the form page without logging in and redirects logged-in users away from the login page.
*   **State Management:** Uses React Context API (`AuthProvider`) for managing authentication state and React Hooks (`useState`, `useCallback`, `useMemo`, custom `useDynamicForm` hook) for form state.
*   **TypeScript:** Fully typed codebase for improved maintainability and developer experience.
*   **Styling:** Uses Tailwind CSS for utility-first styling.
*   **Build Tool:** Utilizes Vite for fast development and optimized builds.
*   **Linting:** Configured with ESLint and TypeScript ESLint for code quality.

## Tech Stack

*   **Framework/Library:** React 19
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS v4
*   **Routing:** React Router DOM v7
*   **HTTP Client:** Axios
*   **Linting:** ESLint, TypeScript ESLint
*   **State Management:** React Context API, React Hooks


## API Endpoints

The application interacts with the following backend endpoints hosted at `https://dynamic-form-generator-9rl7.onrender.com`:

1.  **Create User / Register**
    *   **Method:** `POST`
    *   **URL:** `/create-user`
    *   **Payload:**
        ```json
        {
          "rollNumber": "YOUR_ROLL_NUMBER",
          "name": "YOUR_NAME"
        }
        ```
    *   **Description:** Registers a new user or potentially verifies an existing one (the login page handles both scenarios).

2.  **Get Form Structure**
    *   **Method:** `GET`
    *   **URL:** `/get-form`
    *   **Query Parameter:** `rollNumber=YOUR_ROLL_NUMBER`
    *   **Description:** Fetches the dynamic form structure associated with the provided roll number.

*(The base URL `https://dynamic-form-generator-9rl7.onrender.com` is configured in `src/lib/apiClient.ts`)*

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ADITYAVOFFICIAL/BAJAJ-QR2.git
    cd adityavofficial-bajaj-qr2
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

## Running the Application

*   **Development Server:**
    Starts the Vite development server with Hot Module Replacement (HMR).
    ```bash
    npm run dev
    ```
    Access the application at `http://localhost:5173` (or the port specified by Vite).

*   **Build for Production:**
    Compiles TypeScript and bundles the application for production.
    ```bash
    npm run build
    ```
    The output is generated in the `dist/` directory.

*   **Linting:**
    Runs ESLint to check for code quality and style issues.
    ```bash
    npm run lint
    ```

*   **Preview Production Build:**
    Serves the production build locally for testing.
    ```bash
    npm run preview
    ```

## Deployment

This application can be deployed to any static web hosting provider. Follow the provider's instructions for deploying a Vite-React application (usually involves connecting the Git repository and configuring build settings).

*   **Example Providers:** Vercel, Netlify, GitHub Pages.
*   **Build Command:** `npm run build`
*   **Output Directory:** `dist`

*   **Deployed Application Link:** [https://bajaj-qr-2.vercel.app/]
*   **GitHub Repository Link:** [https://github.com/ADITYAVOFFICIAL/BAJAJ-QR2]

## Key Components and Logic Explained

1.  **Authentication (`src/providers/AuthProvider.tsx`, `src/features/auth/hooks/useAuth.ts`)**
    *   `AuthProvider` uses React Context to manage the user's authentication state (`user`, `isLoading`).
    *   It persists the user session in `sessionStorage` to keep the user logged in across page refreshes.
    *   `useAuth` is a custom hook providing easy access to the auth context (user, login, logout, isLoading).
    *   `LoginPage.tsx` handles both registration (`createUser` service) and login. It attempts `createUser` first. If that fails (e.g., user already exists), it tries `getForm` as a fallback to verify the roll number before logging the user in.

2.  **Routing (`src/router/index.tsx`, `src/router/ProtectedRoute.tsx`)**
    *   `AppRouter` defines the application's routes using `react-router-dom` v7 (`<Routes>`, `<Route>`).
    *   It uses `React.lazy` and `<Suspense>` for code-splitting page components.
    *   `ProtectedRoute` wraps routes (`/form`, `/login`) to control access based on authentication status (`user` from `useAuth`). It redirects unauthenticated users to `/login` and authenticated users away from `/login`.
    *   A `RootRedirector` component handles the `/` path, redirecting to `/form` if logged in, or `/login` otherwise.

3.  **Dynamic Form Handling (`src/features/dynamic-form/hooks/useDynamicForm.ts`)**
    *   This is the core hook managing the dynamic form's state and logic.
    *   **State:** Manages `formData` (all field values), `errors` (validation errors per field), `currentSectionIndex`, and `isSubmitting`.
    *   **Validation:** Contains `validateField` (validates a single field based on its definition) and `validateSection` (validates all fields in the current section). Uses utility functions from `src/utils/validation.ts`.
    *   **Handlers:** Provides `handleInputChange`, `handleNext`, `handlePrev`, and `handleSubmit`.
    *   `handleNext` validates the current section before allowing navigation.
    *   `handleSubmit` validates the final section and logs the `formData` to the console.
    *   It memoizes `currentSectionData` and `totalSections` for performance.

4.  **Form Rendering (`src/pages/FormPage.tsx`, `src/features/dynamic-form/components/FormSection.tsx`, `src/components/form/DynamicFieldRenderer.tsx`)**
    *   `FormPage` fetches the form structure using `getFormStructure` service upon mount (after checking authentication). It passes the fetched `formDefinition` to the `useDynamicForm` hook.
    *   It renders the `FormSection` component corresponding to the `currentSectionIndex`.
    *   `FormSection` receives the section data, `formData`, `errors`, and `onInputChange` handler. It maps over the section's `fields` and renders `DynamicFieldRenderer` for each.
    *   `DynamicFieldRenderer` acts as a switch, rendering the appropriate common input component (`InputField`, `SelectField`, `CheckboxField`, etc.) based on the `field.type` property. It passes down necessary props like value, error, onChange handler, and validation attributes.
    *   `FormNavigation` displays the "Previous", "Next", or "Submit" buttons based on the `currentSectionIndex` and `totalSections`, disabling them based on validation status (`isCurrentSectionValid`) and submission state (`isSubmitting`).

5.  **API Client (`src/lib/apiClient.ts`)**
    *   A pre-configured Axios instance with the `baseURL` set to the backend API.
    *   Includes basic response interceptor for logging errors.

6.  **Validation Utilities (`src/utils/validation.ts`)**
    *   Contains pure functions for common validation rules (required, min/max length, email, phone number, etc.). These are used by the `useDynamicForm` hook.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

*   **ADITYA VERMA**
