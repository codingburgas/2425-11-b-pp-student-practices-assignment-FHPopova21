
import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// Mock users for demo
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@smartfit.bg',
    name: 'Иван Петров',
    role: 'user',
    bodyMeasurements: {
      height: 175,
      weight: 70,
      gender: 'male',
      waist: 85,
      chest: 95,
      bodyType: 'medium',
      age: 28
    }
  },
  {
    id: '2',
    email: 'merchant@smartfit.bg',
    name: 'Мария Георгиева',
    role: 'merchant'
  },
  {
    id: '3',
    email: 'admin@smartfit.bg',
    name: 'Администратор',
    role: 'admin'
  }
];
