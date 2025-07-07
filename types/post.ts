export type Post = {
    id: string;
    title: string;
    description: string;
    price: number;
    userId: string;
    campus: string;
    status: number;
    type: number;
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
