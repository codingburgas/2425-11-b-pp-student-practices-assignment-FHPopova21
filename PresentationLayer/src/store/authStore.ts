import { create } from 'zustand';
import { authService } from '@/services/authService';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    try {
      const response = await authService.login(credentials);
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  register: async (data) => {
    try {
      await authService.register(data);
      // After successful registration, log the user in
      const response = await authService.login({
        username: data.username,
        password: data.password,
      });
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false });
      // Navigate to home page after logout
      window.location.href = '/';
    } catch (error) {
      throw error;
    }
  },
}));
