import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Store, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Exchange Marketplace</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect buyers and sellers in a seamless exchange platform. List your items or discover amazing goods from
            other users.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl dark:text-white">I'm a Seller</CardTitle>
              <CardDescription className="text-lg dark:text-gray-300">
                List your items and reach potential buyers
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-gray-600 dark:text-gray-300">
                <li>• Create and manage item listings</li>
                <li>• Upload photos and descriptions</li>
                <li>• Track your inventory</li>
                <li>• Communicate with buyers</li>
              </ul>
              <Link href="/seller">
                <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                  Start Selling
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl dark:text-white">I'm a Buyer</CardTitle>
              <CardDescription className="text-lg dark:text-gray-300">
                Discover and purchase amazing items
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-gray-600 dark:text-gray-300">
                <li>• Browse thousands of items</li>
                <li>• Search and filter products</li>
                <li>• Save favorite items</li>
                <li>• Contact sellers directly</li>
              </ul>
              <Link href="/buyer">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                  Start Shopping
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
              Sign in here
            </Link>
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            <Link href="/admin" className="hover:underline">
              Admin Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
