'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import http from '@/axios/http';
import { useRouter } from 'next/navigation';
import { UserTokenData } from '@/types/token';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    login: (googleResponse: any) => Promise<any>;
    logout: () => Promise<void>;
    user: UserTokenData | null;
    accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<UserTokenData | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessTokenState(token);
            const user = jwtDecode<UserTokenData>(token);
            setCurrentUser(user);
        }
    }, [accessTokenState]);

    const login = async (googleResponse: any) => {
        try {
            const response = await http.post('/auth/google/callback', {
                code: googleResponse.credential,
            }, {
                withCredentials: true,
            });

            const { accessToken } = response.data.authResult.cookies;
            localStorage.setItem('accessToken', accessToken);
            setAccessTokenState(accessToken);
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem('accessToken');
            setAccessTokenState(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ login, logout, user: currentUser, accessToken: accessTokenState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};