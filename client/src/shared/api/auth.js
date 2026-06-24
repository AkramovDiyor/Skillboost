import { api_local } from "./base";

export const authApi = {
    login: (credentials) => api_local.post('/auth/login', credentials),
    register: (userData) => api_local.post('auth/register', userData),
}