import { useState } from "react";
import { Outlet } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "./Header";
import Sidebar from "./SideBar";

const AppWrapper = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  
  // Determine variant based on screen size
  const variant = isMdUp ? "sidebar" : "drawer";
  const showNavigationButton = !isMdUp;
  
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <RequireAuth>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar
          CloseAfterSelect={toggleSidebar}
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          variant={variant}
        />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          height: '100%', 
          overflow: 'auto' 
        }}>
          <Header
            showSidebarButton={showNavigationButton}
            onShowSidebar={toggleSidebar}
          />
          <Box sx={{ p: 2, flex: '1 1 0', overflow: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </RequireAuth>
  );
};

export default AppWrapper;
