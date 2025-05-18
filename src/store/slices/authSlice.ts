import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { checkIsLoggedIn } from "../../utils/token-utils";
import type { User } from "../../types/userType";

interface AuthState {
  isAuthorized: boolean;
  isTeacher: boolean;
  user: {
    user: {
      _id: string;
      email: string;
      name: string;
      role: string;
    };
  } | null;
  token: string | null; // Add token to the state interface
}

const initialState: AuthState = {
  isAuthorized: checkIsLoggedIn(),
  isTeacher: false,
  user: null,
  token: null, // Initialize token as null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authorize: (state) => {
      state.isAuthorized = true;
    },
    // Add authorizeWithToken as a separate reducer, not nested
    authorizeWithToken: (state, action: PayloadAction<string>) => {
      state.isAuthorized = true;
      // Store the token in Redux state
      state.token = action.payload;
    },
    unauthorize: (state) => {
      state.isAuthorized = false;
      state.isTeacher = false;
      state.user = null;
      state.token = null; // Clear the token on logout
    },
    authorizeTeacher: (state) => {
      state.isTeacher = true;
    },
    unauthorizeTeacher: (state) => {
      state.isTeacher = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload as unknown as null;
    },
  },
});

// Update the exports to include the new action
export const {
  authorize,
  unauthorize,
  authorizeTeacher,
  unauthorizeTeacher,
  setUser,
  authorizeWithToken,
} = authSlice.actions;
export default authSlice.reducer;
