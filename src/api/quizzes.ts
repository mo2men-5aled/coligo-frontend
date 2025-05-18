import axiosClient from "./axios";

// Fetch quizzes with pagination
export const fetchQuizzes = async (page = 1, limit = 10) => {
  const response = await axiosClient.get(
    `/quizzes?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Fetch teacher's quizzes
export const fetchMyQuizzes = async (page = 1, limit = 10) => {
  const response = await axiosClient.get(
    `/my-quizes?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Create a new quiz
export const createQuiz = async (quizData: {
  title: string;
  description: string;
  date: string;
}) => {
  const response = await axiosClient.post("/quizzes", quizData);
  return response.data;
};

// Update a quiz
export const updateQuiz = async (id: string, quizData: {
  title?: string;
  description?: string;
  date?: string;
}) => {
  const response = await axiosClient.put(`/quizzes/${id}`, quizData);
  return response.data;
};

// Delete a quiz
export const deleteQuiz = async (id: string) => {
  const response = await axiosClient.delete(`/quizzes/${id}`);
  return response.data;
};
