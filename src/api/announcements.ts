import axiosClient from "./axios";

// Fetch announcements with pagination
export const fetchAnnouncements = async (page = 1, limit = 10) => {
  const response = await axiosClient.get(
    `/announcements?page=${page}&limit=${limit}`
  );
  return response.data;
};
export const fetchNyAnnouncements = async (page = 1, limit = 10) => {
  const response = await axiosClient.get(
    `/my-announcements?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Fetch teacher's announcements
export const fetchMyAnnouncements = async (page = 1, limit = 10) => {
  const response = await axiosClient.get(
    `/my-announcements?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Create a new announcement
export const createAnnouncement = async (announcementData: {
  title: string;
  content: string;
}) => {
  const response = await axiosClient.post("/announcements", announcementData);
  return response.data;
};

// Update an announcement
export const updateAnnouncement = async (
  id: string,
  announcementData: {
    title?: string;
    content?: string;
  }
) => {
  const response = await axiosClient.put(
    `/announcements/${id}`,
    announcementData
  );
  return response.data;
};

// Delete an announcement
export const deleteAnnouncement = async (id: string) => {
  const response = await axiosClient.delete(`/announcements/${id}`);
  return response.data;
};
