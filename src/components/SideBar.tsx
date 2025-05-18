import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NavList } from "./NavList";
import { useAppSelector } from "../store/hooks";

interface SidebarProps {
  isOpen: boolean;
  variant?: string;
  direction?: "row" | "column";
  onClose: () => void;
  CloseAfterSelect: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  variant,
  onClose,
  CloseAfterSelect,
}) => {
  // Get user information from Redux store
  const user = useAppSelector((state) => state.auth.user?.user);

  const isTeacher = user?.role === "teacher";

  const isLoading = !user;

  // Create gradient background style
  const sidebarStyle = {
    background: "linear-gradient(to bottom, #0f2e4e, #1da5a5)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 2,
    height: "100%",
    width: "320px",
  };

  // Content to be displayed in both sidebar and drawer
  const sidebarContent = (
    <Box sx={sidebarStyle}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 2, textAlign: "center" }}
      >
        Coligo
        {/* i need to add the close button in here but it will only be displayed if the screen was small  */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </Typography>

      {/* User Profile Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
          width: "100%",
          p: 2,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 1,
          minHeight: 120,
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress sx={{ color: "white" }} />
        ) : (
          <>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mb: 1,
                bgcolor: isTeacher ? "secondary.main" : "primary.main",
              }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {isTeacher ? "Teacher" : "Student"}
            </Typography>
          </>
        )}
      </Box>

      <Divider
        sx={{ width: "100%", mb: 2, backgroundColor: "rgba(255,255,255,0.2)" }}
      />
      <NavList direction="column" CloseAfterSelect={CloseAfterSelect} />
    </Box>
  );

  // Render sidebar for larger screens or drawer for smaller screens
  return variant === "sidebar" ? (
    // Permanent sidebar for larger screens
    <Box component="nav" sx={{ width: { md: "320px" }, flexShrink: 0 }}>
      {sidebarContent}
    </Box>
  ) : (
    // Drawer for smaller screens
    <Drawer
      open={isOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      ></Box>
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
