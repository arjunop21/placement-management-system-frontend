import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Button,
  Typography,
  IconButton,
  Box,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddModalCandidate = ({
  open,
  onClose,
  candidateName,
  setCandidateName,
  candidateNames,
  onAddCandidateName,
  interviewRounds,
  setInterviewRounds,
  onSave,
  saving,
  error,
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
      <DialogTitle sx={{ fontWeight: 700 }}>Add Candidate</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
              Candidate Name
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Enter candidate name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
              <IconButton
                color="primary"
                onClick={onAddCandidateName}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              {candidateNames.length > 0
                ? candidateNames.join(", ")
                : "No candidates added yet."}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
              Interview Rounds
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={interviewRounds}
              onChange={(e) => setInterviewRounds(e.target.value)}
            >
              <MenuItem value="shortlisted">shortlisted</MenuItem>
              <MenuItem value="Aptitude Round">Aptitude Round</MenuItem>
              <MenuItem value="HR Round">HR Round</MenuItem>
              <MenuItem value="Technical Round">Technical Round</MenuItem>
              <MenuItem value="Final Round">Final Round</MenuItem>
              <MenuItem value="Placed">Placed</MenuItem>
            </TextField>
          </Box>

          {error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : null}
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

export default AddModalCandidate;
