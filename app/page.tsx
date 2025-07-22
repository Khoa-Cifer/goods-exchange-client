"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Plus, Search, } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { UserDropdown } from "@/components/user-dropdown"
import { showNotification } from "@/components/notification-helper"
import { PostCard } from "@/components/post-card"
import { useEffect, useState } from "react"
import { Post } from "@/types/post"
import { getPostsByStatus } from "@/axios/post"
import { PostStatus } from "@/enum/post-status"
import { Category } from "@/types/category"
import { getAllCategories } from "@/axios/category"

export default function HomePage() {
  const [confirmedPosts, setConfirmedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { authenticatedUser, logout } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [postTitleSearchParam, setPostTitleSearchParam] = useState<string>("");

  const handleSelectCategory = (category: Category) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.some((c) => c === category.id);
      const updated = isSelected
        ? prev.filter((c) => c !== category.id)
        : [...prev, category.id];

      handleProductInteraction(`category-${category.name}`); // keep your analytics/event

      return updated;
    });
  }

  const getConfirmedPost = async () => {
    const response = await getPostsByStatus(PostStatus.Confirmed, {
      search: postTitleSearchParam,
      categoryIds: selectedCategories,
    });
    setConfirmedPosts(response);
  }

  const fetchCategories = async () => {
    const response = await getAllCategories();
    setCategories(response);
  }

  useEffect(() => {
    getConfirmedPost();
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getConfirmedPost();
    }, 500);

    return () => clearTimeout(timer); // clean up on unmount
  }, [postTitleSearchParam, selectedCategories]);

  const handleProductInteraction = (action: string, itemTitle?: string) => {
    // Handle different actions with appropriate notifications
    switch (action.split("-")[0]) {
      case "search":
        showNotification.success("Search Started", "Searching for items...")
        break
      case "category":
        const category = action.split("-")[1]
        showNotification.success("Category Selected", `Browsing ${category} items`)
        break
      case "view":
        showNotification.success("Item Viewed", `Viewing details for ${itemTitle}`)
        break
      case "favorite":
        showNotification.success("Added to Favorites", `${itemTitle} has been added to your favorites`)
        break
      case "message":
        showNotification.success("Message Sent", `Message sent to seller of ${itemTitle}`)
        break
      default:
        showNotification.success("Action Completed", "Your action has been processed successfully")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exchange Marketplace</h1>
              <p className="text-gray-600 dark:text-gray-300">Buy and sell amazing items</p>
            </div>
            <div className="flex gap-4 items-center">
              <ThemeToggle />
              {authenticatedUser ? (
                <UserDropdown user={authenticatedUser} onLogout={logout} />
              ) : (
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                    Sign In
                  </Button>
                </Link>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Amazing Items
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Browse thousands of items from trusted sellers. Find exactly what you're looking for or discover something
              new.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search for items, brands, or categories..."
                  className="pl-12 h-14 text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => setPostTitleSearchParam(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Shop by Category</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategories.some(
                (c) => c === category.id
              );

              return (
                <Badge
                  key={category.id}
                  variant={isSelected ? "default" : "secondary"}
                  className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 transition-colors ${isSelected
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "hover:bg-blue-100 dark:hover:bg-blue-900"
                    }`}
                  onClick={() => handleSelectCategory(category)}
                >
                  {isSelected ? <Check size={14} /> : <Plus size={14} />}
                  {category.name}
                </Badge>
              );
            })}
          </div>
        </div>
      </section>

      <section id="browse-items" className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Items</h3>
            {authenticatedUser ? (
              <Link href="/buyer">
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => showNotification.success("Loading", "Loading all items...")}
                >
                  View All Items
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="bg-transparent">
                  View All Items
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {confirmedPosts && confirmedPosts.map && confirmedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showLoginPrompt={!authenticatedUser}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Exchange Marketplace</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect buyers and sellers in a seamless exchange platform
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              © 2025 Exchange Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
