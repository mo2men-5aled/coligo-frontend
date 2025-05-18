import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAnnouncementsThunk,
  fetchMyAnnouncementsThunk,
  setPage,
} from "../store/slices/announcementSlice";

export const useAnnouncements = () => {
  const dispatch = useAppDispatch();
  const { announcements, status, error, meta } = useAppSelector(
    (state) => state.announcements
  );
  console.log(announcements)
  const isTeacher = useAppSelector(
    (state) => state.auth.user?.user.role === "teacher"
  );

  useEffect(() => {
    if (status === "idle") {
      const thunkAction = isTeacher
        ? fetchMyAnnouncementsThunk({ page: meta.page, limit: meta.limit })
        : fetchAnnouncementsThunk({ page: meta.page, limit: meta.limit });
      dispatch(thunkAction);
    }
  }, [status, meta.page, meta.limit, dispatch, isTeacher]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    const thunkAction = isTeacher
      ? fetchMyAnnouncementsThunk({ page: newPage, limit: meta.limit })
      : fetchAnnouncementsThunk({ page: newPage, limit: meta.limit });
    dispatch(thunkAction);
  };

  return {
    announcements: announcements || [],
    isLoading: status === "loading",
    error,
    meta,
    handlePageChange,
    isTeacher,
  };
};
