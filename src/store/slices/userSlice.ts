import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from '@reduxjs/toolkit';
import { register } from "../../api/register";
import type { ErrorResponseType } from "../../types/ErrorResponseType";

// Define the state structure for user registration
interface UserState {
  registrationStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Define the initial state
const initialState: UserState = {
  registrationStatus: "idle",
  error: null,
};

// Create async thunk for user registration
export const registerUserThunk = createAsyncThunk(
  "user/register",
  async (
    userData: { name: string; email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message ||
          "Registration failed"
      );
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Reset the registration status
    resetRegistrationStatus: (state) => {
      state.registrationStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state when registering
      .addCase(registerUserThunk.pending, (state) => {
        state.registrationStatus = "loading";
        state.error = null;
      })
      // Handle successful registration
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.registrationStatus = "succeeded";
      })
      // Handle failed registration
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.registrationStatus = "failed";
        state.error = (action.payload as string) || "Registration failed";
      });
  },
});

// Export actions and reducer
export const { resetRegistrationStatus } = userSlice.actions;
export default userSlice.reducer;
