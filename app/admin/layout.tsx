'use client';

import { useAuth } from '@/context/auth-context';
import { UserTokenData } from '@/types/token';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface ProtectedLayoutProps {
    children: React.ReactNode;
    allowedRoles: number[];
}

export default function ProtectedLayout({ children, allowedRoles }: ProtectedLayoutProps) {
    const { isAuthenticated, accessToken } = useAuth();

    if (!isAuthenticated || !accessToken) {
        console.warn('ProtectedLayout: No user found, redirecting to login.');
        redirect('/');
    }

    const user = jwtDecode<UserTokenData>(accessToken);
    const roleArray = JSON.parse(user.roleId);

    if (!roleArray.some((role: number) => allowedRoles.includes(role))) {
        console.warn('ProtectedLayout: Unauthorized access, redirecting to home.');
        redirect('/');
    }

    return <>{children}</>;
}