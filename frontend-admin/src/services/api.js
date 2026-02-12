import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. Request Interceptor
API.interceptors.request.use((config) => {
   
    const token = localStorage.getItem('adminToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 2. Response Interceptor
API.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response && error.response.status === 401) {
         
            localStorage.removeItem('adminToken');
            
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default API;