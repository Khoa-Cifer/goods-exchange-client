import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRouter from '@routers/app-router';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
        <AppRouter />
      </GoogleOAuthProvider>
    </>
  );
}
