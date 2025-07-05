import axios, { AxiosInstance } from "axios";

const http: AxiosInstance = axios.create({
  baseURL: process.env.VITE_SERVER_URL + "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ✅ Add a request interceptor to inject the latest token
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;