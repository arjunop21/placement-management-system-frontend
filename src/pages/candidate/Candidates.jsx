import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getAllCandidates, getCandidates, updateCandidate } from "../../services/candidateService";
import EditCandidateModal from "./EditCandidateModal";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCandidateName = (candidate) => {
  if (!candidate) return "—";
  if (candidate.studentName) return candidate.studentName;
  if (candidate.name) return candidate.name;
  if (candidate.candidateName) return candidate.candidateName;
  if (candidate.fullName) return candidate.fullName;
  if (Array.isArray(candidate.candidateNames) && candidate.candidateNames.length > 0) {
    return candidate.candidateNames.join(", ");
  }
  return "—";
};

const getRoleLabel = (candidate) => {
  return (
    candidate?.jobRole ||
    candidate?.role ||
    candidate?.jobOpeningId?.role ||  //
    candidate?.jobId?.role ||
    candidate?.job?.role ||
    "—"
  );
};

const getCompanyLabel = (candidate) => {
  return (
    candidate?.companyName ||
    candidate?.companyId?.companyName ||
    candidate?.company?.companyName ||
    "—"
  );
};

const renderStatusChip = (status) => {
  if (!status) return "—";
  const normalized = String(status).toUpperCase();
  let color = "default";
  if (normalized === "ACTIVE") color = "success";
  else if (normalized === "SELECTED") color = "info";
  else if (normalized === "REJECTED" || normalized === "CLOSED") color = "error";

  return <Chip label={status} color={color} size="small" />;
};

