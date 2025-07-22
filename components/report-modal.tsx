"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Send } from "lucide-react"
import { showNotification } from "@/components/notification-helper"
import { Post } from "@/types/post"
import { reportUser } from "@/axios/violation"

interface ReportModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
}

export function ReportModal({ post, isOpen, onClose }: ReportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reason, setReason] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(post);
    if (!reason.trim() || !post) {
      showNotification.warning("Missing Information", "Please provide a description of the issue.")
      return
    }

    setIsSubmitting(true)
    showNotification.success("Submitting Report", "Your report is being submitted...")

    try {
      // Simulate API call
      await reportUser(post.id, post.userId, reason);
      onClose()
      showNotification.success("Report Submitted", "Thank you for your report. Our admin team will review it shortly.")
    } catch (error) {
      showNotification.error("Submission Failed", "Failed to submit your report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      onClose()
    }
  }

  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Report Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Post Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h4 className="font-medium dark:text-white mb-1">Reporting:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{post.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-white">
              Reason for reporting *
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide specific details about why you're reporting this post..."
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> False reports may result in restrictions on your account. Please only report
              content that genuinely violates our community guidelines.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
