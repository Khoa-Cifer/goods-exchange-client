'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import http from '@/axios/http';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (googleResponse: any) => Promise<any>;
    logout: () => Promise<void>;
    csrfToken: string | null;
    sessionId: string | null;
    accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [csrfTokenState, setCsrfToken] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('csrfToken') : null);
    const [sessionIdState, setSessionId] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null);
    const [accessTokenState, setAccessToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await http.get('/api/auth/check');
                if (response.data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setAccessToken(response.data.accessToken);
                } else {
                    setIsAuthenticated(false);
                    setAccessToken(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
                setAccessToken(null);
            }
        };
        checkAuth();
    }, []);

    const login = async (googleResponse: any) => {
        try {
            const response = await http.post('/api/auth/google/callback', {
                code: googleResponse.credential,
            }, {
                withCredentials: true,
            });

            const { accessToken, sessionId, csrfToken } = response.data.authResult.cookies;

            localStorage.setItem('csrfToken', csrfToken);
            localStorage.setItem('sessionId', sessionId);
            setCsrfToken(csrfToken);
            setSessionId(sessionId);
            setAccessToken(accessToken);
            setIsAuthenticated(true);

            router.push('/dashboard');
            return { accessToken, sessionId, csrfToken };
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfTokenState || '',
                },
            });

            localStorage.removeItem('csrfToken');
            localStorage.removeItem('sessionId');
            setCsrfToken(null);
            setSessionId(null);
            setAccessToken(null);
            setIsAuthenticated(false);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, csrfToken: csrfTokenState, sessionId: sessionIdState, accessToken: accessTokenState }}>
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