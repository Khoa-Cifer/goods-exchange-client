import { Post } from "@/types/post";
import { DollarSign, MapPin, Calendar, FileText, Tag, Eye, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/utils";
import { Button } from "./ui/button";

export const AdminPostCard = ({ post, onSelectPreviewImage }: { post: Post, onSelectPreviewImage: any }) => {
    const handleViewPreviewImage = (base64Image: string) => {
        onSelectPreviewImage(base64Image);
    }

    return (
        <div className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Post Info */}
                <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg dark:text-white">{post.title}</h3>
                        <div className="flex gap-2">
                            <Badge variant={post.status === 1 ? "default" : post.status === 2 ? "secondary" : "destructive"}>
                                {post.status === 1 ? "Active" : post.status === 2 ? "Sold" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">{post.type === 1 ? "Sell" : post.type === 2 ? "Buy" : "Exchange"}</Badge>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{post.description}</p>

                    {/* Post Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span className="font-semibold text-green-600 dark:text-green-400">${post.price}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <MapPin className="w-4 h-4 mr-1" />
                            {post.campus}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(post.createdAt)}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <FileText className="w-4 h-4 mr-1" />
                            {post.images.length} image{post.images.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-1">
                        {post.postCategories.map((pc) => (
                            <Badge key={pc.id} variant="secondary" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {pc.category.name}
                            </Badge>
                        ))}
                    </div>

                    {post.images.length > 0 && (
                        <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Images</h4>
                            <div className="flex flex-wrap gap-1">
                                {post.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => handleViewPreviewImage(image.imageBase64)}
                                        className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded border flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-green-600 dark:text-green-400"
                    >
                        {post.status === 1 && (
                            "Confirm"
                        )}
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 bg-transparent">
                        Reject
                    </Button>
                    <Button variant="outline" size="sm" className="text-white bg-transparent">
                        Hide
                    </Button>
                </div>
            </div>

            {/* Timestamps */}
            <div className="mt-4 pt-3 border-t dark:border-gray-600 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Created: {post.createdAt.toLocaleString()}</span>
                <span>Updated: {post.updatedAt.toLocaleString()}</span>
            </div>
        </div>
    )
}