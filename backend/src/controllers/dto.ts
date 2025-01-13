import { z } from "zod";
import { Delay, Stop } from "../lib/ztm/ztmClient";
import { StopDetails } from "../services/stopsService";
import { User } from "../models/userModel";

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

export interface GetStopsResponse {
    stops: Stop[]
}

export interface GetStopResponse {
    stop: StopDetails
}

export interface GetUserResponse {
    user: User
}

export interface GetUsersResponse {
    users: User[]
}
