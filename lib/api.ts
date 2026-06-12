import axios from 'axios';
import { getSession } from 'next-auth/react';
import type { CustomSession } from '@/types';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  Api.interceptors.request.use(async (config) => {
    const session = await getSession() as CustomSession;
    const token = session?.user?.djangoAccess 
    if (token && config?.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  });
}

export default Api;