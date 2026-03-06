import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { updateCompany } from "../../services/companyService";

const EditCompanyModal = ({
  open,
  handleClose,
  companyData,
  refreshCompany,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState(companyData);

  useEffect(() => {
    if (companyData) {
      setFormData(companyData);
    }
  }, [companyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["street", "city", "state", "country", "pincode"].includes(name)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      await updateCompany(formData._id, formData);
      refreshCompany();
      handleClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!formData) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 4 },
          p: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
        Edit Company
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Company Name" name="companyName"
              value={formData.companyName || ""} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Industry" name="industry"
              value={formData.industry || ""} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Website" name="website"
              value={formData.website || ""} onChange={handleChange} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="About Company"
              name="aboutCompany"
              value={formData.aboutCompany || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Address */}
          {["street", "city", "state", "country", "pincode"].map((field) => (
            <Grid key={field} item xs={12} md={6}>
              <TextField
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={formData.address?.[field] || ""}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          p: 2,
        }}
      >
        <Button
          fullWidth={fullScreen}
          variant="contained"
          onClick={handleUpdate}
        >
          Update
        </Button>

        <Button
          fullWidth={fullScreen}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCompanyModal;