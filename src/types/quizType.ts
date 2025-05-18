export interface Quiz {
  _id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface QuizList {
  quizzes: Quiz[];
}

export interface CreateQuiz {
  title: string;
  description: string;
  date: string;
}

export interface UpdateQuiz {
  title: string;
  description: string;
  date: string;
}
