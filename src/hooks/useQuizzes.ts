import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchQuizzesThunk, setPage } from "../store/slices/quizSlice";

export const useQuizzes = () => {
  const dispatch = useAppDispatch();
  const { quizzes, status, error, pagination } = useAppSelector(
    (state) => state.quizzes
  );
  const isTeacher = useAppSelector(
    (state) => state.auth.user?.user.role === "teacher"
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(
        fetchQuizzesThunk({ page: pagination.page, limit: pagination.limit })
      );
    }
  }, [status, pagination.page, pagination.limit, dispatch]);

  // Function to change page
  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    dispatch(fetchQuizzesThunk({ page: newPage, limit: pagination.limit }));
  };

  return {
    quizzes: quizzes || [],
    isLoading: status === "loading",
    error,
    pagination,
    handlePageChange,
    isTeacher,
  };
};
