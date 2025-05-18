import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import {
  authorize,
  authorizeTeacher,
  setUser,
} from "../store/slices/authSlice";
import { getAuthToken } from "../utils/token-utils";
import { fetchUserData } from "./../api/user";

export const useAuthInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (token) {
        dispatch(authorize());
        try {
          const userData = await fetchUserData();
          const user = userData.data;
          dispatch(setUser(user));
          if (userData.role === "teacher") {
            dispatch(authorizeTeacher());
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    initializeAuth();
  }, [dispatch]);
};
