import axios from 'axios';

const baseURL =
    import.meta.env.MODE === 'production'
        ? `${window.location.origin.replace(':3000', ':8080')}`
        : 'http://localhost:8080';

console.log('Base URL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            if (
                error.response.status === 401 &&
                window.location.pathname !== '/login'
            ) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
