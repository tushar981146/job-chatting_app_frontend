import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true,
});


axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle CORS errors specifically
    if (error.message === 'Network Error') {
      console.error('CORS/Network Error. Check backend configuration.');
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('Unauthorized access');
      // You can redirect to login here if needed
    }
    
    return Promise.reject(error);
  }
);

