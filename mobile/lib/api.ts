import { useAuth } from '@clerk/clerk-expo';
import axios from 'axios'
import { useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export const useApi = async () => {
    const { getToken } = useAuth()
    useEffect(() => {
        const interceptor =  api.interceptors.request.use(async (config) => {
            const token = await getToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
        return () => {
            api.interceptors.request.eject(interceptor)
        }
    }, [getToken])
    return api;
}