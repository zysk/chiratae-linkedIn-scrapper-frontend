// axiosInstance.ts

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { store } from '../../redux/store'; // Import your Redux store

const BASE_URL_PATH = process.env.NEXT_PUBLIC_BASE_URL;

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: BASE_URL_PATH, // Replace with your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from the Redux store
    const state = store.getState();
    console.log(state)
    const token = state.auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Any status code within the range of 2xx will trigger this function
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Any status codes outside the range of 2xx will trigger this function
    // Handle response error
    if (error.response && error.response.status === 401) {
        // Handle unauthorized error
        // For example, redirect to login page
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;
  