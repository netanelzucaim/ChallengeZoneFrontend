import axios, { CanceledError, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
export { CanceledError };
const backend_url = import.meta.env.VITE_BACKEND_URL

const apiClient = axios.create({
    baseURL: backend_url,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            if (!config.headers) {
                config.headers = new axios.AxiosHeaders();
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${backend_url}/auth/refresh`, { refreshToken });
                    const { accessToken, _id } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    if (!originalRequest.headers) {
                        originalRequest.headers = {};
                    }
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    localStorage.setItem('userId', _id);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch (err) {
                    console.error('Refresh token expired or invalid', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userId');

                    window.location.href = '/login'; // Redirect to login page
                }
            } else {
                window.location.href = '/login'; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;