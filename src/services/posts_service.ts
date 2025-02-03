import apiClient, { CanceledError } from "./api-client";


export { CanceledError }

export interface Post {
    _id: string,
    title: string,
    content: string,
    author: string
}

const getPosts = () => {
    const abortController = new AbortController();
    const token = localStorage.getItem('accessToken');
    const request = apiClient.get<Post[]>('/posts', {
        signal: abortController.signal,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return { request, abort: () => abortController.abort() };
}
const getPostsForUser = () => {
    const abortController = new AbortController();
    const token = localStorage.getItem('accessToken');
    const request = apiClient.get<Post[]>('/posts/user', {
        signal: abortController.signal,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return { request, abort: () => abortController.abort() };
}
const addPost = (post: { content: string, postPic: string }) => {
    const abortController = new AbortController();
    const request = apiClient.post('/posts', post, {
        signal: abortController.signal,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return { request, abort: () => abortController.abort() };
}


export default { getPosts,getPostsForUser, addPost }