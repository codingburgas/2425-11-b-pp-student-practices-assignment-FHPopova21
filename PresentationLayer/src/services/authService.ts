const API_URL = 'http://localhost:5001/api';

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    role: string;
}

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        const error = data.error || 'Something went wrong';
        throw new Error(error);
    }
    return data;
};

export const authService = {
    async login(data: LoginData) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(data: RegisterData) {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    },

    async getUserRecommendations() {
        try {
            const response = await fetch(`${API_URL}/user/recommendations`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Get recommendations error:', error);
            throw error;
        }
    },
}; 