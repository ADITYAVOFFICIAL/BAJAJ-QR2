import apiClient from "../../../lib/apiClient";
import { FormResponse } from "../../../types/form"; 

export const getFormStructure = async (
  rollNumber: string
): Promise<FormResponse> => {
  try {
    const response = await apiClient.get<FormResponse>("/get-form", {
      params: { rollNumber }, 
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching form structure:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Failed to fetch form structure");
  }
};
