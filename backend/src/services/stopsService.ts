import { User, UserModel } from "../models/userModel";
import { Delay, Stop, ZTMClient } from "../lib/ztm/ztmClient";

export class StopsService {
  private ztmClient: ZTMClient;

  constructor(ztmClient: ZTMClient) {
    this.ztmClient = ztmClient;
  }

  async getStop(stopId: string): Promise<Delay[]> {
    return this.ztmClient.fetchDelays(stopId);
  }

  async getStops(): Promise<Stop[]> {
    return this.ztmClient.fetchStops();
  }

  // unknownStops return array of id's of stops that are not known
  async validateStops(stops: string[]): Promise<boolean> {
    let allStops = await this.getStops()
    let stopsIds = allStops.map(s => s.stopId)
    
    return stops.every((s: string) => stopsIds.includes(s))
  }
}
