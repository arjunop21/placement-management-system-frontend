import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

const Topbar = ({ onMenuClick, title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #1E3A5F, #1FB6B9)",
        color: "#fff",
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left Side */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={onMenuClick} sx={{ color: "#fff" }}>
          <MenuIcon />
        </IconButton>

        <Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>

          <Typography variant="body2">
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;