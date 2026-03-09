import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Topbar from "../layout/Topbar";

const StatCard = ({ title, value, color }) => (
  <Card
    sx={{
      borderTop: `4px solid ${color}`,
      boxShadow: 3,
      height: "100%",
    }}
  >
    <CardContent>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ fontSize: { xs: "12px", sm: "14px" } }}
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ fontSize: { xs: "22px", sm: "28px" } }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const stats = {
    totalCompanies: 32,
    totalContacts: 120,
    activeJobs: 15,
    expiredJobs: 4,
  };

  const recentJobs = [
    { title: "Software Developer", company: "TCS", status: "Active" },
    { title: "UI/UX Designer", company: "Infosys", status: "Expired" },
    { title: "Backend Engineer", company: "Wipro", status: "Active" },
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      {/* <Topbar /> */}

      {/* Stats Section */}
      <Grid container spacing={2} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Companies"
            value={stats.totalCompanies}
            color="#1FB6B9"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            color="#3B82F6"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            color="#10B981"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expired Jobs"
            value={stats.expiredJobs}
            color="#9CA3AF"
          />
        </Grid>
      </Grid>

      {/* Recent Jobs Table */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontSize: { xs: "16px", sm: "20px" },
          }}
        >
          Recent Job Openings
        </Typography>

        {/* Important: TableContainer for mobile scroll */}
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recentJobs.map((job, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {job.title}
                  </TableCell>

                  <TableCell>{job.company}</TableCell>

                  <TableCell
                    sx={{
                      color:
                        job.status === "Active"
                          ? "#10B981"
                          : "#9CA3AF",
                      fontWeight: "bold",
                    }}
                  >
                    {job.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;