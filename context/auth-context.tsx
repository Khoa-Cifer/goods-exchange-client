'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import http from '@/axios/http';
import { useRouter } from 'next/navigation';
import { UserTokenData } from '@/types/token';
import { jwtDecode } from 'jwt-decode';
import { RequestType } from '@/types/request';
import { getRequestTypes } from '@/axios/user';
import { useChat } from './chat-context';
import { User } from '@/types/user';

interface AuthContextType {
    login: (googleResponse: any) => Promise<any>;
    logout: () => Promise<void>;
    authenticatedUser: UserTokenData | null;
    accessToken: string | null;
    allRequestTypes: RequestType[];
    currentRoleUsing: string | null;
    setCurrentRoleUsing: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<UserTokenData | null>(null);
    const [requestTypes, setRequestTypes] = useState<RequestType[]>([]);
    const [currentRole, setCurrentRole] = useState<string | null>(null);
    const { setCurrentUser: setChatUser } = useChat();

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessTokenState(token);
            const user = jwtDecode<UserTokenData>(token);
            setCurrentUser(user);
            const chatUser: User = {
                id: user.sub,
                username: user.name,
                email: user.email,
            };
            setChatUser(chatUser);
            getAllCurrentRequestTypes();
        }

    }, [accessTokenState]);

    const getAllCurrentRequestTypes = async () => {
        const response = await getRequestTypes();
        setRequestTypes(response);
    }

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
        <AuthContext.Provider
            value={{
                login, logout,
                authenticatedUser: currentUser,
                accessToken: accessTokenState,
                allRequestTypes: requestTypes,
                currentRoleUsing: currentRole,
                setCurrentRoleUsing: setCurrentRole,
            }}>
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