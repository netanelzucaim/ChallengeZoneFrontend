import apiClient, { CanceledError } from "./api-client";
import userService from "./user_service";

export { CanceledError }

export interface Comment {
    _id: string,
    comment: string,
    sender: string,
    postId: string,
    displayName?: string,
    avatarUrl?: string
}

// const getComments = async (postId: string) => {
//     const abortController = new AbortController();
//     try {
//         const response = await apiClient.get<Comment[]>(`/comments?postId=${postId}`, {
//             signal: abortController.signal
//         });

//         const comments = response.data;

//         const updatedComments = await Promise.all(comments.map(async (comment) => {
//             const userResponse = await userService.getUser(comment.sender).request;
//             const user = userResponse.data;
//             return {
//                 ...comment,
//                 username: user.username,
//                 avatarUrl: user.avatar
//             };
//         }));

//         return { data: updatedComments, abort: () => abortController.abort() };
//     } catch (error) {
//         console.error('Failed to fetch comments', error);
//         throw error;
//     }
// }

const getComment = async (commentId: string) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.get(`/comments/${commentId}`, {
            signal: abortController.signal
        });
        const comment = response.data;

        const userResponse = await userService.getUser(comment.sender).request;
        const user = userResponse.data;

        const updatedComment = {
            ...comment,
            displayName: user.displayName,
            avatarUrl: user.avatar
        };

        return { data: updatedComment, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to fetch comment', error);
        throw error;
    }
}

// const getPosts = async () => {
//     const abortController = new AbortController();
//     try {
//         const response = await apiClient.get<Post[]>('/posts', {
//             signal: abortController.signal
//         });

//         const posts = response.data;

//         const updatedPosts = await Promise.all(posts.map(async (post) => {
//             const userResponse = await userService.getUser(post.sender).request;
//             const user = userResponse.data;
//             return {
//                 ...post,
//                 username: user.username,
//                 avatarUrl: user.avatar
//             };
//         }));

//         return { data: updatedPosts, abort: () => abortController.abort() };
//     } catch (error) {
//         console.error('Failed to fetch posts', error);
//         throw error;
//     }
// }
const deleteComment = async (commentId: string) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.delete(`/comments/${commentId}`, {
            signal: abortController.signal
        });
        return { data: response.data, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to delete comment', error);
        throw error;
    }
}
const updateComment = async (commentId: string, updatedComment: string) => {
    const abortController = new AbortController();
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.put(`/comments/${commentId}`, { comment: updatedComment }, {
            signal: abortController.signal,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { data: response.data, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to update comment', error);
        throw error;
    }
}
const addComment = async (postId: string, comment: string) => {
    const abortController = new AbortController();
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.post(`/comments`, { postId, comment }, {
            signal: abortController.signal,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { data: response.data, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to add comment', error);
        throw error;
    }
}

export default {addComment,updateComment, deleteComment ,getComment};