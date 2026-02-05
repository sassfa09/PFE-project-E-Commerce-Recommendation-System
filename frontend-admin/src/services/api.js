import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Make sure this matches your backend port
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. Request Interceptor: adds the token before the request is sent
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 2. Response Interceptor: checks if there is an issue in the response
API.interceptors.response.use(
    (response) => response, 
    (error) => {
        // If the server returns 401 (token is no longer valid)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; // Redirect to login again
        }
        return Promise.reject(error);
    }
);

export default API;
