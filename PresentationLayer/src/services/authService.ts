const API_URL = 'http://localhost:5000/api';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    username: string;
}

export const authService = {
    async login(data: LoginData) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        return response.json();
    },

    async register(data: RegisterData) {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        
        return response.json();
    },

    async logout() {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'GET',
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error('Logout failed');
        }
        
        return response.json();
    },

    async getCurrentUser() {
        const response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error('Failed to get user');
        }
        
        return response.json();
    },
}; 