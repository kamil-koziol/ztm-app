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

  // validateStops return array of id's of stops that are not known
  async validateStops(stops: string[]): Promise<boolean> {
    let hasDuplicates = (new Set(stops)).size !== stops.length;
    if(hasDuplicates) {
        return false
    }
    let allStops = await this.getStops()
    let stopsIds = allStops.map(s => s.stopId)
    
    return !stops.every((s: string) => stopsIds.includes(s))
  }
}