const Candidates = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobIdFilter, setJobIdFilter] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, msg: "" });

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editRounds, setEditRounds] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDate, setEditDate] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await getCandidates({
        page,
        limit: 5,
        keyword: search || undefined,
        role: roleFilter || undefined,
        companyName: companyFilter || undefined,
      });
      setCandidates(res?.data?.data ?? []);
      setPages(res?.data?.pages ?? 1);
    } catch (error) {
      setCandidates([]);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page, search, roleFilter, companyFilter]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const all = await getAllCandidates({ limit: 50 });
        setAllCandidates(all);
      } catch (error) {
        setAllCandidates([]);
      }
    };
    fetchAll();
  }, []);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");
    const jobId = params.get("jobId");
    if (jobId) {
      setJobIdFilter(jobId);
    } else {
      setJobIdFilter("");
    }
    if (role) {
      setRoleFilter(role);
    }
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    if (loading) return;
    if (!roleFilter && !jobIdFilter) return;
    const count = candidates.filter((c) => {
      const matchesRole = roleFilter ? getRoleLabel(c) === roleFilter : true;
      const cid = c?.jobOpeningId?._id ?? c?.jobId?._id ?? c?.job?._id ?? c?.jobId;
      const matchesJobId = jobIdFilter ? cid === jobIdFilter : true;
      return matchesRole && matchesJobId;
    }).length;
    if (count === 0) {
      setSnackbar({ open: true, msg: "no one apply for this job" });
    }
  }, [loading, roleFilter, jobIdFilter, candidates]);

  const handleRoleClick = (role) => {
    if (!role || role === "—") return;
    setRoleFilter(role);
    setSearch("");
    setCompanyFilter("");
    setJobIdFilter("");
    setPage(1);
    navigate(`/candidates?role=${encodeURIComponent(role)}`);
  };

  const roles = useMemo(() => {
    const set = new Set();
    allCandidates.forEach((c) => {
      const role = getRoleLabel(c);
      if (role && role !== "—") set.add(role);
    });
    return Array.from(set);
  }, [allCandidates]);

  const companies = useMemo(() => {
    const set = new Set();
    allCandidates.forEach((c) => {
      const company = getCompanyLabel(c);
      if (company && company !== "—") set.add(company);
    });
    return Array.from(set);
  }, [allCandidates]);

  const filteredCandidates = useMemo(() => {
    if (!jobIdFilter) return candidates;
    return candidates.filter((c) => {
      const cid = c?.jobOpeningId?._id ?? c?.jobId?._id ?? c?.job?._id ?? c?.jobId;
      return cid === jobIdFilter;
    });
  }, [candidates, jobIdFilter]);

  const handleOpenEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setEditRounds(candidate?.interviewRounds ?? "");
    setEditStatus(candidate?.status ?? "");
    const rawDate = candidate?.interviewDate ? new Date(candidate.interviewDate) : null;
    const formattedDate = rawDate
      ? rawDate.toISOString().slice(0, 10)
      : "";
    setEditDate(formattedDate);
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCandidate) return;
    const id = selectedCandidate?._id ?? selectedCandidate?.id;
    if (!id) return;

    setSaving(true);
    try {
      const payload = {
        interviewRounds: editRounds,
        status: editStatus,
        interviewDate: editDate,
      };
      const res = await updateCandidate(id, payload);
      const updated = res?.data?.data ?? null;

      setCandidates((prev) =>
        prev.map((c) => {
          const cid = c?._id ?? c?.id;
          if (cid !== id) return c;
          return updated || { ...c, ...payload };
        })
      );
      setOpenEdit(false);
      setSelectedCandidate(null);
    } catch (error) {
      // keep modal open on error
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Candidates
      </Typography>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: "transparent", boxShadow: "none" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            size="small"
            label="Search Candidate"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{
              minWidth: 220,
              backgroundColor: "#F3F6FF",
              borderRadius: 1,
            }}
          />
          <TextField
            select
            size="small"
            label="Filter by Role"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            sx={{
              minWidth: 200,
              backgroundColor: "#F3F6FF",
              borderRadius: 1,
            }}
          >
            <MenuItem value="">All Roles</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Filter by Company"
            value={companyFilter}
            onChange={(e) => {
              setCompanyFilter(e.target.value);
              setPage(1);
            }}
            sx={{
              minWidth: 200,
              backgroundColor: "#F3F6FF",
              borderRadius: 1,
            }}
          >
            <MenuItem value="">All Companies</MenuItem>
            {companies.map((company) => (
              <MenuItem key={company} value={company}>
                {company}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1E3A8A" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Job Role</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Interview Rounds</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Interview Date</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }} align="right">
                  Edit
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : filteredCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No candidates found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCandidates.map((candidate) => {
                  const jobStatus = candidate?.job?.status || "";
                  const isExpired = String(jobStatus).toUpperCase() === "EXPIRED";
                  const roleLabel = getRoleLabel(candidate);
                  const statusLabel = isExpired ? "CLOSED" : candidate?.status;

                  return (
                    <TableRow
                      key={candidate?._id ?? candidate?.id}
                      sx={
                        isExpired
                          ? {
                              bgcolor: "#c6cdd7d4",
                              color: "text.secondary",
                              "& td": { color: "text.secondary" },
                            }
                          : undefined
                      }
                    >
                    <TableCell>
  <Button
    variant="text"
    size="small"
    onClick={() => {
      const cid = candidate?._id ?? candidate?.id;
      if (cid) navigate(`/candidates/${cid}`);
    }}
    sx={{ textTransform: "none", px: 0, minWidth: 0 }}
  >
    {getCandidateName(candidate)}
  </Button>
</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleRoleClick(roleLabel)}
                        sx={{ textTransform: "none", px: 0, minWidth: 0 }}
                      >
                        {roleLabel}
                        {isExpired ? " (expired)" : ""}
                      </Button>
                    </TableCell>
                    <TableCell>{getCompanyLabel(candidate)}</TableCell>
                    <TableCell>{candidate?.interviewRounds ?? "—"}</TableCell>
                    <TableCell>{formatDate(candidate?.interviewDate)}</TableCell>
                    <TableCell>{renderStatusChip(statusLabel)}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEdit(candidate)}
                        sx={{ textTransform: "none" }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
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
      <EditCandidateModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        interviewRounds={editRounds}
        setInterviewRounds={setEditRounds}
        status={editStatus}
        setStatus={setEditStatus}
        interviewDate={editDate}
        setInterviewDate={setEditDate}
        onSave={handleSaveEdit}
        saving={saving}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, msg: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="info" onClose={() => setSnackbar({ open: false, msg: "" })}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Candidates;
































