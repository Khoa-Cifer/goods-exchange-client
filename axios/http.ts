'use client';

import { showNotification } from "@/components/notification-helper";
import axios, { AxiosInstance } from "axios";

const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL + "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
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

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('Axios error:', error.response || error.message);

    // Optional: you can throw a custom error or handle specific status codes
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        window.location.href = "/"
      } else if (status === 500) {
        showNotification.error("Unexpected error has been occurred", "Please try again")
      }
    }

    return Promise.reject(error);
  }
);

export default http;