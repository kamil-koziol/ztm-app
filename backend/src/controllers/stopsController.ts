import { Request, Response } from "express";
import { ErrorResponse } from "./dto";
import { getErrorMessage } from "../utils/utils";
import { StopsService } from "../services/stopsService";

export class StopsController {
  private stopsService: StopsService;

  constructor(stopsService: StopsService) {
    this.stopsService = stopsService;
  }

  async getStops(req: Request, res: Response): Promise<void> {
    try {
      const stops = await this.stopsService.getStops(); // Get all stops from the service
      res.status(200).json(stops);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }

  async getStop(req: Request, res: Response): Promise<void> {
    try {
      const { stopId } = req.params; 
      const stop = await this.stopsService.getStop(stopId); 

      if (!stop) {
        res.status(404).json({ error: "Stop not found" });
        return
      }

      res.status(200).json(stop);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
}
