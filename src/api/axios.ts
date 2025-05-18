import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

import { getAuthToken } from "../utils/token-utils";

const apiClient = axios.create({
  baseURL: "https://coligo-backend-au7n.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();

  if (token) {
    // Add the token to Authorization header
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
