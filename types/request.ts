import { User } from "./user";

export type Request = {
    id: string;
    description: string;
    userId: string;
    user: User;
    requestTypeId: string;
    requestType: RequestType
    status: number;
    response: string | null;
    createdAt: string;
    updatedAt: string;
}

export type RequestType = {
    id: string;
    type: string;
    createdAt: string;
}