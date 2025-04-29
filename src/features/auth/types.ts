export interface User {
  rollNumber: string;
  name: string;
}

export interface CreateUserPayload {
  rollNumber: string;
  name: string;
}

export interface CreateUserResponse {
  message?: string;
}