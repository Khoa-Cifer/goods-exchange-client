"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login:", loginData)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup:", signupData)
  }

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
          <p className="text-gray-600 dark:text-gray-300">Welcome back! Please sign in to continue.</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
            <TabsTrigger
              value="login"
              className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Sign In</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="dark:text-white">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="dark:text-white">
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Create Account</CardTitle>
                <CardDescription className="dark:text-gray-300">Join our marketplace community</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="dark:text-white">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="dark:text-white">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="dark:text-white">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="dark:text-white">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
