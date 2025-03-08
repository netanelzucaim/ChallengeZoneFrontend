
export interface Post {
    _id: string;
    content: string;
    sender: string;
    avatarUrl?: string;
    postPic?: string; // Make postPic optional
    displayName?: string;
    comments: string[]; // Add comments array
    likes: string[]; // Add likes array
    createdAt: string; // Add createdAt field
}

export interface User {
    _id?: string;
    username: string;
    displayName: string;
    avatar?: string;
}

export interface Comment {
    _id: string;
    comment: string;
    sender: string;
    postId: string;
    displayName?: string;
    avatarUrl?: string;
    createdAt: string; // Add createdAt field
}
