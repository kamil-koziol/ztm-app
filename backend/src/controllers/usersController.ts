import { UserService } from "../services/usersService";
import { Request, Response } from "express";
import { UpdateUserRequest, ErrorResponse} from "./dto";
import { getErrorMessage, parseRequest } from "../utils/utils";

export class UserController {
    private userService: UserService

    constructor(userService: UserService) {
        this.userService = userService
    }

    async getUser(req: Request, res: Response) {
        const { userId } = req.params;
        let user = await this.userService.getUser(userId)
        if(!user) {
            res.status(404).json({ error: "user not found" });
            return
        }

        res.status(200).json({"user": user})
    }

    async getUsers(req: Request, res: Response) {
        let users = await this.userService.getUsers()
        res.status(200).json({"users": users})
    }

    async updateUser(req: Request, res: Response) {
        const { userId } = req.params;

        const body = parseRequest(UpdateUserRequest, req.body, res);
        if(!body) return

        try {
            let user = await this.userService.getUser(userId)
            if(!user) {
                res.status(404).json({error: "user not found"})
                return
            }

            Object.assign(user, body);

            let updatedUser = await this.userService.updateUser(userId, user)
            if(!user) {
                res.status(404).json({error: "user not found"})
                return
            }

            res.status(200).json({"user": updatedUser})
            return
        } catch(e) {
            let err: ErrorResponse = {
                error: getErrorMessage(e)
            }
            res.status(500).json(err)
            return
        }
    }
}
