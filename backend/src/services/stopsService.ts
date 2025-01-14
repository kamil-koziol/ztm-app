import { User, UserModel } from "../models/userModel";
import { Delay, Stop, ZTMClient } from "../lib/ztm/ztmClient";


export interface StopDetails extends Stop {
    delays: Delay[] 
}

export class StopsService {
  private ztmClient: ZTMClient;

  constructor(ztmClient: ZTMClient) {
    this.ztmClient = ztmClient;
  }

  async getStop(stopId: string): Promise<StopDetails> {
    let stops = await this.getStops()
    let stop = stops.find(s => s.stopId == stopId)

    if(!stop) {
        throw new Error("stop doesnt exist")
    }

    let delays = await this.ztmClient.fetchDelays(stopId);
    return {
        ...stop,
        delays
    }
  }

  async getStops(): Promise<Stop[]> {
    return this.ztmClient.fetchStops();
  }
}
