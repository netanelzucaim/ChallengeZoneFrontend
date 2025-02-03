import apiClient, { CanceledError } from "./api-client";


export { CanceledError }

export interface Post {
    _id: string,
    title: string,
    content: string,
    author: string
}

const getPosts = () => {
    const abortController = new AbortController()
    const request = apiClient.get<Post[]>('/posts',
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

// const addPost = () => {
//     const abortController = new AbortController()
//     const request = apiClient.post<Post[]>('/posts',
//         { signal: abortController.signal })
//     return { request, abort: () => abortController.abort() }
// }


export default { getPosts }