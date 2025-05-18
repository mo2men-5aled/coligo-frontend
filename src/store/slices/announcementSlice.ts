import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchAnnouncements,
  fetchMyAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "../../api/announcements";
import type { Announcement } from "../../types/announcementType";
import type { ErrorResponseType } from "../../types/ErrorResponseType";

// Define pagination metadata
interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// Define the state structure for announcements
interface AnnouncementState {
  announcements: Announcement[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  meta: PaginationMeta;
}

// Define the initial state
const initialState: AnnouncementState = {
  announcements: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  deleteStatus: "idle",
  meta: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  },
};

// Create async thunk for fetching announcements with pagination
export const fetchAnnouncementsThunk = createAsyncThunk(
  "announcements/fetchAnnouncements",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchAnnouncements(params.page, params.limit);
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message ||
          "Failed to fetch announcements"
      );
    }
  }
);

export const fetchMyAnnouncementsThunk = createAsyncThunk(
  "announcements/fetchMyAnnouncements",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchMyAnnouncements(params.page, params.limit);
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message ||
          "Failed to fetch announcements"
      );
    }
  }
);
// Create async thunk for creating a new announcement
export const createAnnouncementThunk = createAsyncThunk(
  "announcements/createAnnouncement",
  async (
    announcementData: { title: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await createAnnouncement(announcementData);
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message ||
          "Failed to create announcement"
      );
    }
  }
);

// Create async thunk for deleting an announcement
export const deleteAnnouncementThunk = createAsyncThunk(
  "announcements/deleteAnnouncement",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAnnouncement(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message ||
          "Failed to delete announcement"
      );
    }
  }
);

export const updateAnnouncementThunk = createAsyncThunk(
  "announcements/updateAnnouncement",
  async (
    { id, title, content }: { id: string; title: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateAnnouncement(id, { title, content });
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message ||
          "Failed to update announcement"
      );
    }
  }
);

export const setPage = (page: number) => {
  return {
    type: "announcements/setPage",
    payload: page,
  };
};

// Create the announcement slice
const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    // Reset the status (useful after form submissions)
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state when fetching announcements
      .addCase(fetchAnnouncementsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // Handle successful announcements fetch
      .addCase(fetchAnnouncementsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.announcements = action.payload.data;
        state.meta = action.payload.meta;
      })
      // Handle failed announcements fetch
      .addCase(fetchAnnouncementsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch announcements";
      })

      // Create announcement cases
      .addCase(createAnnouncementThunk.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createAnnouncementThunk.fulfilled, (state) => {
        state.createStatus = "succeeded";
        // We'll refetch the announcements after creation instead of updating the state directly
      })
      .addCase(createAnnouncementThunk.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to create announcement";
      })

      // Delete announcement cases
      .addCase(deleteAnnouncementThunk.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteAnnouncementThunk.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.announcements = state.announcements.filter(
          (announcement) => announcement._id !== action.payload
        );
      })
      .addCase(deleteAnnouncementThunk.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to delete announcement";
      })

      // Update announcement cases
      .addCase(updateAnnouncementThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAnnouncementThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the announcement in the state
        const updated = action.payload.data;
        state.announcements = state.announcements.map((a) =>
          a._id === updated._id ? updated : a
        );
      })
      .addCase(updateAnnouncementThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to update announcement";
      });
  },
});

// Export actions and reducer
export const { resetStatus, resetCreateStatus, resetDeleteStatus } =
  announcementSlice.actions;
export default announcementSlice.reducer;
