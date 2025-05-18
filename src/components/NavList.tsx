import { Button, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

interface NavListProps {
  direction: "row" | "column";
  CloseAfterSelect: () => void;
}

export const NavList = ({ direction, CloseAfterSelect }: NavListProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Navigation items
  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/schedule", label: "Schedule" },
    { path: "/courses", label: "Courses" },
    { path: "/gradebook", label: "Gradebook" },
    { path: "/performance", label: "Performance" },
    { path: "/quizzes", label: "Quizzes" },
    { path: "/announcements", label: "Announcements" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    CloseAfterSelect(); // Close sidebar on mobile after selection
  };

  return (
    <Stack direction={direction} spacing={1} sx={{ width: "100%" }}>
      {navItems.map((item) => (
        <Button
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          variant={isActive(item.path) ? "contained" : "text"}
          sx={{
            justifyContent: direction === "column" ? "flex-start" : "center",
            color: isActive(item.path) ? "#fff" : "rgba(255,255,255,0.8)",
            backgroundColor: isActive(item.path)
              ? "rgba(255,255,255,0.2)"
              : "transparent",
            "&:hover": {
              backgroundColor: isActive(item.path)
                ? "rgba(255,255,255,0.3)"
                : "rgba(255,255,255,0.1)",
            },
            textAlign: "left",
            width: "100%",
            py: 1.5,
            px: 2,
          }}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );
};
