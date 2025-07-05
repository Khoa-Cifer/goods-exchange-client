'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { GoogleLogin } from "@react-oauth/google"
import { useAuth } from "@/context/auth-context"
import { redirect } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const handleGoogleLogin = async (response: any) => {
    console.log('Response from Google:', response);
    await login(response);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Exchange Marketplace</h1>
          </Link>
          <p className="text-gray-600 dark:text-gray-300">Sign in to access your account</p>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="dark:text-white">Welcome Back</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Sign in with your Google account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3">
              <GoogleLogin text="continue_with" onSuccess={handleGoogleLogin} />
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-2">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
