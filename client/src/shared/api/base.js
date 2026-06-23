import axios from "axios";

export const api = axios.create({
    baseURL: 'https://skillboost-t1xt.vercel.app/api',
})
export const api_local = axios.create({
    baseURL: 'http://localhost:4444/api',
})

api.interceptors.request.use((config) => {
    const data = JSON.parse(localStorage.getItem('data'));
    if (data?.token) {
        config.headers.Authorization = `Bearer ${data.token}`;
    }
    return config
})