import { useAuth } from "../context/auth/context";

export const useMe = () => {
  const { isAuthorized } = useAuth();
  return { isAuthorized };
};
