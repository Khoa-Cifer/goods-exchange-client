import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRouter from '@routers/app-router';
import { AuthProvider } from './context/auth-context';
import { AppProvider } from './context/app-context';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
        <AppProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </AppProvider>
      </GoogleOAuthProvider>
    </>
  );
}
