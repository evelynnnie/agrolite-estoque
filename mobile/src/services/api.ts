import axios from 'axios';

declare const process: {
    env: {
        EXPO_PUBLIC_API_URL: string;
    }
};

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;