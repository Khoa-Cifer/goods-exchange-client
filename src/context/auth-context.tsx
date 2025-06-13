import React, { createContext, useContext, useState } from 'react';
import http from '@axios/http';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (googleResponse: any) => Promise<any>;
  logout: (googleResponse: any) => void;
  csrfToken: string | null;
  sessionId: string | null;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [csrfTokenState, setCsrfToken] = useState<string | null>(localStorage.getItem('csrfToken'));
  const [sessionIdState, setSessionId] = useState<string | null>(localStorage.getItem('sessionId'));
  const [accessTokenState, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const isAuthenticated = !!accessTokenState;

  const login = async (googleResponse: any) => {
    const response = await http.post("/auth/google/callback",
      {
        code: googleResponse.credential,
      },
      {
        withCredentials: true,
      }
    );

    const data = await response.data;
    const { accessToken, sessionId, csrfToken } = data.authResult.cookies;
   
    // Only store sessionId/csrfToken (accessToken is assumed in HTTP-only cookie)
    localStorage.setItem('csrfToken', csrfToken);
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('accessToken', accessToken);

    setCsrfToken(csrfToken);
    setSessionId(sessionId);
    setAccessToken(accessToken);
    return { accessToken, sessionId, csrfToken };
  };

  const logout = async () => {
    await fetch('http://localhost:3000/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfTokenState || '',
      },
    });

    localStorage.removeItem('csrfToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('sessionId');
    setCsrfToken(null);
    setSessionId(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, csrfToken: csrfTokenState, sessionId: sessionIdState, accessToken: accessTokenState }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
