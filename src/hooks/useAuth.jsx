import { useCallback, useEffect, useMemo, useState } from 'react'

import axios from 'axios';
import Api from '../lib/api';
import { BASE_API_URL, TOKEN_NAME } from '../lib/settings';



const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const isTokenExpired = (token) => {
    const tokenPayload = parseJwt(token)
    const expiryDate = new Date(tokenPayload.exp * 1000)
    const now = new Date()
    return now.getTime() > expiryDate.getTime()
};

const getToken = () => localStorage.getItem(TOKEN_NAME);

export default function useAuth() {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const axiosInstance = axios.create({
        baseURL: BASE_API_URL,
    })

    const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
            const token = getToken()
            if (token) {
                if (isTokenExpired(token) && user.isLoggedIn) {
                    logout()
                }
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    const responseInterceptor = axiosInstance.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            if (error.response?.status === 401 && user.isLoggedIn) {
                logout();
            }
          return Promise.reject(error);
        }
    );
    
    const api = useMemo(() => new Api(axiosInstance), [axiosInstance]);

    const getUserInfo = useCallback(async (token) => {
        const tokenPayload = parseJwt(token)
        const { _id: id } = tokenPayload;
        try {
            const response = await api.getUser(id);
            return response.data
        }
        catch (error) {
            console.error('Error fetching user info:', error)
            return {isLoggedIn: false}
        }
    }, [api]);

    const login = (user) => {
        localStorage.setItem(TOKEN_NAME, user.token)
        setUser({isLoggedIn: true, ...user})
    }

    const logout = async () => {
        localStorage.removeItem(TOKEN_NAME)
        setUser({isLoggedIn: false})
    }

    useEffect(() => {
        if (user) return
        const initApp = async () => {
            setIsLoading(true)
            const token = getToken()

            if (token) {
                const userInfo = await getUserInfo(token)
                setUser({isLoggedIn: true, ...userInfo})
            } else {
                setUser({isLoggedIn: false})
            }
            setIsLoading(false)
        }
        initApp()
        
        return () => {
            axiosInstance.interceptors.response.eject(responseInterceptor);
            axiosInstance.interceptors.request.eject(requestInterceptor);
        };
    }, [requestInterceptor, axiosInstance, responseInterceptor, getUserInfo, user])

    return {
        user,
        setUser,
        getUserInfo,
        login,
        logout,
        api,
        isLoading
    }
}
