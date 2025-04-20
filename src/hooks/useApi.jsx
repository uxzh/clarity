import { useMemo } from 'react';
import axios from 'axios';
import Api from '../lib/api';
import { BASE_API_URL } from '../lib/settings';

export function useApi() {
    const axiosInstance = useMemo(() => {
        return axios.create({
            baseURL: BASE_API_URL,
        });
    }, []);

    const api = useMemo(() => new Api(axiosInstance), [axiosInstance]);

    return api;
}
