import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string | null,
    user: null as Record<string, any> | null,
  }),

  actions: {
    setToken(token: string) {
      this.token = token;
    },

    setUser(user: any) {
      this.user = user
    },

    clearAuth() {
      this.token = null;
      this.user = null;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: sessionStorage,
      },
    ],
  },
});
