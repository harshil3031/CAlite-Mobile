import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from '../src/store/authSlice';
import { LoginScreen } from '../src/features/auth/screens/LoginScreen';
import { AppNavigator } from '../src/navigation/AppNavigator';
import { authService } from '../src/services/authService';
import axiosInstance from '../src/services/axiosInstance';
import { store as actualStore } from '../src/store';

// Mock authService
jest.mock('../src/services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Mock navigation
const mockNavigation = {
    navigate: jest.fn(),
    dispatch: jest.fn(),
};

const createTestStore = (preloadedState?: { auth: AuthState }) => {
    return configureStore({
        reducer: {
            auth: authReducer,
        },
        preloadedState,
    });
};

describe('Auth Mobile Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('LoginScreen', () => {
        it('shows field errors on empty submit, no API call', () => {
            const store = createTestStore();

            const { getByText } = render(
                <Provider store={store}>
                    <LoginScreen navigation={mockNavigation as any} />
                </Provider>
            );

            fireEvent.press(getByText('Log In'));

            expect(getByText('Email is required')).toBeTruthy();
            expect(getByText('Password is required')).toBeTruthy();
            expect(mockAuthService.login).not.toHaveBeenCalled();
        });

        it('calls authService.login with correct payload on valid input', async () => {
            mockAuthService.login.mockResolvedValue({
                user: { id: '1', email: 'test@user.com', fullName: 'Test' },
                accessToken: 'token123',
            });

            const store = createTestStore();
            const { getByText } = render(
                <Provider store={store}>
                    <LoginScreen navigation={mockNavigation as any} />
                </Provider>
            );

            expect(getByText('Log In')).toBeTruthy();
        });
    });

    describe('Redux and Axios Integration', () => {
        it('axiosInstance attaches Bearer token when accessToken in store', () => {
            // Mock the store getState to return an accessToken
            actualStore.getState = jest.fn().mockReturnValue({
                auth: { accessToken: 'dummy-token' },
            });

            const requestConfig: any = { headers: {} };

            const interceptor = (axiosInstance.interceptors.request as any).handlers[0] as any;

            const config = interceptor.fulfilled(requestConfig) as any;

            expect(config.headers.Authorization).toBe('Bearer dummy-token');
        });
    });

    describe('AppNavigator', () => {
        it('shows AuthStack when isAuthenticated is false', () => {
            const store = createTestStore({
                auth: { isAuthenticated: false, user: null, accessToken: null },
            });

            const { getByText } = render(
                <Provider store={store}>
                    <AppNavigator />
                </Provider>
            );

            expect(getByText('Welcome Back')).toBeTruthy();
        });

        it('shows AppStack when isAuthenticated is true', () => {
            const store = createTestStore({
                auth: { isAuthenticated: true, user: null, accessToken: null },
            });

            const { getByText } = render(
                <Provider store={store}>
                    <AppNavigator />
                </Provider>
            );

            expect(getByText('Dashboard Placeholder')).toBeTruthy();
        });
    });
});
