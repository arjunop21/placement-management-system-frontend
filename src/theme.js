import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1FB6B9" },
    secondary: { main: "#1E3A5F" },
    background: { default: "#F4F7FA" },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;