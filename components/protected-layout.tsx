'use client';

import { redirect } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from './theme-toggle';
import { UserDropdown } from './user-dropdown';
import Link from 'next/link';

interface ProtectedLayoutProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function ProtectedLayout({ children, allowedRoles }: ProtectedLayoutProps) {
    const { accessToken, authenticatedUser, logout } = useAuth();
    if (!accessToken || !authenticatedUser) {
        console.warn('ProtectedLayout: No user found, redirecting to login.');
        redirect('/');
    }

    const roleArray = JSON.parse(authenticatedUser.roleName);
    if (!roleArray.some((roleName: string) => allowedRoles.includes(roleName))) {
        console.warn('ProtectedLayout: Unauthorized access, redirecting to home.');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/">
                         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
                            <p className="text-gray-600 dark:text-gray-300">Goods Exchange Application</p>
                        </Link>
                        <div className="flex gap-4">
                            <ThemeToggle />
                            {authenticatedUser && (
                                <UserDropdown user={authenticatedUser} onLogout={logout} />
                            )}
                        </div>
                    </div>
                </div>
            </header>
            {children}
        </div>
    );
}