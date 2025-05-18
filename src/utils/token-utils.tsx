import Cookies from "js-cookie";
const TOKEN_KEY = "authToken";

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token);
};
export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export function checkIsLoggedIn() {
  const token = Cookies.get(TOKEN_KEY);
  if (!token) return false;
  return true;
}
