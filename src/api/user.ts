import axiosClient from "./axios";

export const fetchUserData = async () => {
  const response = await axiosClient.get("/user/me");
  return response.data;
};
