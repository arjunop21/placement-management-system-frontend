import { useEffect, useState } from "react";
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
} from "@mui/material";
import { useTheme, useMediaQuery, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  getCompanies,
  deleteCompany,
  createCompany,
} from "../../services/companyService";
import AddCompanyModal from "./AddCompanyModal";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // const [newCompany, setNewCompany] = useState({
  //   companyName: "",
  //   industry: "",
  //   website: "",
  // });

  const fetchCompanies = async () => {
    try {
      const { data } = await getCompanies(page, keyword);
      setCompanies(data.data);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, keyword]);

  const handleDelete = async () => {
    await deleteCompany(deleteId);
    setDeleteId(null);
    fetchCompanies();
  };


  const renderWebsiteLink = (url) => {
    if (!url) return "-";
    const trimmed = url.trim();
    const href =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1D4ED8", textDecoration: "none", fontWeight: 500 }}
      >
        {trimmed}
      </a>
    );
  };

  return (
    <Box sx={{ p: 4 }}>

      {/* Search + Add */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 3,
        }}
      >
        <TextField
          size="small"
          fullWidth={isMobile}
          placeholder="Search Company..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1E3A8A",
            "&:hover": { backgroundColor: "#163172" },
          }}
          onClick={() => setOpenAdd(true)}
        >
          Add Company
        </Button>
      </Box>

      {/* Table */}
      {isMobile ? (
        <Box>
          {companies.map((company) => (
            <Card
              key={company._id}
              sx={{
                mb: 2,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {company.companyName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {company.industry}
                </Typography>

                <Box mt={1}>
                  {renderWebsiteLink(company.website)}
                </Box>

                <Box mt={2} display="flex" gap={1}>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() =>
                      (window.location.href = `/companies/${company._id}`)
                    }
                  >
                    View
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    fullWidth
                    onClick={() => setDeleteId(company._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1E3A8A" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Company Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Industry</TableCell>
                <TableCell sx={{ color: "#fff" }}>Website</TableCell>
                <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {companies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>{company.companyName}</TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>
                    {renderWebsiteLink(company.website)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ mr: 1 }}
                      onClick={() =>
                        navigate(`/companies/${company._id}`)
                      }
                    >
                      View
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => setDeleteId(company._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this company?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Company Modal */}
      <AddCompanyModal
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        refreshCompanies={fetchCompanies} // function that reloads table
      />
    </Box>
  );
};

export default Companies;

