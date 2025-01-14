import { Request, Response } from "express";
import {
  ErrorResponse,
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from "./dto";
import { getErrorMessage, parseRequest } from "../utils/utils";
import { AuthService } from "../services/authService";
import { UserAlreadyExistsError } from "../services/errors";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    const body = parseRequest(RegisterUserRequest, req.body, res);
    if(!body) return

    try {
      const { username, password } = body;
      const result = await this.authService.register(username, password);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const parsedBody = LoginUserRequest.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        errors: parsedBody.error.errors.map((e) => e.message),
      });
      return;
    }

    try {
      const { username, password } = parsedBody.data!;
      const { token, user } = await this.authService.login(username, password);
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(401).json({ error: getErrorMessage(error) });
    }
  }
}
