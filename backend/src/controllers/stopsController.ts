import { Request, Response } from "express";
import { ErrorResponse, GetStopResponse, GetStopsResponse } from "./dto";
import { getErrorMessage } from "../utils/utils";
import { StopsService } from "../services/stopsService";

export class StopsController {
  private stopsService: StopsService;

  constructor(stopsService: StopsService) {
    this.stopsService = stopsService;
  }

  async getStops(req: Request, res: Response): Promise<void> {
    try {
      const stops = await this.stopsService.getStops();
      let resp: GetStopsResponse = {
          stops: stops
      }
      res.status(200).json(resp);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }

  async getStop(req: Request, res: Response): Promise<void> {
    try {
      const { stopId } = req.params; 
      let stop = await this.stopsService.getStop(stopId); 
      let resp: GetStopResponse = {
          stop: stop,
      }
      res.status(200).json(resp);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
}
