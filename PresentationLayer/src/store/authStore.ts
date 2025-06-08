import { create } from 'zustand';
import { authService } from '@/services/authService';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
  bodyMeasurements?: {
    height: number;
    weight: number;
    gender: 'male' | 'female';
    chest: number;
    waist: number;
    bodyType: 'slim' | 'medium' | 'large';
    age?: number;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
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

  updateUser: (user) => {
    set({ user, isAuthenticated: true });
  },
}));
