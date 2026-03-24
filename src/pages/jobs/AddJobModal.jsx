import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { createJob } from "../../services/jobService";
import { getAllCompanyNames } from "../../services/companyService";
import { getContacts } from "../../services/contactService";
import { Autocomplete } from "@mui/material";

const initialFormState = {
  companyId: "",
  contactId: "",
  role: "",
  jobDescription: "",
  requirements: "",
  experience: { min: "", max: "" },
  package: "",
  location: { city: "", state: "", country: "" },
  openingDate: "",
  expiryDate: "",
  interviewDate: "",     // ← new
  remarks: "",
};

const AddJobModal = ({ open, handleClose, refreshJobs }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState(initialFormState);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchCompanies = async () => {
      try {
        const list = await getAllCompanyNames("");
        setCompanies(list || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, [open]);

  useEffect(() => {
    if (!open || !formData.companyId) {
      setContacts([]);
      return;
    }
    const fetchContactsForCompany = async () => {
      setLoadingContacts(true);
      try {
        const res = await getContacts(1, "", formData.companyId);
        setContacts(res.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setContacts([]);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContactsForCompany();
  }, [open, formData.companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "companyId") {
      setFormData((prev) => ({ ...prev, companyId: value, contactId: "" }));
      return;
    }
    if (name === "min" || name === "max") {
      setFormData((prev) => ({
        ...prev,
        experience: { ...prev.experience, [name]: value === "" ? "" : Number(value) },
      }));
      return;
    }
    if (name === "city" || name === "state" || name === "country") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        companyId: formData.companyId,
        contactId: formData.contactId,
        role: formData.role?.trim() || "",
        jobDescription: formData.jobDescription?.trim() || "",
        requirements: formData.requirements?.trim() || "",
        experience: {
          min: Number(formData.experience.min) || 0,
          max: Number(formData.experience.max) || 0,
        },
        package: Number(formData.package) || 0,
        location: formData.location,
        openingDate: formData.openingDate,
        expiryDate: formData.expiryDate,
        interviewDate: formData.interviewDate || null,   // ← new (can be empty)
        remarks: formData.remarks?.trim() || "",         // ← new
      };
      await createJob(payload);
      setFormData(initialFormState);
      handleClose();
      refreshJobs();
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 3 : 4,
          background: isMobile
            ? "linear-gradient(135deg, #f8fafc, #e2e8f0)"
            : "linear-gradient(135deg, rgba(225, 227, 233, 0.95), rgb(193, 197, 212))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 80px rgba(45, 61, 98, 0.9)",
          border: isMobile ? "none" : "1px solid rgba(121, 151, 194, 0.45)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: isMobile ? "text.primary" : "#050609",
          pb: 1,
          pt: isMobile ? 2 : 3,
        }}
      >
        Add Job Opening
      </DialogTitle>

      <DialogContent
        sx={{
          mt: 1.5,
          px: { xs: 3, sm: 5 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Grid container spacing={3}>
          {/* Company and Contact - Side by side */}
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              options={companies || []}
              getOptionLabel={(option) => option.companyName || ""}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={companies.find((c) => c._id === formData.companyId) || null}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  companyId: newValue ? newValue._id : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company"
                  placeholder="Select company"
                  fullWidth
                />
              )}
              sx={{
                width: { xs: 200, md: 450 },
                "& .MuiOutlinedInput-root": {
                  height: { xs: "auto", md: "56px" }
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Contact"
              placeholder="Select contact"
              name="contactId"
              value={formData.contactId}
              onChange={handleChange}
              disabled={!formData.companyId || loadingContacts}
              // SelectProps={{
              //   displayEmpty: true,
              //   renderValue: (v) =>
              //     !v
              //       ? formData.companyId
              //         ? ""
              //         : ""
              //       : contacts.find((x) => x._id === v)
              //         ? `${contacts.find((x) => x._id === v)?.name} (${contacts.find((x) => x._id === v)?.email})`
              //         : v,
              // }}
              sx={{
                width: { xs: 200, md: 210 },
                "& .MuiOutlinedInput-root": {
                  height: { xs: "auto", md: "56px" }
                }
              }}
            >
              <MenuItem value="">
                {/* <em>{formData.companyId ? "Select contact" : "Select company first"}</em> */}
              </MenuItem>
              {contacts.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name} — {c.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>



          {/* Role - Full width */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />
          </Grid>

          {/* Description - Full width */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 5 : 8}
              label="Description"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              sx={{
                mt: 0.5,
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  // Fixed height container → internal scroll appears when needed
                  height: { xs: 130, md: 110 },
                  width: { md: 460 },
                  alignItems: 'flex-start',
                  padding: 0,
                  overflow: 'hidden',
                },
                '& .MuiInputBase-inputMultiline': {
                  padding: { xs: '12px 14px', md: '14px 16px' },
                  height: '100%',
                  boxSizing: 'border-box',
                  lineHeight: 1.4,
                  overflow: 'auto',
                },
              }}
            />
          </Grid>

          {/* Requirements - Full width */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 3 : 4}
              label="Requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              sx={{
                mt: 0.5,
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  // Fixed height container → internal scroll appears when needed
                  height: { xs: 120, md: 100 },
                  width: { md: 460 },
                  alignItems: 'flex-start',
                  padding: 0,
                  overflow: 'hidden',
                },
                '& .MuiInputBase-inputMultiline': {
                  padding: { xs: '12px 14px', md: '12px 16px' },
                  height: '100%',
                  boxSizing: 'border-box',
                  lineHeight: 1.4,
                  overflow: 'auto',
                },
              }}
            />
          </Grid>

          {/* Min Exp and Max Exp - Side by side */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Min Exp"
              name="min"
              value={formData.experience.min}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Max Exp"
              name="max"
              value={formData.experience.max}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Package - Full width */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Package"
              name="package"
              value={formData.package}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.5 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.location.country}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.location.state}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.location.city}
              onChange={handleChange}
            />
          </Grid>



          {/* Opening Date and Closing Date - Side by side */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Opening Date"
              name="openingDate"
              value={formData.openingDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                width: { xs: 220, md: 220 },
                "& .MuiOutlinedInput-root": {
                  height: { xs: "auto", md: "3.5em" }
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Closing Date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                width: { xs: 220, md: 220 },
                "& .MuiOutlinedInput-root": {
                  height: { xs: "auto", md: "3.5em" }
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Interview Date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              helperText="Date when interview is scheduled (optional)"
              sx={{
                width: { xs: 220, md: 220 },
                "& .MuiOutlinedInput-root": {
                  height: { xs: "auto", md: "3.5em" }
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 3 : 4}
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any notes, status, follow-up actions..."
              helperText="Internal notes about this job opening"
              sx={{
                // mt: 1,
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  alignItems: 'flex-start',
                  padding: { xs: '12px 14px', md: '16px 18px' },
                  minHeight: { xs: 100, md: 120 },
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 4 },
          pb: { xs: 3, sm: 4 },
          pt: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: 2,
          justifyContent: { sm: "flex-end" },
        }}
      >
        <Button
          onClick={handleClose}
          fullWidth={isMobile}
          backgroundColor="#5b7ec5"
          sx={{ color: isMobile ? "text.primary" : "#04060c" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.companyId || !formData.role?.trim()}
          fullWidth={isMobile}
          sx={{
            backgroundColor: "#0932a0",
            borderRadius: 999,
            py: 1.4,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 8px 24px rgba(29, 78, 216, 0.35)",
            "&:hover": { backgroundColor: "#04123f" },
          }}
        >
          Create Job
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddJobModal;
