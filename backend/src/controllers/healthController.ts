import { Request, Response } from "express";

export interface GetHealthResponse {
  status: string;
}

export class HealthController {
  async getHealth(req: Request, res: Response) {
    const resp: GetHealthResponse = {
      status: "OK",
    };
    res.status(200).json(resp);
  }
}
