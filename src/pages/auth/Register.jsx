import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "COORDINATOR",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await registerUser(form);
      alert("User Registered Successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #1E3A8A 30%, #1f0441c5 90%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 5,
          width: 380,
          borderRadius: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          sx={{ fontWeight: 600, color: "#1E3A8A" }}
          mb={1}
        >
          Placement Management System
        </Typography>

        <Typography textAlign="center" mb={3} color="text.secondary">
          Create your account
        </Typography>

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          margin="normal"
          value={form.role}
          onChange={handleChange}
        >
          <MenuItem value="ADMIN">ADMIN</MenuItem>
          <MenuItem value="COORDINATOR">COORDINATOR</MenuItem>
        </TextField>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#1E3A8A",
            "&:hover": { backgroundColor: "#163172" },
          }}
          onClick={handleSubmit}
        >
          Register
        </Button>

        {/* Login Section */}
        <Typography textAlign="center" mt={3} fontSize={14}>
          Already have an account?
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            mt: 1,
            borderColor: "#1E3A8A",
            color: "#1E3A8A",
            "&:hover": {
              borderColor: "#163172",
              backgroundColor: "#f0f4ff",
            },
          }}
          onClick={() => navigate("/")}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Register;

