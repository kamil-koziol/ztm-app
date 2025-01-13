import { warn } from "console";
import { User, UserModel } from "../models/userModel";
import { StopsService } from "./stopsService";
import bcrypt from "bcrypt";

export class UserService {
  private stopsService: StopsService;

  constructor(stopsService: StopsService) {
    this.stopsService = stopsService;
  }

  async getUser(userId: string): Promise<User | null> {
    return UserModel.findOne({ _id: userId });
  }

  async getUsers(): Promise<User[]> {
    return UserModel.find({});
  }

  async updateUser(userId: string, user: User): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    if(!await this.stopsService.validateStops(user.stops)) {
        throw new Error("invalid stops")
    }

    return await UserModel.findByIdAndUpdate(userId, { $set: user }, { new: true, runValidators: true });
  }


}
