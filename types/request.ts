export type Request = {
    id: string
    description: string;
    userId: string
    requestType_id: string;
    requestType: RequestType;
    status: number;
    response: string;
    createdAt: string;
    updatedAt: string;
}

export type RequestType = {
    id: string;
    type: string;
    createdAt: string;
}

export type Report = {
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
