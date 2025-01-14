import { User, UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserAlreadyExistsError } from "./errors";

export class AuthService {
  async register(
    username: string,
    password: string,
  ): Promise<{ message: string; userId: string }> {
    const user = await UserModel.findOne({ username });
    if (user) throw new UserAlreadyExistsError();

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await UserModel.create({
      username,
      password: hashedPassword,
    });

    createdUser._id
    return {
      message: "User registered successfully",
      userId: createdUser._id.toString(),
    };
  }

  async login(username: string, password: string): Promise<{ token: string, user: User}> {
    const user = await UserModel.findOne({ username });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return { token: token, user: user }
  }
}
