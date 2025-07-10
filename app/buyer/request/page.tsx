"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Send, Clock, CheckCircle, AlertCircle, FileText, Upload } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { showNotification } from "@/components/notification-helper"
import { Request } from "@/types/request"

// Mock data for existing requests
const mockRequests: Request[] = [
  {
    id: "req_1",
    userId: "current_user",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    type: "technical",
    subject: "Unable to upload images",
    description: "I'm having trouble uploading images to my listings. The upload button doesn't seem to work.",
    priority: "medium",
    status: "in_progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    adminResponse: "We're looking into this issue. Please try clearing your browser cache in the meantime.",
    adminId: "admin_1",
  },
  {
    id: "req_2",
    userId: "current_user",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    type: "account",
    subject: "Change email address",
    description: "I need to update my email address from john.doe@example.com to john.doe@newdomain.com",
    priority: "low",
    status: "resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    adminResponse: "Your email address has been successfully updated. Please check your new email for confirmation.",
    adminId: "admin_1",
  },
  {
    id: "req_3",
    userId: "current_user",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    type: "general",
    subject: "Question about seller fees",
    description: "Are there any fees for selling items on the platform?",
    priority: "low",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
]

export default function RequestPage() {
  const [activeTab, setActiveTab] = useState("new")
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: "",
    priority: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.type || !formData.subject || !formData.description) {
      showNotification.warning("Missing Information", "Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    showNotification.success("Submitting Request", "Your request is being submitted...")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form
      setFormData({
        type: "",
        subject: "",
        description: "",
        priority: "medium",
      })

      showNotification.success(
        "Request Submitted",
        "Your request has been submitted successfully. We'll get back to you soon!",
      )
      setActiveTab("history")
    } catch (error) {
      showNotification.error("Submission Failed", "Failed to submit your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: Request["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="default">
            <AlertCircle className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        )
      case "closed":
        return <Badge variant="destructive">Closed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: Request["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeLabel = (type: Request["type"]) => {
    switch (type) {
      case "general":
        return "General Inquiry"
      case "technical":
        return "Technical Support"
      case "account":
        return "Account Issue"
      case "item":
        return "Item/Listing Issue"
      case "report":
        return "Report Issue"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/buyer">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Requests</h1>
                <p className="text-gray-600 dark:text-gray-300">Submit requests and get help from our admin team</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
              <TabsTrigger
                value="new"
                className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                New Request
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                Request History ({mockRequests.length})
              </TabsTrigger>
            </TabsList>

            {/* New Request Tab */}
            <TabsContent value="new" className="space-y-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Submit New Request</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fill out the form below to submit a request to our admin team. We'll get back to you as soon as
                    possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Request Type */}
                    <div className="space-y-2">
                      <Label className="dark:text-white">Request Type *</Label>
                      <Select onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="account">Account Issue</SelectItem>
                          <SelectItem value="item">Item/Listing Issue</SelectItem>
                          <SelectItem value="report">Report Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <Label className="dark:text-white">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          <SelectItem value="low">Low - General questions</SelectItem>
                          <SelectItem value="medium">Medium - Account or feature issues</SelectItem>
                          <SelectItem value="high">High - Urgent technical problems</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="dark:text-white">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your request"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
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
                        placeholder="Please provide detailed information about your request..."
                        rows={6}
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label className="dark:text-white">Attachments (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-300 mb-2">Click to upload files or drag and drop</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, PDF up to 10MB each</p>
                        <Button type="button" variant="outline" className="mt-3 bg-transparent">
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Request
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({ type: "", subject: "", description: "", priority: "medium" })}
                        className="bg-transparent"
                      >
                        Clear Form
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Request History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Your Request History</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    View all your previous requests and their current status.
                  </p>
                </CardHeader>
                <CardContent>
                  {mockRequests.length > 0 ? (
                    <div className="space-y-4">
                      {mockRequests.map((request) => (
                        <div
                          key={request.id}
                          className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg dark:text-white">{request.subject}</h3>
                                {getStatusBadge(request.status)}
                                {getPriorityBadge(request.priority)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {getTypeLabel(request.type)}
                                </span>
                                <span>#{request.id}</span>
                                <span>Created: {request.createdAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-gray-700 dark:text-gray-300">{request.description}</p>
                          </div>

                          {request.adminResponse && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">A</span>
                                </div>
                                <span className="font-medium text-blue-900 dark:text-blue-100">Admin Response</span>
                                <span className="text-xs text-blue-600 dark:text-blue-300">
                                  {request.updatedAt.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-blue-800 dark:text-blue-200 text-sm">{request.adminResponse}</p>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-3 pt-3 border-t dark:border-gray-600">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Last updated: {request.updatedAt.toLocaleString()}
                            </span>
                            {request.status === "pending" && (
                              <Button variant="outline" size="sm" className="bg-transparent">
                                Cancel Request
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No requests found</p>
                      <p className="text-sm mt-2">Submit your first request using the form above.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
