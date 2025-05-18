import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import AppWrapper from "./components/AppWrapper";
import SchedulePage from "./pages/SchedulePage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import PerformancePage from "./pages/PerformancePage";
import CoursesPage from "./pages/CoursesPage";
import GradebookPage from "./pages/GradebookPage";
import { useAuthInitializer } from "./hooks/useAuthInitializer";
import QuizzesPage from "./pages/QuizzesPage";

function App() {
  useAuthInitializer(); // This will sync the auth state on app load
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route element={<AppWrapper />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/gradebook" element={<GradebookPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
