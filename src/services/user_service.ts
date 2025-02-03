import apiClient, { CanceledError } from "./api-client";

export { CanceledError }

export interface User {
    _id?: string,
    username: string,
    password: string,
    avatar?: string
}

const register = async (user: User) => {
    const abortController = new AbortController();
    const request = await apiClient.post('/auth/register', user, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
}

const login = async (user: User) => {
    const abortController = new AbortController();
    const response = await apiClient.post('/auth/login', user, { signal: abortController.signal });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return response.data;
}



export default { register, login };