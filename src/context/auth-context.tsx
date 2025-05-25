import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  csrfToken: string | null;
  sessionId: string | null;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [csrfTokenState, setCsrfToken] = useState<string | null>(
    localStorage.getItem('csrfToken'),
  );
  const [sessionIdState, setSessionId] = useState<string | null>(
    localStorage.getItem('sessionId'),
  );
  const [accessTokenState, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken'),
  );
  const isAuthenticated = !!accessTokenState;

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      credentials: 'include', // includes HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    const { accessToken, sessionId, csrfToken } = data.cookies;

    // Only store sessionId/csrfToken (accessToken is assumed in HTTP-only cookie)
    localStorage.setItem('csrfToken', csrfToken);
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('accessToken', accessToken);

    setCsrfToken(csrfToken);
    setSessionId(sessionId);
    setAccessToken(accessToken);
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
    localStorage.removeItem('sessionId');
    setCsrfToken(null);
    setSessionId(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        csrfToken: csrfTokenState,
        sessionId: sessionIdState,
        accessToken: accessTokenState,
      }}
    >
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
