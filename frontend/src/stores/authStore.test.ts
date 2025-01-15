import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth';

// Set up the Pinia store for testing
describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const authStore = useAuthStore();
    expect(authStore.token).toEqual("");
    expect(authStore.user).toBeNull();
  });

  it('should set the token correctly', () => {
    const authStore = useAuthStore();
    const token = 'test-token';
    authStore.setToken(token);
    expect(authStore.token).toBe(token);
  });

  it('should set the user correctly', () => {
    const authStore = useAuthStore();
    const user = { name: 'John Doe' };
    authStore.setUser(user);
    expect(authStore.user).toEqual(user);
  });

  it('should clear the auth state', () => {
    const authStore = useAuthStore();
    authStore.setToken('test-token');
    authStore.setUser({ name: 'John Doe' });

    authStore.clearAuth();

    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
  });

  it('should return correct isAuthenticated getter value', () => {
    const authStore = useAuthStore();

    // When there's no token
    expect(authStore.isAuthenticated).toBe(false);

    // When token is set
    authStore.setToken('test-token');
    expect(authStore.isAuthenticated).toBe(true);
  });

  it('should return correct getUser getter value', () => {
    const authStore = useAuthStore();
    const user = { name: 'John Doe' };

    // When no user is set
    expect(authStore.getUser).toBeNull();

    // When user is set
    authStore.setUser(user);
    expect(authStore.getUser).toEqual(user);
  });
});
