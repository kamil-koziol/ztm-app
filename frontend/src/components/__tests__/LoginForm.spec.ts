import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import LoginForm from '@/components/LoginForm.vue';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

// Mock the $api injection
vi.mock('@/plugins/api/api', () => {
  return {
    ApiService: {
      login: vi.fn(),
    },
  };
});

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

// Test Suite
describe('LoginForm', () => {
  let wrapper: VueWrapper<any>;
  let mockApiLogin: any;
  let mockRouterPush: any;
  let authStore: any;

  beforeEach(() => {
    // Create a new Pinia instance before each test
    const pinia = createPinia();

    // Mock the $api using provide() inside the mount function
    const mockApi = { login: vi.fn() };

    // Mount the component with the Pinia store and provide the mocked $api
    wrapper = mount(LoginForm, {
      global: {
        plugins: [pinia],
        provide: {
          $api: mockApi,  // Provide the mock API here
        },
      },
    });

    // Mock the api.login and router.push methods
    mockApiLogin = mockApi.login;
    mockRouterPush = vi.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });

    // Get the auth store instance to mock its actions
    authStore = useAuthStore();
    authStore.setToken = vi.fn();
    authStore.setUser = vi.fn();
  });

  it('should render the login form correctly', () => {
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input#username').exists()).toBe(true);
    expect(wrapper.find('input#password').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('should bind username and password values to input fields', async () => {
    const usernameInput = wrapper.find('input#username');
    const passwordInput = wrapper.find('input#password');

    await usernameInput.setValue('testuser');
    await passwordInput.setValue('password123');

    expect(usernameInput.element.value).toBe('testuser');
    expect(passwordInput.element.value).toBe('password123');
  });

  it('should call handleLogin when the form is submitted', async () => {
    const usernameInput = wrapper.find('input#username');
    const passwordInput = wrapper.find('input#password');

    await usernameInput.setValue('testuser');
    await passwordInput.setValue('password123');

    mockApiLogin.mockResolvedValueOnce({ token: 'test-token', user: { name: 'John Doe' } });

    await wrapper.find('form').trigger('submit.prevent');

    expect(mockApiLogin).toHaveBeenCalledWith('testuser', 'password123');
    expect(authStore.setToken).toHaveBeenCalledWith('test-token');
    expect(authStore.setUser).toHaveBeenCalledWith({ name: 'John Doe' });
  });

  it('should not call handleLogin if the api login fails', async () => {
    const usernameInput = wrapper.find('input#username');
    const passwordInput = wrapper.find('input#password');

    await usernameInput.setValue('testuser');
    await passwordInput.setValue('password123');

    mockApiLogin.mockResolvedValueOnce(null);

    await wrapper.find('form').trigger('submit.prevent');

    expect(mockApiLogin).toHaveBeenCalledWith('testuser', 'password123');
    expect(authStore.setToken).not.toHaveBeenCalled();
    expect(authStore.setUser).not.toHaveBeenCalled();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});
