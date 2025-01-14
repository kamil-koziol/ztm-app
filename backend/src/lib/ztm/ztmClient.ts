import axios from "axios"
import { Cache } from "../cache/cache"

export interface Stop {
    stopId: string;
    stopCode: string;
    stopName: string;
    type: string;
}

export interface Delay {
    routeId: number;
    headsign: string;
    delayInSeconds: number;
    theoreticalTime: string;
    estimatedTime: string;
}

export interface ZTMClient {
    fetchStops(): Promise<Stop[]>
    fetchDelays(stopId: string): Promise<Delay[]>
}

export class CachingZTMClient implements ZTMClient {
    private client: ZTMClient
    private cache: Cache<string>

    constructor(cache: Cache<string>, client: ZTMClient) {
        this.client = client
        this.cache = cache
    }

    async fetchStops(): Promise<Stop[]> {
        let stopsKey = "stops"

        let cachedStops = await this.cache.get(stopsKey)
        if(cachedStops != null) {
            return JSON.parse(cachedStops)
        }

        let stops = await this.client.fetchStops()

        await this.cache.set(stopsKey, JSON.stringify(stops), 24 * 60 * 60 * 1000)

        return stops
    }

    async fetchDelays(stopId: string): Promise<Delay[]> {
        let delaysKey = "delays:" + stopId

        let cachedDelays = await this.cache.get(delaysKey)
        if(cachedDelays != null) {
            return JSON.parse(cachedDelays)
        }

        let delays = await this.client.fetchDelays(stopId)

        await this.cache.set(delaysKey, JSON.stringify(delays), 60 * 1000)

        return delays
    }


}

export class DefaultZTMClient implements ZTMClient {
    private stopsUrl = "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json";
    private delaysUrl = "http://ckan2.multimediagdansk.pl/delays?stopId=";

    async fetchStops(): Promise<Stop[]> {
        const response = await axios.get(this.stopsUrl);
        let stops: Record<string, Stop> = {}
        Object.keys(response.data).forEach((dateKey: string) => {
            const day = response.data[dateKey]; 
            day.stops.forEach((s: any) => {
               if(s.type == "UNKNOWN") return;

               let stop: Stop = {
                   stopId: s["stopId"],
                   stopCode: s["stopCode"],
                   stopName: s["stopName"],
                   type: s["type"]
               }

               stops[stop.stopId] = stop
            });
        })
        return Object.values(stops)
    }

    async fetchDelays(stopId: string): Promise<Delay[]> {
        const response = await axios.get(`${this.delaysUrl}${stopId}`);
        let delays: Delay[] = response.data.delay.map((d: any) => {
            let delay: Delay = {
                routeId: d["routeId"],
                headsign: d["headsign"],
                delayInSeconds: d["delayInSeconds"],
                theoreticalTime: d["theoreticalTime"],
                estimatedTime: d["estimatedTime"]
            }
            return delay
        })

        return delays;
    }
}
