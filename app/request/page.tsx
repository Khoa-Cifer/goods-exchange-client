"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Send, FileText } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { showNotification } from "@/components/notification-helper"
import { Request } from "@/types/request"
import { useAuth } from "@/context/auth-context"
import { formatDate, getStatusBadge } from "@/lib/utils"
import { RequestStatus } from "@/enum/request-status"
import { getUserSubmittedRequests, submitRequest } from "@/axios/request"

export default function RequestPage() {
  const { allRequestTypes } = useAuth();

  const [submittedRequests, setSubmittedRequests] = useState<Request[]>([]);

  const [activeTab, setActiveTab] = useState("new")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRequestTypeId, setSelectedRequestTypeId] = useState<string | null>(null);
  const [requestDescription, setRequestDescription] = useState<string | null>(null);

  const getAllUserSubmittedRequests = async () => {
    const response = await getUserSubmittedRequests();
    console.log(response);
    setSubmittedRequests(response);
  }

  useEffect(() => {
    getAllUserSubmittedRequests();
  }, []);

  const handleSelectType = (requestTypeId: string) => {
    setSelectedRequestTypeId(requestTypeId);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!requestDescription || !selectedRequestTypeId) {
      showNotification.warning("Missing Information", "Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    showNotification.success("Submitting Request", "Your request is being submitted...")

    try {
      const response = await submitRequest(selectedRequestTypeId, requestDescription);
      if (response) {
        showNotification.success(
          "Request Submitted",
          "Your request has been submitted successfully. We'll get back to you soon!",
        )
      } else {
        showNotification.error("Submission Failed", "Failed to submit your request. Please try again.")
      }
    } catch (error) {
      showNotification.error("Submission Failed", "Failed to submit your request. Please try again.")
    } finally {
      setIsSubmitting(false)
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
                Request History ({submittedRequests.length})
              </TabsTrigger>
            </TabsList>

            {/* New Request Tab */}
            <TabsContent value="new" className="space-y-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Submit New Request</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fill out the form below to submit a request to admin team.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Request Type */}
                    <div className="space-y-2">
                      <Label className="dark:text-white">Request Type *</Label>
                      <Select onValueChange={(value) => handleSelectType(value)}>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          {allRequestTypes && allRequestTypes.map && allRequestTypes.map((requestType, index) => (
                            <SelectItem value={requestType.id}>{requestType.type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="dark:text-white">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide detailed information about your request..."
                        rows={6}
                        value={requestDescription || ""}
                        onChange={(e) => setRequestDescription(e.target.value)}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
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
                  {submittedRequests && submittedRequests.length > 0 ? (
                    <div className="space-y-4">
                      {submittedRequests.map && submittedRequests.map((request) => (
                        <div
                          key={request.id}
                          className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge(request.status)}
                              </div>
                              <div className="flex items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {request.requestType.type}
                                </span>
                                <span>Created: {formatDate(request.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-gray-700 dark:text-gray-300">{request.description}</p>
                          </div>

                          {request.response && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">A</span>
                                </div>
                                <span className="font-medium text-blue-900 dark:text-blue-100">Admin Response</span>
                                <span className="text-xs text-blue-600 dark:text-blue-300">
                                  {formatDate(request.updatedAt)}
                                </span>
                              </div>
                              <p className="text-blue-800 dark:text-blue-200 text-sm">{request.response}</p>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-3 pt-3 border-t dark:border-gray-600">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Last updated: {formatDate(request.updatedAt)}
                            </span>
                            {request.status === RequestStatus.Created && (
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
