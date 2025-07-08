import type { Post } from "@/types/post"

export const mockPosts: Post[] = [
    {
        id: "post_1",
        title: "MacBook Pro 2021 - Excellent Condition",
        description:
            "Barely used MacBook Pro with M1 chip, 16GB RAM, 512GB SSD. Perfect for students and professionals. Comes with original charger and box. No scratches or dents, always kept in a protective case.",
        price: 1200,
        userId: "user_1",
        campus: "Main Campus",
        status: 1,
        type: 1,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-16T14:20:00Z",
        images: [
            {
                id: "img_1",
                cloudinaryPublicId: "macbook_front_view",
                imageBase64: "",
            },
            {
                id: "img_2",
                cloudinaryPublicId: "macbook_side_view",
                imageBase64: "",
            },
            {
                id: "img_3",
                cloudinaryPublicId: "macbook_screen",
                imageBase64: "",
            },
        ],
        postCategories: [
            {
                id: "pc_1",
                postId: "post_1",
                categoryId: "cat_1",
                category: { id: "cat_1", name: "Electronics" },
            },
            {
                id: "pc_2",
                postId: "post_1",
                categoryId: "cat_2",
                category: { id: "cat_2", name: "Computers" },
            },
        ],
    },
    {
        id: "post_2",
        title: "Vintage Leather Jacket - Size M",
        description:
            "Authentic vintage leather jacket in great condition. Perfect for fashion enthusiasts. Genuine leather with classic styling. Some minor wear that adds to the vintage character.",
        price: 85,
        userId: "user_2",
        campus: "North Campus",
        status: 1,
        type: 1,
        createdAt: "2024-01-14T09:15:00Z",
        updatedAt: "2024-01-14T09:15:00Z",
        images: [
            {
                id: "img_4",
                cloudinaryPublicId: "jacket_front",
                imageBase64: "",
            },
            {
                id: "img_5",
                cloudinaryPublicId: "jacket_back",
                imageBase64: "",
            },
        ],
        postCategories: [
            {
                id: "pc_3",
                postId: "post_2",
                categoryId: "cat_3",
                category: { id: "cat_3", name: "Fashion" },
            },
        ],
    },
    {
        id: "post_3",
        title: "Looking for: Calculus Textbook",
        description:
            "Need a calculus textbook for Math 101. Willing to pay fair price or exchange for other textbooks. Preferably the latest edition but older editions are fine too.",
        price: 50,
        userId: "user_3",
        campus: "South Campus",
        status: 1,
        type: 2,
        createdAt: "2024-01-13T16:45:00Z",
        updatedAt: "2024-01-13T16:45:00Z",
        images: [],
        postCategories: [
            {
                id: "pc_4",
                postId: "post_3",
                categoryId: "cat_4",
                category: { id: "cat_4", name: "Books" },
            },
        ],
    },
    {
        id: "post_4",
        title: "Mountain Bike - Trek 3500",
        description:
            "Well-maintained mountain bike, perfect for campus commuting and weekend trails. Recently serviced with new tires and brake pads. Great condition overall.",
        price: 300,
        userId: "user_4",
        campus: "Main Campus",
        status: 2,
        type: 1,
        createdAt: "2024-01-12T11:20:00Z",
        updatedAt: "2024-01-16T09:30:00Z",
        images: [
            {
                id: "img_6",
                cloudinaryPublicId: "bike_full_view",
                imageBase64: "",
            },
            {
                id: "img_7",
                cloudinaryPublicId: "bike_details",
                imageBase64: "",
            },
        ],
        postCategories: [
            {
                id: "pc_5",
                postId: "post_4",
                categoryId: "cat_5",
                category: { id: "cat_5", name: "Sports" },
            },
        ],
    },
    {
        id: "post_5",
        title: "Gaming Setup - Monitor & Keyboard",
        description:
            "Complete gaming setup including 27-inch 144Hz monitor and mechanical keyboard. Perfect for gaming and productivity. Monitor has excellent color accuracy.",
        price: 450,
        userId: "user_5",
        campus: "West Campus",
        status: 1,
        type: 1,
        createdAt: "2024-01-11T08:15:00Z",
        updatedAt: "2024-01-15T12:00:00Z",
        images: [
            {
                id: "img_8",
                cloudinaryPublicId: "gaming_setup",
                imageBase64: "",
            },
        ],
        postCategories: [
            {
                id: "pc_6",
                postId: "post_5",
                categoryId: "cat_1",
                category: { id: "cat_1", name: "Electronics" },
            },
            {
                id: "pc_7",
                postId: "post_5",
                categoryId: "cat_6",
                category: { id: "cat_6", name: "Gaming" },
            },
        ],
    },
    {
        id: "post_6",
        title: "Designer Handbag - Coach",
        description:
            "Authentic Coach handbag in excellent condition. Barely used, comes with authenticity card and dust bag. Perfect for special occasions or daily use.",
        price: 280,
        userId: "user_6",
        campus: "East Campus",
        status: 1,
        type: 1,
        createdAt: "2024-01-10T14:30:00Z",
        updatedAt: "2024-01-10T14:30:00Z",
        images: [
            {
                id: "img_9",
                cloudinaryPublicId: "handbag_front",
                imageBase64: "",
            },
            {
                id: "img_10",
                cloudinaryPublicId: "handbag_inside",
                imageBase64: "",
            },
        ],
        postCategories: [
            {
                id: "pc_8",
                postId: "post_6",
                categoryId: "cat_3",
                category: { id: "cat_3", name: "Fashion" },
            },
        ],
    },
]
