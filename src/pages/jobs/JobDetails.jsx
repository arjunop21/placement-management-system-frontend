import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import { getJobById } from "../../services/jobService";
import EditJobModal from "./EditJobModal";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);

  const fetchJob = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getJobById(id);
      setJob(res.data.data);
    } catch (error) {
      console.error("Error fetching job:", error);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: { xs: 6, md: 10 } }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!job) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 5, textAlign: "center" }}>
        Job not found
      </Typography>
    );
  }

  const isExpired = String(job.status || "").toUpperCase() === "EXPIRED";
  const showEditButton = !isExpired;

  const normalizedStatus = String(job.status || "").toUpperCase();
  const statusColor =
    normalizedStatus === "ACTIVE" ? "success" :
    normalizedStatus === "EXPIRED" ? "default" : "error";

  const requirementsItems = (job.requirements ?? "")
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Back button */}
      <Button
        variant="text"
        startIcon="←"
        onClick={() => navigate("/jobs")}
        sx={{
          alignSelf: "flex-start",
          mb: { xs: 2, md: 3 },
          color: "text.primary",
          fontWeight: 500,
          textTransform: "none",
        }}
      >
        Back to Jobs
      </Button>

      <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: 720, lg: 860 } }}>

        <Box
          sx={{
            borderRadius: { xs: 3, md: 4 },
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: { xs: 2, md: "0 10px 40px rgba(0,0,0,0.12)" },
            bgcolor: "background.paper",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: { xs: 2.5, md: 4 },
              py: { xs: 2.5, md: 3.5 },
              background: "linear-gradient(135deg, #0B2D7A 0%, #1E3A8A 55%, #123A7C 100%)",
              color: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "flex-start" },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight={700}
                  sx={{ mb: 0.5, lineHeight: 1.2 }}
                >
                  {job.role}
                </Typography>

                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {job.companyId?.companyName || "—"}
                </Typography>

                <Chip
                  label={job.status || "—"}
                  color={statusColor}
                  size="small"
                  sx={{ mt: 1.5, fontWeight: 600 }}
                />
              </Box>

              {showEditButton && (
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => setOpenEdit(true)}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255,255,255,0.5)",
                    bgcolor: "rgba(255,255,255,0.08)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.16)",
                      borderColor: "rgba(255,255,255,0.7)",
                    },
                    whiteSpace: "nowrap",
                    minWidth: { xs: "auto", sm: 120 },
                  }}
                >
                  Edit Job
                </Button>
              )}
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Grid container spacing={2.5}>
              {[
                { label: "Company",     value: job.companyId?.companyName || "—" },
                { label: "Status",      value: job.status || "—" },
                { label: "Package (LPA)", value: job.package ?? "—" },
                {
                  label: "Experience",
                  value:
                    job.experience?.min != null && job.experience?.max != null
                      ? `${job.experience.min} – ${job.experience.max} years`
                      : "—",
                },
                { label: "Opening Date", value: formatDate(job.openingDate) },
                { label: "Expiry Date",  value: formatDate(job.expiryDate) },
                {
                  label: "Location",
                  value:
                    [job.location?.city, job.location?.state, job.location?.country]
                      .filter(Boolean)
                      .join(", ") || "—",
                },
              ].map((item) => (
                <Grid item key={item.label} xs={12} sm={6} md={4}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    gutterBottom
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {item.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* Requirements */}
            <Box sx={{ mt: { xs: 3.5, md: 4.5 } }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Requirements
              </Typography>
              {requirementsItems.length > 0 ? (
                <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                  {requirementsItems.map((text, i) => (
                    <Box component="li" key={i} sx={{ mb: 1 }}>
                      <Typography variant="body1" color="text.primary">
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">—</Typography>
              )}
            </Box>

            {/* Job Description */}
            <Box sx={{ mt: { xs: 3.5, md: 4.5 } }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Job Description
              </Typography>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
              >
                {job.jobDescription || "—"}
              </Typography>
            </Box>

            {/* Contact Bar */}
            <Box
              sx={{
                mt: { xs: 4, md: 5 },
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                background: "linear-gradient(135deg, #0B2D7A 0%, #1E3A8A 100%)",
                color: "white",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Contact Details
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.92, mt: 0.5 }}>
                  {job.contactId?.email || "—"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.92 }}>
                  {job.contactId?.phone || "—"}
                </Typography>
              </Box>

              <IconButton
                component="a"
                href={job.contactId?.phone ? `tel:${job.contactId.phone}` : undefined}
                disabled={!job.contactId?.phone}
                sx={{
                  bgcolor: "rgba(255,255,255,0.14)",
                  color: "white",
                  width: 48,
                  height: 48,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                  "&.Mui-disabled": {
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.4)",
                  },
                }}
              >
                <PhoneInTalkIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <EditJobModal
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        jobData={job}
        refreshJob={fetchJob}
      />
    </Box>
  );
};

export default JobDetails;