import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllCompanyNames } from "../../services/companyService";
import { updateContact } from "../../services/contactService";

const EditContactModal = ({ open, handleClose, refresh, data }) => {
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    phone: "",
    companyId: "",
    isPrimary: false,
  });

  /* ===============================
     FETCH COMPANIES
  =============================== */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const list = await getAllCompanyNames("");
        setCompanies(list);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  /* ===============================
     PREFILL FORM
  =============================== */
  useEffect(() => {
    if (!open) return;

    const companyId = data?.companyId?._id ?? data?.companyId ?? "";

    setFormData({
      name: data?.name ?? "",
      designation: data?.designation ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      companyId,
      isPrimary: Boolean(data?.isPrimary),
    });
    setErrors({ email: "", phone: "" });
  }, [open, data]);

  const validate = (d) => {
    const nextErrors = { email: "", phone: "" };

    const email = (d.email ?? "").trim();
    const phone = (d.phone ?? "").trim();

    if (!email) {
      nextErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email";
    }

    if (!phone) {
      nextErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone))
        nextErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.phone;
  };

  /* ===============================
     UPDATE CONTACT
  =============================== */
  const handleUpdate = async () => {
    if (!validate(formData)) return;
    if (!data?._id) return;

    try {
      await updateContact(data._id, formData);
      refresh();
      handleClose();
      setErrors({ email: "", phone: "" });
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(225, 227, 233, 0.95), rgb(235, 237, 244))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 80px rgba(45, 61, 98, 0.9)",
          border: "1px solid rgba(121, 151, 194, 0.45)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#103278",
          pb: 1,
        }}
      >
        Edit Contact
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              size="medium"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Grid>

          {/* Designation */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Designation"
              size="medium"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              size="medium"
              value={formData.email}
              error={Boolean(errors.email)}
              helperText={errors.email}
              onChange={(e) => {
                const next = { ...formData, email: e.target.value };
                setFormData(next);
                if (errors.email) validate(next);
              }}
              onBlur={() => validate(formData)}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              size="medium"
              value={formData.phone}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 10 }}
              onChange={(e) => {
                const digitsOnly = e.target.value
                  .replace(/[^\d]/g, "")
                  .slice(0, 10);
                const next = { ...formData, phone: digitsOnly };
                setFormData(next);
                if (errors.phone) validate(next);
              }}
              onBlur={() => validate(formData)}
            />
          </Grid>

          {/* Company */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label=""
              value={formData.companyId || ""}
              onChange={(e) =>
                setFormData({ ...formData, companyId: e.target.value })
              }
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) return <em>Select a company</em>;
                  const comp = companies.find((c) => c._id === selected);
                  return comp ? comp.companyName : selected;
                },
              }}
            >
              {companies.map((company) => (
                <MenuItem size="large" key={company._id} value={company._id}>
                  {company.companyName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Primary */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isPrimary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isPrimary: e.target.checked,
                    })
                  }
                />
              }
              label="Primary Contact"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          flexDirection: "column",
          alignItems: "stretch",
          gap: 1.5,
        }}
      >
        <Button
          variant="contained"
          onClick={handleUpdate}
          sx={{
            backgroundColor: "#1D4ED8",
            borderRadius: 999,
            py: 1.2,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 12px 30px rgba(37,99,235,0.7)",
            "&:hover": { backgroundColor: "#1E40AF" },
          }}
        >
          Update →
        </Button>

        <Button
          onClick={handleClose}
          sx={{
            color: "#071125",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditContactModal;

