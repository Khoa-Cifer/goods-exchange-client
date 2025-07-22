import { Rating } from "./rating";
import { Violation } from "./violation";

export type Post = {
    id: string;
    title: string;
    description: string;
    price: number;
    userId: string;
    campus: string;
    status: number;
    type: number;
    ratings: Rating[];
    violations: Violation[];
    user: {
        username: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
    images: {
        id: string;
        cloudinaryPublicId: string;
        imageBase64: string;
    }[];
    postCategories: {
        id: string;
        postId: string;
        categoryId: string;
        category: {
            id: string;
            name: string;
        };
    }[];
}