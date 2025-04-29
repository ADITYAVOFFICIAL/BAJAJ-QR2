import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://dynamic-form-generator-9rl7.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    console.error("API call error:", error.response || error.message || error);
    return Promise.reject(error);
  }
);

export default apiClient;
