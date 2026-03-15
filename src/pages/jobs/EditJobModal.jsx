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
} from "@mui/material";
import { updateJob } from "../../services/jobService";
import { getAllCompanyNames } from "../../services/companyService";
import { getContacts } from "../../services/contactService";

const toDateInputValue = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
};

const EditJobModal = ({ open, handleClose, jobData, refreshJob }) => {
  const [formData, setFormData] = useState({
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
    interviewDate: "",   // ✅ ADD
    remarks: "",         // ✅ ADD
  });
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const list = await getAllCompanyNames("");
        setCompanies(list);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    if (open) fetchCompanies();
  }, [open]);

  useEffect(() => {
    if (!open || !jobData) return;
    setFormData({
      companyId: jobData.companyId?._id || jobData.companyId || "",
      contactId: jobData.contactId?._id || jobData.contactId || "",
      role: jobData.role || "",
      jobDescription: jobData.jobDescription || "",
      requirements: jobData.requirements || "",
      experience: {
        min: jobData.experience?.min ?? "",
        max: jobData.experience?.max ?? "",
      },
      package: jobData.package ?? "",
      location: {
        city: jobData.location?.city || "",
        state: jobData.location?.state || "",
        country: jobData.location?.country || "",
      },
      openingDate: toDateInputValue(jobData.openingDate),
      expiryDate: toDateInputValue(jobData.expiryDate),
      interviewDate: toDateInputValue(jobData.interviewDate), // ✅ ADD
      remarks: jobData.remarks || "",
    });
  }, [open, jobData]);

  useEffect(() => {
    if (!open) return;
    const companyId = formData.companyId;
    if (!companyId) {
      setContacts([]);
      return;
    }
    setLoadingContacts(true);
    getContacts(1, "", companyId)
      .then((res) => {
        const list = res.data?.data ?? [];
        const filtered = list.filter(
          (c) => (c.companyId?._id || c.companyId) === companyId
        );
        setContacts(filtered.length > 0 ? filtered : list);
      })
      .catch(() => setContacts([]))
      .finally(() => setLoadingContacts(false));
  }, [open, formData.companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "companyId") {
      setFormData({ ...formData, companyId: value, contactId: "" });
      return;
    }
    if (["min", "max"].includes(name)) {
      setFormData({
        ...formData,
        experience: {
          ...formData.experience,
          [name]: value === "" ? "" : Number(value),
        },
      });
      return;
    }
    if (["city", "state", "country"].includes(name)) {
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value },
      });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!jobData?._id) return;
    try {
      const payload = {
        companyId: formData.companyId,
        contactId: formData.contactId,
        role: formData.role,
        jobDescription: formData.jobDescription,
        requirements: formData.requirements,
        experience: {
          min: Number(formData.experience.min) || 0,
          max: Number(formData.experience.max) || 0,
        },
        package: Number(formData.package) || 0,
        location: {
          city: formData.location.city,
          state: formData.location.state,
          country: formData.location.country,
        },
        openingDate: formData.openingDate,
        expiryDate: formData.expiryDate,
        interviewDate: formData.interviewDate, // ✅ ADD
        remarks: formData.remarks,
      };
      await updateJob(jobData._id, payload);
      handleClose();
      refreshJob();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  if (!jobData) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(225, 227, 233, 0.95), rgb(235, 237, 244))",
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
          color: "#060a13",
          pb: 1,
        }}
      >
        Edit Job Opening
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              SelectProps={{
                displayEmpty: true,
                renderValue: (v) => {
                  if (!v) return "Select company";
                  const c = companies.find((x) => x._id === v);
                  return c ? c.companyName : v;
                },
              }}
            >
              <MenuItem value="">
                <em>Select company</em>
              </MenuItem>
              {companies.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.companyName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Contact"
              name="contactId"
              value={formData.contactId}
              onChange={handleChange}
              disabled={!formData.companyId || loadingContacts}
              SelectProps={{
                displayEmpty: true,
                renderValue: (v) => {
                  if (!v) return formData.companyId ? "Select contact" : "Select company first";
                  const contact = contacts.find((x) => x._id === v);
                  return contact ? `${contact.name} (${contact.email})` : v;
                },
              }}
            >
              <MenuItem value="">
                <em>{formData.companyId ? "Select contact" : "Select company first"}</em>
              </MenuItem>
              {contacts.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name} — {c.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Job Description"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Experience (Min years)"
              name="min"
              value={formData.experience.min}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Experience (Max years)"
              name="max"
              value={formData.experience.max}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Package (LPA)"
              name="package"
              value={formData.package}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.5 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.location.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.location.state}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.location.country}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Opening Date"
              name="openingDate"
              value={formData.openingDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Expiry Date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Interview Date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
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
          onClick={handleSubmit}
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
          backgroundColor="#454b57"
          sx={{
            color: "#02050a",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditJobModal;
