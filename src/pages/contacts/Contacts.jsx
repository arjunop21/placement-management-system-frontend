import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Pagination,
  Chip,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import AddContactModal from "./AddContactModal";
import EditContactModal from "./EditContactModal";
import { getContacts, deleteContact } from "../../services/contactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [editData, setEditData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchContacts = async () => {
    try {
      const res = await getContacts(page, search);

      setContacts(res.data.data);
      setPages(res.data.pages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, search]);

  const handleDelete = async (id) => {
    await deleteContact(id);
    fetchContacts();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={2}
        mb={2}
      >
        <TextField
          size="small"
          fullWidth
          sx={{ maxWidth: { sm: 300 } }}
          placeholder="Search by name or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          fullWidth={{ xs: true, sm: false }}
          variant="contained"
          sx={{
            backgroundColor: "#1E3A8A",
            "&:hover": { backgroundColor: "#163172" },
          }}
          onClick={() => setOpenAdd(true)}
        >
          Add Contact
        </Button>
      </Box>

      {/* Contacts List */}

      {isMobile ? (
        <Box>
          {contacts.map((contact) => (
            <Card
              key={contact._id}
              sx={{
                mb: 2,
                boxShadow: 3,
              }}
            >
              <CardContent>

                <Typography variant="h6" fontWeight="bold">
                  {contact.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {contact.designation}
                </Typography>

                <Typography variant="body2" mt={1}>
                  <b>Company:</b> {contact.companyId?.companyName}
                </Typography>

                <Typography variant="body2">
                  <b>Email:</b> {contact.email}
                </Typography>

                <Typography variant="body2">
                  <b>Phone:</b> {contact.phone}
                </Typography>

                <Box mt={1}>
                  {contact.isPrimary && (
                    <Chip label="Primary Contact" color="success" size="small" />
                  )}
                </Box>

                <Box mt={2} display="flex" gap={1}>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() => setEditData(contact)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    fullWidth
                    onClick={() => handleDelete(contact._id)}
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
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#1E3A8A" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Designation</TableCell>
                <TableCell sx={{ color: "#fff" }}>Company</TableCell>
                <TableCell sx={{ color: "#fff" }}>Primary</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {contacts.map((contact) => (
                <TableRow
                  key={contact._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(37,99,235,0.06)",
                    },
                    transition: "background-color 0.15s ease-out",
                  }}
                >
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.designation}</TableCell>
                  <TableCell>{contact.companyId?.companyName}</TableCell>

                  <TableCell>
                    {contact.isPrimary ? (
                      <Chip label="Primary" color="success" size="small" />
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => setEditData(contact)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(contact._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
        />
      </Box>

      {/* Modals */}
      <AddContactModal
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        refresh={fetchContacts}
      />

      <EditContactModal
        open={Boolean(editData)}
        handleClose={() => setEditData(null)}
        data={editData}
        refresh={fetchContacts}
      />
    </Box>
  );
};

export default Contacts;

