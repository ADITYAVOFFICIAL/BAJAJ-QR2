import apiClient from "../../../lib/apiClient";

interface CreateUserPayload {
  rollNumber: string;
  name: string;
}

interface CreateUserResponse {
  message?: string;
}

export const createUser = async (
  userData: CreateUserPayload
): Promise<CreateUserResponse> => {
  try {
    const response = await apiClient.post<CreateUserResponse>(
      "/create-user",
      userData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating user:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Failed to register user");
  }
};
