import apiClient, { CanceledError } from "./api-client";
import userService from "./user_service";

export { CanceledError }

export interface Comment {
    _id: string,
    comment: string,
    sender: string,
    postId: string,
    username?: string,
    avatarUrl?: string
}

const getComments = async (postId: string) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.get<Comment[]>(`/comments?postId=${postId}`, {
            signal: abortController.signal
        });

        const comments = response.data;

        const updatedComments = await Promise.all(comments.map(async (comment) => {
            const userResponse = await userService.getUser(comment.sender).request;
            const user = userResponse.data;
            return {
                ...comment,
                username: user.username,
                avatarUrl: user.avatar
            };
        }));

        return { data: updatedComments, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to fetch comments', error);
        throw error;
    }
}

const getComment = async (commentId: string) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.get(`/comments/${commentId}`, {
            signal: abortController.signal
        });
        return { data: response.data, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to delete comment', error);
        throw error;
    }
}



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

export default { getComments, deleteComment ,getComment};