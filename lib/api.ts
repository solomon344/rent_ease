import axios from 'axios';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Optionally, add interceptors here if needed
// Api.interceptors.request.use(...);
// Api.interceptors.response.use(...);

export default Api;