import { UserService } from "../services/usersService";
import { Request, Response } from "express";
import { UpdateUserRequest, ErrorResponse, GetUserResponse, GetUsersResponse} from "./dto";
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

        let resp: GetUserResponse = {
            user: user
        }
        res.status(200).json(resp)
    }

    async getUsers(req: Request, res: Response) {
        let users = await this.userService.getUsers()
        let resp: GetUsersResponse = {
            users: users
        }
        res.status(200).json(resp)
    }

    async updateUser(req: Request, res: Response) {
        const { userId } = req.params;
        let requestUser: any = (req as any).user
        if (requestUser.userId != userId) {
            res.status(403).json({error: "user can only edit himself"})
            return
        }

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
            if(!updatedUser) {
                res.status(404).json({error: "user not found"})
                return
            }

            let resp: GetUserResponse = {
                user: updatedUser
            }
            res.status(200).json(resp)
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
