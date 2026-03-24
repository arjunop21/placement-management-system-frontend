import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getCandidateHistory } from "../../services/candidateService";
import { getJobById } from "../../services/jobService";

const getOrdinalSuffix = (day) => {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  const mod10 = day % 10;
  if (mod10 === 1) return "st";
  if (mod10 === 2) return "nd";
  if (mod10 === 3) return "rd";
  return "th";
};

const formatDayMonth = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  const day = d.getDate();
  const month = d.toLocaleDateString("en-IN", { month: "long" });
  return `${day}${getOrdinalSuffix(day)} ${month}`;
};

const getStatusColor = (status) => {
  if (!status) return "default";
  const normalized = String(status).toUpperCase();
  if (normalized === "ACTIVE") return "success";
  if (normalized === "SELECTED") return "info";
  if (normalized === "REJECTED" || normalized === "CLOSED") return "error";
  return "default";
};

const getHistorySentence = (item) => {
  if (!item) return "-";
  if (typeof item === "string") return item;

  const label =
    item.interviewRounds ||
    item.roundName ||
    item.round ||
    item.stage ||
    item.title ||
    item.name ||
    item.event ||
    "Update";

  const statusRaw = item.status || item.currentStatus || item.state || "active";
  const status = String(statusRaw).toLowerCase();

  const date = item.interviewDate || item.date || item.on || item.updatedAt || item.createdAt || "";

  if (date) {
    return `${label} on ${formatDayMonth(date)} - ${status}`;
  }
  return `${label} - ${status}`;
};

const getSortableDate = (item) => {
  const date = item?.interviewDate || item?.date || item?.updatedAt || item?.createdAt || "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 0;
  return d.getTime();
};

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [job, setJob] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await getCandidateHistory(id);
        const data = res?.data?.data ?? res?.data ?? [];
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.history)
            ? data.history
            : [];
        setHistory(list);
      } catch (error) {
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  useEffect(() => {
    const jobId = history?.[0]?.jobOpeningId || "";
    if (!jobId) return;

    const fetchJob = async () => {
      setJobLoading(true);
      try {
        const res = await getJobById(jobId);
        setJob(res?.data?.data ?? null);
      } catch (error) {
        setJob(null);
      } finally {
        setJobLoading(false);
      }
    };

    fetchJob();
  }, [history]);

  const orderedHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    return [...history].sort((a, b) => getSortableDate(a) - getSortableDate(b));
  }, [history]);

  const latestHistory = orderedHistory.length > 0 ? orderedHistory[orderedHistory.length - 1] : null;

  const candidateName = latestHistory?.candidateName || "-";
  const roleLabel = job?.role || "-";
  const companyLabel = job?.companyId?.companyName || "-";
  const statusLabel = latestHistory?.status || "-";

  if (historyLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: { xs: 6, md: 10 } }}>
        <CircularProgress />
      </Box>
    );
  }

  if (orderedHistory.length === 0) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 5, textAlign: "center" }}>
        Candidate history not found
      </Typography>
    );
  }

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
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/candidates")}
        sx={{
          alignSelf: "flex-start",
          mb: { xs: 2, md: 3 },
          color: "text.primary",
          fontWeight: 500,
          textTransform: "none",
        }}
      >
        Back to Candidates
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
          <Box
            sx={{
              px: { xs: 2.5, md: 4 },
              py: { xs: 2.5, md: 3.5 },
              background:
                "linear-gradient(135deg, #0B2D7A 0%, #1E3A8A 55%, #123A7C 100%)",
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
                  {candidateName}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {jobLoading ? "Loading role..." : roleLabel}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {jobLoading ? "Loading company..." : companyLabel}
                </Typography>
              </Box>

              <Chip
                label={statusLabel}
                color={getStatusColor(statusLabel)}
                size="small"
                sx={{ mt: { xs: 0.5, sm: 0 }, fontWeight: 600 }}
              />
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Grid container spacing={2.5}>
              {[
                { label: "Candidate Name", value: candidateName },
                { label: "Job Role", value: jobLoading ? "Loading..." : roleLabel },
                { label: "Company Name", value: jobLoading ? "Loading..." : companyLabel },
                { label: "Current Status", value: statusLabel },
                // { label: "Job Role", value: "-" },
              ].map((item) => (
                <Grid item key={item.label} xs={12} sm={6} md={4}>
                  <Typography
                    color="#123A7C"
                    fontWeight={600}
                    sx={{ fontSize: "0.9rem", mb: 0.5, display: "block" }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ fontSize: "1.05rem" }}>
                    {item.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: { xs: 3, md: 4 } }} />

            <Typography variant="subtitle1" fontWeight={600} color="#123A7C" gutterBottom>
              History
            </Typography>
            {orderedHistory.length === 0 ? (
              <Typography color="text.secondary">No history yet.</Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {orderedHistory.map((item, index) => (
                  <Box
                    key={`${index}-${typeof item === "string" ? item : item?._id ?? "item"}`}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#F3F6FF",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body1">{getHistorySentence(item)}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CandidateDetails;
