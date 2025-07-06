"use client"

import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export const showNotification = {
  success: (title: string, description?: string) => {
    toast({
      variant: "default",
      title: title,
      description: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {description}
        </div>
      ),
      duration: 4000,
    })
  },

  error: (title: string, description?: string) => {
    toast({
      variant: "destructive",
      title: title,
      description: (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {description}
        </div>
      ),
      duration: 5000,
    })
  },

  warning: (title: string, description?: string) => {
    toast({
      variant: "destructive",
      title: title,
      description: (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {description}
        </div>
      ),
      duration: 4000,
    })
  },
}
