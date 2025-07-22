import { Badge } from "@/components/ui/badge";
import { RequestStatus } from "@/enum/request-status";
import { Request } from "@/types/request";
import { type ClassValue, clsx } from "clsx"
import { AlertCircle, Clock } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export const getStatusBadge = (status: Request["status"]) => {
  switch (status) {
    case RequestStatus.Created:
      return (
        <Badge variant="secondary" >
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case RequestStatus.Confirmed:
      return (
        <Badge variant="default" >
          <AlertCircle className="w-3 h-3 mr-1" />
          Confirmed
        </Badge>
      )
    case RequestStatus.Rejected:
      return <Badge variant="destructive">Closed</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}