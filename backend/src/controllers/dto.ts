import { z } from "zod";

export interface ErrorResponse {
  error: string;
}

export interface GetHealthResponse {
  status: string;
}

export const RegisterUserRequest= z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export interface RegisterUserResponse {
  message: string;
  userId: string;
}

export const LoginUserRequest = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export interface LoginUserResponse {
  token: string;
}

export const UpdateUserRequest = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
  stops: z.array(z.string()).optional()
});
