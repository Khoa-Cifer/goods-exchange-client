"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ArrowLeft, ChevronsUpDown, Check } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ImageFile } from "@/types/image"
import { PostType } from "@/enum/post-type"
import { Category } from "@/types/category"
import { getAllCategories } from "@/axios/user"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { PostCampus } from "@/enum/post-campus"
import { showNotification } from "@/components/notification-helper"
import { createPost } from "@/axios/post"

export default function AddItem() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [campus, setCampus] = useState<string>("");
  const [type, setType] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileUpdateRef = useRef<HTMLInputElement>(null);

  const handleSelect = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;
    setSelectedCategories((prev) =>
      prev.some((cat) => cat.id === categoryId)
        ? prev.filter((cat) => cat.id !== categoryId)
        : [...prev, category]
    );
  };

  const handleRemove = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== categoryId));
  };

  const handleFilesChange = async (event: React.ChangeEvent<HTMLInputElement>, replaceIndex: string | undefined = "") => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length < files.length) {
      alert('Some files were ignored because they are not images.');
    }

    const base64Promises = imageFiles.map((file) => {
      return new Promise<ImageFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ name: file.name, base64: reader.result as string });
        reader.onerror = (error) => reject(error);
      });
    });

    try {
      const results = await Promise.all(base64Promises);
      if (replaceIndex.length > 0) {
        const index = parseInt(replaceIndex);
        const updated = [...images];
        updated[index] = results[0]; // Replace only 1 image
        setImages(updated);
      } else {
        setImages(prev => [...prev, ...results]);
      }
      event.target.value = ''; // Clear input to allow re-upload of the same file
    } catch (err) {
      console.error('Error reading file:', err);
    }
  };

  const handleImageChange = (index: number) => {
    if (fileUpdateRef.current) {
      fileUpdateRef.current.dataset.replaceIndex = index.toString();
      fileUpdateRef.current.click();
    }
  };

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fileInputRef.current) {
      handleFilesChange(e);
    }
  };

  const onUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fileUpdateRef.current) {
      const replaceIndex = fileUpdateRef.current.dataset.replaceIndex;
      handleFilesChange(e, replaceIndex);
    }
  };

  const fetchCategories = async () => {
    const response = await getAllCategories();
    setCategories(response);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreatePost = async () => {
    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      price.trim().length === 0 ||
      campus.length === 0 ||
      type.length === 0 ||
      selectedCategories.length === 0 ||
      images.length === 0
    ) {
      showNotification.warning("Please fill in all required fields and add at least one image.")
      return;
    }

    try {
      const payload = {
        title,
        description,
        price: parseFloat(price),
        images: images
          .filter(img => typeof img.base64 === "string" && img.base64 !== null)
          .map(img => ({
            name: img.name,
            base64: img.base64 as string,
          })),
        campus,
        type,
        categories: selectedCategories.map(cat => cat.id),
      };
      const result = await createPost(payload);
      showNotification.success(result.message || "Post created successfully!");
      // Optionally redirect or reset form here
    } catch (error: any) {
      showNotification.error(error?.response?.data?.Message || "Failed to create post.");
    }
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
              <div className="space-y-2">
                <Label className="dark:text-white">Item Photos</Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="border rounded-md p-2 cursor-pointer hover:opacity-75 transition"
                        onClick={() => handleImageChange(index)}
                      >
                        <img
                          src={typeof img.base64 === "string" ? img.base64 : undefined}
                          alt={img.name}
                          className="w-full h-40 object-cover rounded"
                        />
                        <p className="text-sm text-center mt-1 text-gray-600 dark:text-gray-300">Click to edit</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => handleAddImage()} //no index
                    >
                      {images.length > 0 ? (
                        <>Add More Images</>
                      ) : (
                        <>Add Image</>
                      )}

                    </Button>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={onInputChange}
                    style={{ display: 'none' }}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileUpdateRef}
                    onChange={onUpdateChange}
                    style={{ display: 'none' }}
                  />
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Condition and Location Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-white">Campus *</Label>
                  <Select onValueChange={(value) => setCampus(value)}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value={`${PostCampus.HCM}`}>Xavalo</SelectItem>
                      <SelectItem value={`${PostCampus.HN}`}>Hola</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-white">Type *</Label>
                  <Select onValueChange={(value) => setType(value)}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value={`${PostType.Sell}`}>Sell</SelectItem>
                      <SelectItem value={`${PostType.Trade}`}>Trade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-white">Category *</Label>
                  <div className="flex flex-col gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-between dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          Select categories
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 dark:bg-gray-700 dark:border-gray-600">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {categories?.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.id}
                                  onSelect={() => handleSelect(category.id)}
                                  className="dark:hover:bg-gray-600 dark:text-white"
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${selectedCategories.includes(category) ? 'opacity-100' : 'opacity-0'
                                      }`}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((category, index) => {
                        return (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="dark:bg-gray-700 dark:text-white cursor-pointer"
                            onClick={() => handleRemove(category.id)}
                          >
                            {category?.name || 'Unknown'} ✕
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  onClick={handleCreatePost}
                  className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  Publish Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
