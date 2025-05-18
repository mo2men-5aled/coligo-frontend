import axios from "axios";

import { getAuthToken } from "../utils/token-utils";

const apiClient = axios.create({
  baseURL: "https://coligo-backend-au7n.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Get the token from cookies using js-cookie
    const token = getAuthToken();

    if (token) {
      // Add the token to Authorization header
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
