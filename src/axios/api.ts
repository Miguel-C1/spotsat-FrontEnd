import axios from 'axios';

const baseURL = 'http://localhost:8080';


export default axios.create({
    baseURL: baseURL,
});

export const api_private = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

api_private.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        if (!config.headers) {
            config.headers = {};
        }
     
  
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

