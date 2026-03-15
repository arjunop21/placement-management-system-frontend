import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  MenuItem,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { getJobs, deleteJob } from "../../services/jobService";
import { getAllCompanyNames } from "../../services/companyService";
import AddJobModal from "./AddJobModal";

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [status, setStatus] = useState("");
  const [interviewDate, setInterviewDate] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // or "sm" if you prefer earlier switch

  const fetchJobs = async () => {
    try {
      const res = await getJobs({
        page,
        limit: 5,
        keyword,
        companyId: companyId || undefined,
        status: status || undefined,
        interviewDate: interviewDate || undefined,
      });
      setJobs(res.data.data);
      setPages(res.data.pages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, keyword, companyId, status, interviewDate]); // ✅ ADD interviewDate

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

  const handleDelete = async () => {
    try {
      await deleteJob(deleteId);
      setDeleteId(null);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const renderStatusChip = (status) => {
    if (!status) return "-";
    const normalized = String(status).toUpperCase();
    let color = "default";
    if (normalized === "ACTIVE") color = "success";
    else if (normalized === "EXPIRED") color = "default";
    else if (normalized === "CLOSED") color = "error";

    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Filters + Add Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          placeholder="Search by role..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          fullWidth={isMobile}
          sx={{ flex: { sm: 1 }, maxWidth: { sm: 300 } }}
        />

        <TextField
          select
          size="small"
          value={companyId}
          onChange={(e) => {
            setCompanyId(e.target.value);
            setPage(1);
          }}
          fullWidth={isMobile}
          SelectProps={{
            displayEmpty: true,
            renderValue: (selected) => {
              if (!selected) return <em>All Companies</em>;
              const c = companies.find((x) => x._id === selected);
              return c ? c.companyName : selected;
            },
          }}
          sx={{ minWidth: { sm: 220 }, flex: { sm: 1 } }}
        >
          <MenuItem value="">
            <em>All Companies</em>
          </MenuItem>
          {companies.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.companyName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          fullWidth={isMobile}
          SelectProps={{
            displayEmpty: true,
            renderValue: (selected) => {
              if (!selected) return <em>All Status</em>;
              return selected;
            },
          }}
          sx={{ minWidth: { sm: 160 }, flex: { sm: 1 } }}
        >
          <MenuItem value="">
            <em>All Status</em>
          </MenuItem>
          <MenuItem value="ACTIVE">ACTIVE</MenuItem>
          <MenuItem value="EXPIRED">EXPIRED</MenuItem>
          <MenuItem value="CLOSED">CLOSED</MenuItem>
        </TextField>

        <TextField
          type="date"
          size="small"
          value={interviewDate}
          onChange={(e) => {
            setInterviewDate(e.target.value);
            setPage(1);
          }}
          fullWidth={isMobile}
          sx={{ minWidth: { sm: 180 }, flex: { sm: 1 } }}
        />

        <Button
          variant="contained"
          fullWidth={isMobile}
          sx={{
            backgroundColor: "#1E3A8A",
            "&:hover": { backgroundColor: "#163172" },
            minWidth: { sm: 140 },
          }}
          onClick={() => setOpenAdd(true)}
        >
          Add Job
        </Button>
      </Box>

      {/* Content: Table on desktop, Cards on mobile */}
      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {jobs.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              No jobs found
            </Typography>
          ) : (
            jobs.map((job) => (
              <Card
                key={job._id}
                elevation={2}
                sx={{
                  borderRadius: 2,
                  transition: "0.2s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardContent sx={{ pb: 2 }}>
                    <Button
                      variant="text"
                      onClick={() => navigate(`/candidates?jobId=${encodeURIComponent(job._id)}`)}
                      sx={{
                        p: 0,
                        minWidth: 0,
                        textTransform: "none",
                        justifyContent: "flex-start",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {job.role}
                    </Typography>
                  </Button>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Company:</strong> {job.companyId?.companyName || "—"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Email:</strong> {job.contactId?.email || "—"}
                  </Typography>

                  <Box mt={1} mb={2}>
                    <strong>Status:</strong> {renderStatusChip(job.status)}
                  </Box>

                  <Box display="flex" gap={1.5} mt={2}>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      onClick={() => navigate(`/jobs/${job._id}`)}

                      // onClick={() =>
                      //   navigate(`/jobs/${job._id}`)
                      // }
                    >
                      View
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      fullWidth
                      onClick={() => setDeleteId(job._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1E3A8A" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Interview Date</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {jobs.map((job) => (
                <TableRow
                  key={job._id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigate(`/candidates?jobId=${encodeURIComponent(job._id)}`)}
                      sx={{ textTransform: "none", px: 0, minWidth: 0 }}
                    >
                      {job.role}
                    </Button>
                  </TableCell>
                  <TableCell>{job.companyId?.companyName || "—"}</TableCell>
                  <TableCell>{job.contactId?.email || "—"}</TableCell>
                  <TableCell>
                    {job.interviewDate
                      ? new Date(job.interviewDate).toLocaleDateString("en-IN")
                      : "—"}
                  </TableCell>
                  <TableCell>{renderStatusChip(job.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ mr: 1, minWidth: 80 }}
                      onClick={() => (window.location.href = `/jobs/${job._id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => setDeleteId(job._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No jobs found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <Box
        mt={3}
        display="flex"
        justifyContent="center"
        sx={{
          "& .MuiPagination-ul": {
            flexWrap: "wrap",
            justifyContent: "center",
          },
        }}
      >
        <Pagination
          count={pages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Add Job Modal */}
      <AddJobModal
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        refreshJobs={fetchJobs}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this job opening?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Jobs;
