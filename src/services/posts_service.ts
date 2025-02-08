import apiClient, { CanceledError } from "./api-client";
import userService from "./user_service";
import commentsService from "./comments_service";

export { CanceledError }

interface Post {
    _id: string,
    postPic: string,
    content: string,
    sender: string,
    username?: string, // Add username field
    avatarUrl?: string, // Add avatarUrl field
    comments: string[]
}

const getPosts = async () => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.get<Post[]>('/posts', {
            signal: abortController.signal
        });

        const posts = response.data;

        const updatedPosts = await Promise.all(posts.map(async (post) => {
            const userResponse = await userService.getUser(post.sender).request;
            const user = userResponse.data;
            return {
                ...post,
                username: user.username,
                avatarUrl: user.avatar
            };
        }));

        return { data: updatedPosts, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to fetch posts', error);
        throw error;
    }
}

const getCommentsForPost = async (postId: string) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.get<Post>(`/posts/${postId}`, {
            signal: abortController.signal
        });

        const post = response.data;
        const commentPromises = post.comments.map(async (commentId: string) => {
            try {
                const { data } = await commentsService.getComment(commentId);
                return data;
            } catch (error) {
                console.error(`Failed to fetch comment with ID ${commentId}`, error);
                return null;
            }
        });

        const comments = (await Promise.all(commentPromises)).filter(comment => comment !== null);
        return { data: comments, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to fetch comments for post', error);
        throw error;
    }
}

const getPostsForUser = async () => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.get<Post[]>(`/posts?sender=${localStorage.getItem('userId')}`, {
            signal: abortController.signal
        });

        const posts = response.data;

        const updatedPosts = await Promise.all(posts.map(async (post) => {
            const userResponse = await userService.getUser(post.sender).request;
            const user = userResponse.data;
            return {
                ...post,
                username: user.username,
                avatarUrl: user.avatar
            };
        }));

        return { data: updatedPosts, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to fetch posts', error);
        throw error;
    }
}


const deletePost = (postId: string) => {
    const abortController = new AbortController();
    const token = localStorage.getItem('accessToken');
    const request = apiClient.delete(`/posts/${postId}`, {
        signal: abortController.signal,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return { request, abort: () => abortController.abort() };
}

const addPost = (post: { content: string, postPic?: string }) => {
    const abortController = new AbortController();
    const token = localStorage.getItem('accessToken');
    const request = apiClient.post('/posts', post, {
        signal: abortController.signal,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return { request, abort: () => abortController.abort() };
}

export default { getPosts, getPostsForUser, deletePost, addPost, getCommentsForPost };