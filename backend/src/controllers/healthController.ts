import { Request, Response } from "express";
import { GetHealthResponse } from "./dto";
import mongoose from "mongoose";


export class HealthController {
  async getHealth(req: Request, res: Response) {
    const resp: GetHealthResponse = {
      status: "OK",
    };
    res.status(200).json(resp);
  }
}
