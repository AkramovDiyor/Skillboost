import { api } from "./base";

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('auth/register', userData),
}