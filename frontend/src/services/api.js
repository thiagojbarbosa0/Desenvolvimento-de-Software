import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://nutri-ai-qp2b.onrender.com:8000',
});
