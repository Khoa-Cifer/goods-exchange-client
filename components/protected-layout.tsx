'use client';

import { UserTokenData } from '@/types/token';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/context/auth-context';

interface ProtectedLayoutProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function ProtectedLayout({ children, allowedRoles }: ProtectedLayoutProps) {
    const { accessToken, user } = useAuth();
    if (!accessToken || !user) {
        console.warn('ProtectedLayout: No user found, redirecting to login.');
        redirect('/');
    }

    const roleArray = JSON.parse(user.roleName);
    console.log('ProtectedLayout: User roles:', roleArray);
    if (!roleArray.some((roleName: string) => allowedRoles.includes(roleName))) {
        console.warn('ProtectedLayout: Unauthorized access, redirecting to home.');
        redirect('/');
    }

    return <>{children}</>;
}