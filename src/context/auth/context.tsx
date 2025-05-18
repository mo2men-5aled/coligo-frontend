import { createContext, useState, useContext, useCallback } from "react";
import type { ReactNode } from "react";
import {
  setAuthToken,
  checkIsLoggedIn,
  removeAuthToken,
} from "../../utils/token-utils";
import { useAppDispatch } from "../../store/hooks";

import { unauthorize as stateUnAuth } from "../../store/slices/authSlice";

interface AuthContextProps {
  isAuthorized: boolean;
  unauthorize: () => void;
  authorize: (token: string) => void;
  authorizeTeacher: () => void;
  unauthorizeTeacher: () => void;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isAuthorized, setIsAuthorized] = useState(checkIsLoggedIn());
  const [isTeacher, setIsTeacher] = useState(false);
  const dispatch = useAppDispatch();



  const unauthorize = useCallback(() => {
    setIsAuthorized(false);
    dispatch(stateUnAuth())
    removeAuthToken();
  }, []);

  const authorize = useCallback((token: string) => {
    setIsAuthorized(true);
    setAuthToken(token);
  }, []);

  const authorizeTeacher = useCallback(() => {
    setIsTeacher(true);
  }, []);

  const unauthorizeTeacher = useCallback(() => {
    setIsTeacher(false);
  }, []);

  const contextValue: AuthContextProps = {
    isAuthorized,
    unauthorize,
    authorize,
    authorizeTeacher,
    unauthorizeTeacher,
    isTeacher,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
