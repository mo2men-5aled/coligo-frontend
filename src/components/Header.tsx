import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme, useMediaQuery } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { unauthorize } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showSidebarButton?: boolean;
  onShowSidebar: () => void;
}

const Header = ({ showSidebarButton = true, onShowSidebar }: HeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get the logged-in user from Redux
  const user = useAppSelector((state) => state.auth.user?.user);

  // split the user name to get the first name only
  const firstName: string = user?.name.split(" ")[0] ?? "";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(unauthorize());
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 1, sm: 2, md: 4 },
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Sidebar Button */}
          <Box
            sx={{
              display: showSidebarButton && isMobile ? "block" : "none",
              mr: 2,
            }}
          >
            <IconButton
              aria-label="Open Sidebar"
              onClick={onShowSidebar}
              edge="start"
              color="inherit"
              size={isMobile ? "medium" : "large"}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Breadcrumb Section */}
          <Box sx={{ py: 1, px: 2, flexGrow: 1 }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="bold"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" } }}
            >
              {user ? `Welcome ${firstName}` : "Welcome"}
            </Typography>
          </Box>

          {/* Logout Button */}
          {user && (
            <Button
              color="error"
              variant="outlined"
              onClick={handleLogout}
              sx={{ ml: 2, minWidth: { xs: 32, sm: 80 } }}
            >
              {isMobile ? "Logout" : "Logout"}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Divider />
    </>
  );
};

export default Header;
