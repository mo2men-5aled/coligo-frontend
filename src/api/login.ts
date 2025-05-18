import axiosClient from "./axios";

export const login = async (email: string, password: string) => {
  const response = await axiosClient.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};
