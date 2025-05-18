import axiosClient from "./axios";

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await axiosClient.post("/auth/register", userData);
  return response.data;
};
