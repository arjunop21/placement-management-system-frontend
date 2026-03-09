import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import ContactsIcon from "@mui/icons-material/Contacts";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Companies", icon: <BusinessIcon />, path: "/Companies" },
    { text: "Contacts", icon: <ContactsIcon />, path: "/contacts" },
    { text: "Jobs", icon: <WorkIcon />, path: "/jobs" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: "100%",
        background: "linear-gradient(180deg, #1E3A5F, #0F2D40)",
        color: "#fff",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Admin
        </Typography>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (onNavigate) onNavigate();
            }}
          >
            <ListItemIcon sx={{ color: "#6FE7E7" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}

        <ListItemButton
          onClick={() => {
            handleLogout();
            if (onNavigate) onNavigate();
          }}
        >
          <ListItemIcon sx={{ color: "#FF6B6B" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;