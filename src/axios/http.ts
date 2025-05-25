import axios, { AxiosInstance } from "axios";

const token = localStorage.getItem("token");

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : null,
  },
});


export default http;
