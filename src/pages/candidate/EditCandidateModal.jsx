import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Button,
  MenuItem,
} from "@mui/material";

const EditCandidateModal = ({
  open,
  onClose,
  interviewRounds,
  setInterviewRounds,
  status,
  setStatus,
  interviewDate,
  setInterviewDate,
  onSave,
  saving,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Edit Candidate
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={3}>
          <TextField
            select
            label="Interview Rounds"
            size="small"
            value={interviewRounds}
            onChange={(e) => setInterviewRounds(e.target.value)}
            fullWidth
          >
            <MenuItem value="shortlisted">shortlisted</MenuItem>
            <MenuItem value="Aptitude Round">Aptitude Round</MenuItem>
            <MenuItem value="HR Round">HR Round</MenuItem>
            <MenuItem value="Technical Round">Technical Round</MenuItem>
            <MenuItem value="Final Round">Final Round</MenuItem>
            <MenuItem value="Placed">Placed</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            size="small"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value="Active">ACTIVE</MenuItem>
            <MenuItem value="Selected">SELECTED</MenuItem>
            <MenuItem value="Rejected">REJECTED</MenuItem>
          </TextField>
          <TextField
            label="Interview Date"
            type="date"
            size="small"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={saving}
          sx={{ textTransform: "none" }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCandidateModal;
