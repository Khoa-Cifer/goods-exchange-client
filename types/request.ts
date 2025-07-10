export interface Request {
    id: string
    userId: string
    userName: string
    userEmail: string
    type: "general" | "technical" | "account" | "item" | "report"
    subject: string
    description: string
    priority: "low" | "medium" | "high"
    status: "pending" | "in_progress" | "resolved" | "closed"
    attachments?: string[]
    createdAt: Date
    updatedAt: Date
    adminResponse?: string
    adminId?: string
    relatedPostId?: string
}

export interface Report {
    id: string
    reporterId: string
    reporterName: string
    postId: string
    postTitle: string
    reason: "spam" | "inappropriate" | "fraud" | "fake" | "harassment" | "other"
    description: string
    status: "pending" | "reviewed" | "resolved" | "dismissed"
    createdAt: Date
    reviewedAt?: Date
    reviewedBy?: string
    adminNotes?: string
}
