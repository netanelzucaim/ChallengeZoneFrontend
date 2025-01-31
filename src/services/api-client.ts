import axios, { CanceledError } from "axios";

export { CanceledError };

const apiClient = axios.create({
    baseURL: "http://localhost:3060",
});

export default apiClient;

