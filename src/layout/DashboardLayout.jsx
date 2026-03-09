import { Box, Drawer, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLocation } from "react-router-dom";

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);


  const getPageDetails = () => {
    switch (location.pathname.toLowerCase()) {
      case "/dashboard":
        return {
          title: "Welcome back 👋",
          subtitle: "Here’s what’s happening in your placement system today.",
        };

      case "/companies":
        return {
          title: "Companies",
          subtitle: "Manage all registered companies.",
        };

        case "/companies/:id":
        return {
          title: "Companies",
          subtitle: "Manage all registered companies.",
        };

      case "/jobs":
        return {
          title: "Jobs",
          subtitle: "Track active and expired jobs.",
        };
        case "/jobs/:id":
        return {
          title: "Jobs",
          subtitle: "Track active and expired jobs.",
        };

      case "/contacts":
        return {
          title: "Contacts",
          subtitle: "Manage Companie's contacts.",
        };

      default:
        return {
          title: "Main Menu",
          subtitle: "",
        };
    }
  };
  const { title, subtitle } = getPageDetails();


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ p: { xs: 0, md: 0 } }}>

      {/* Temporary Drawer for ALL pages */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        <Sidebar
          onNavigate={() => setMobileOpen(false)}
        />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          backgroundColor: "#d2e2f1",
          minHeight: "100vh",
        }}
      >
        <Topbar
          onMenuClick={handleDrawerToggle}
          title={title}
          subtitle={subtitle}
        />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;