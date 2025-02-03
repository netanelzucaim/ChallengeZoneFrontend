import apiClient, { CanceledError } from "./api-client";

export { CanceledError }

export interface User {
    _id?: string,
    username: string,
    password: string,
    avatar?: string
}

const register = (user: User) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/register',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}
const login = (user: User) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/login',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const uploadImage = (img: File) => {
    // const abortController = new AbortController()
    const formData = new FormData();
    formData.append("file", img);
    const request = apiClient.post('/file?file=' + img.name, formData, {
        headers: {
            'Content-Type': 'image/*'
        }
    })
    return { request }
}

const getImage = async (filename: string): Promise<string> => {
    const response = await apiClient.get(`/file/${filename}`, {
        responseType: 'blob'
    });
    const url = URL.createObjectURL(response.data);
    return url;
}

export default { register,login, uploadImage, getImage }