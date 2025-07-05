"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AddItem() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/seller">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Item</h1>
                <p className="text-gray-600 dark:text-gray-300">Create a new listing for your item</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Item Details</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Fill in the information about your item to create a listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="dark:text-white">Item Photos</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Click to upload photos or drag and drop</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG up to 10MB each</p>
                    <Button type="button" variant="outline" className="mt-4 bg-transparent">
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="dark:text-white">
                    Item Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter item title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="dark:text-white">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Price and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="dark:text-white">
                      Price ($) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="dark:text-white">Category *</Label>
                    <Select onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Condition and Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="dark:text-white">Condition *</Label>
                    <Select onValueChange={(value) => handleInputChange("condition", value)}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="dark:text-white">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Publish Listing
                  </Button>
                  <Button type="button" variant="outline" className="flex-1 bg-transparent">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
