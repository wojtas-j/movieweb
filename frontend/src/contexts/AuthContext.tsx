import React, { createContext, useState, ReactNode, useEffect, useMemo } from 'react';
import api from '../services/api';
import { LoginRequest, LoginResponse, UserDto } from '../types/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: UserDto | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<UserDto | null>(null);

    const checkAuth = async () => {
        try {
            const response = await api.get<UserDto>('/api/auth/me');
            console.log('Odpowiedź autoryzacji:', response.data);
            setIsAuthenticated(true);
            setIsAdmin(response.data.isAdmin);
            setUser(response.data);
        } catch (error) {
            console.error('Sprawdzenie autoryzacji nie powiodło się:', error);
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUser(null);
        }
    };

    useEffect(() => {
        console.log('Mounting AuthProvider');
        checkAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            console.log('Wysyłanie żądania logowania...');
            await api.post<LoginResponse>('/api/auth/login', credentials);
            console.log('Logowanie zakończone, sprawdzanie autoryzacji...');
            await checkAuth();
        } catch (error) {
            console.error('Logowanie nie powiodło się:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUser(null);
            console.log('Wylogowano pomyślnie.');
        } catch (error) {
            console.error('Wylogowanie nie powiodło się:', error);
        }
    };

    const value = useMemo(() => ({
        isAuthenticated,
        isAdmin,
        user,
        login,
        logout
    }), [isAuthenticated, isAdmin, user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
