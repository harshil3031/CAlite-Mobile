import axiosInstance from './axiosInstance';

export interface User {
    id: string;
    email: string;
    fullName: string;
    firmName?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface ApiError {
    message: string;
}

const handleApiError = (error: any): ApiError => {
    if (error.response && error.response.data && error.response.data.message) {
        throw { message: error.response.data.message };
    }
    throw { message: error.message || 'An unexpected error occurred' };
};

export const authService = {
    register: async (data: any): Promise<AuthResponse> => {
        try {
            const response = await axiosInstance.post('/api/v1/auth/register', data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    login: async (data: any): Promise<AuthResponse> => {
        try {
            const response = await axiosInstance.post('/api/v1/auth/login', data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    logout: async (): Promise<void> => {
        try {
            await axiosInstance.post('/api/v1/auth/logout');
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
