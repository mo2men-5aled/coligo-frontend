import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchQuizzes, createQuiz, deleteQuiz, updateQuiz } from '../../api/quizzes';
import type { Quiz } from '../../types/quizType';
import type { ErrorResponseType } from '../../types/ErrorResponseType';

interface QuizState {
  quizzes: Quiz[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedQuiz: Quiz | null;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: QuizState = {
  quizzes: [],
  status: 'idle',
  error: null,
  selectedQuiz: null,
  pagination: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  }
};

// Fetch quizzes with pagination
export const fetchQuizzesThunk = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await fetchQuizzes(params.page, params.limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message || 'Failed to fetch quizzes'
      );
    }
  }
);

// Create a new quiz
export const createQuizThunk = createAsyncThunk(
  'quizzes/createQuiz',
  async (quizData: { title: string; description: string; date: string }, { rejectWithValue }) => {
    try {
      const response = await createQuiz(quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message || 'Failed to create quiz'
      );
    }
  }
);

// Delete a quiz
export const deleteQuizThunk = createAsyncThunk(
  'quizzes/deleteQuiz',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteQuiz(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message || 'Failed to delete quiz'
      );
    }
  }
);

// Update a quiz
export const updateQuizThunk = createAsyncThunk(
  'quizzes/updateQuiz',
  async (
    { id, title, description, date }: { id: string; title: string; description: string; date: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateQuiz(id, { title, description, date });
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as ErrorResponseType)?.response?.data?.message || 'Failed to update quiz'
      );
    }
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    selectQuiz: (state, action) => {
      state.selectedQuiz = action.payload;
    },
    clearSelectedQuiz: (state) => {
      state.selectedQuiz = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
        // Update pagination info
        if (action.payload.meta) {
          state.pagination = {
            page: action.payload.meta.page,
            limit: action.payload.meta.limit,
            totalItems: action.payload.meta.totalItems,
            totalPages: action.payload.meta.totalPages
          };
        }
      })
      .addCase(fetchQuizzesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quizzes';
      })
      // Create quiz cases
      .addCase(createQuizThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createQuizThunk.fulfilled, (state) => {
        state.status = 'succeeded';
        // We'll refetch the quizzes to get the updated list
      })
      .addCase(createQuizThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create quiz';
      })
      // Delete quiz cases
      .addCase(deleteQuizThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteQuizThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted quiz from the state
        state.quizzes = state.quizzes.filter(quiz => quiz._id !== action.payload);
      })
      .addCase(deleteQuizThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete quiz';
      })
      // Update quiz cases
      .addCase(updateQuizThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateQuizThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the quiz in the state
        const updated = action.payload.data;
        state.quizzes = state.quizzes.map((q) =>
          q._id === updated._id ? updated : q
        );
      })
      .addCase(updateQuizThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update quiz';
      });
  }
});

export const { resetStatus, setPage, selectQuiz, clearSelectedQuiz } = quizSlice.actions;
export default quizSlice.reducer;