'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import http from '@/axios/http';
import { useRouter } from 'next/navigation';
import { UserTokenData } from '@/types/token';
import { jwtDecode } from 'jwt-decode';

interface GlobalContextType {
    login: (googleResponse: any) => Promise<any>;
    logout: () => Promise<void>;
    authenticatedUser: UserTokenData | null;
    accessToken: string | null;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <GlobalContext.Provider value={{ login, logout, authenticatedUser: currentUser, accessToken: accessTokenState }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalData = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};