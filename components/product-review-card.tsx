"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, MapPin, Star } from "lucide-react"
import Link from "next/link"

interface ProductPreviewCardProps {
  item: {
    id: number
    title: string
    price: number
    location: string
    seller: string
    rating: number
    image: string
    category: string
    featured?: boolean
  }
  showLoginPrompt?: boolean
}

export function ProductPreviewCard({ item, showLoginPrompt = true }: ProductPreviewCardProps) {
  const handleInteraction = (e: React.MouseEvent) => {
    if (showLoginPrompt) {
      e.preventDefault()
      e.stopPropagation()
      // Show login prompt or redirect
      window.location.href = "/login"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-700 dark:border-gray-600">
      <CardHeader className="p-0 relative">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Button size="sm" variant="secondary" className="absolute top-2 right-2 p-2" onClick={handleInteraction}>
          <Heart className="w-4 h-4" />
        </Button>
        {item.featured && <Badge className="absolute top-2 left-2 bg-blue-600 text-white">Featured</Badge>}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg dark:text-white">{item.title}</CardTitle>
          <Badge variant="outline">{item.category}</Badge>
        </div>

        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">${item.price}</p>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {item.location}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
          <span>Seller: {item.seller}</span>
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            {item.rating}
          </span>
        </div>

        <div className="flex gap-2">
          {showLoginPrompt ? (
            <Link href="/login" className="flex-1">
              <Button className="w-full">View Details</Button>
            </Link>
          ) : (
            <Button className="flex-1">View Details</Button>
          )}
          <Button variant="outline" size="sm" className="bg-transparent" onClick={handleInteraction}>
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
