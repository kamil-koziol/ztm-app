import type { App } from 'vue';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        config.headers['Authorization'] = `Bearer ${authStore.token}`;
      }
      return config;
    });
  }

  private handleResponse(response: AxiosResponse) {
    if(response.status == 401) {
      const authStore = useAuthStore();
      authStore.cleanAuth();
      return response.data.error
    }

    return response.data;
  }

  async getHealth() {
    const resp = await this.axiosInstance.get('/v1/health');
    return this.handleResponse(resp)
  }

  async register(username: string, password: string) {
    const resp = await this.axiosInstance.post('/v1/register', {
      username: username,
      password: password,
    });

    return this.handleResponse(resp)
  }

  async login(username: string, password: string) {
    const resp = await this.axiosInstance.post('/v1/login', {
      username: username,
      password: password
    });
    return this.handleResponse(resp)
  }

  async getStops() {

    const cachedStops = sessionStorage.getItem('cachedStops');
    if (cachedStops) {
      return JSON.parse(cachedStops);
    }

    const resp = await this.axiosInstance.get('/v1/stops');
    let data = this.handleResponse(resp)


    sessionStorage.setItem('cachedStops', JSON.stringify(data));
    return data
  }

  async getStop(stopId: string) {
    const resp = await this.axiosInstance.get(`/v1/stops/${stopId}`);
    return this.handleResponse(resp)
  }

  async addStopToUser(stopId: string) {
    const authStore = useAuthStore();
    let user = authStore.getUser
    let stops: string[] = [...user.stops]
    stops.push(stopId)
    let uniqueStops = Array.from(new Set(stops)).map(s => s.toString())
    const resp = await this.axiosInstance.put('/v1/users/' + user._id, {
      stops: uniqueStops
    });

    let r = this.handleResponse(resp)
    authStore.setUser(r.user)
    return r
  }

  async removeStopFromUser(stopId: string) {
    const authStore = useAuthStore();
    let user = authStore.getUser
    let stops: string[] = [...user.stops]
    stops = stops.filter(s => s != stopId)
    let uniqueStops = Array.from(new Set(stops)).map(s => s.toString())
    const resp = await this.axiosInstance.put('/v1/users/' + user._id, {
      stops: uniqueStops
    });

    let r = this.handleResponse(resp)
    authStore.setUser(r.user)
    return r
  }
}

export default {
  install(app: App, options: { baseURL: string }) {
    const apiService = new ApiService(options.baseURL)
    console.log(apiService)
    app.config.globalProperties.$api = apiService;

    app.provide('$api', apiService);
  },
}
