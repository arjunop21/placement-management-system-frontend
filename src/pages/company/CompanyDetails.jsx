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
import { getCompanyById } from "../../services/companyService";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EditCompanyModal from "./EditCompanyModal";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);

  const formatAddress = (c) => {
    const a = c?.address;
    if (!a) return "-";
    const parts = [
      a.street,
      a.city,
      a.state,
      a.country,
    ].filter(Boolean);
    const head = parts.join(", ");
    return a.pincode ? `${head} - ${a.pincode}` : head || "-";
  };

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);

      try {
        const res = await getCompanyById(id); // ✅ use service
        setCompany(res.data.data);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!company) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 5 }}>
        Company not found
      </Typography>
    );
  }

  const primaryContact = company.contacts?.[0];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 900 }}>

        {/* Back Button */}
        <Button
          onClick={() => navigate("/companies")}
          sx={{ mb: 2 }}
        >
          ← Back to Companies
        </Button>

        <Box
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: 3,
            bgcolor: "#fff",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              background: "linear-gradient(135deg, #0B2D7A, #1E3A8A)",
              color: "#fff",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight={700}>
                  {company.companyName}
                </Typography>
                <Typography variant="body2">
                  {company.industry || "-"}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setOpenEdit(true)}
                >
                  Edit Company
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Body */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={900} color="#123A7C">Website</Typography>
                <Typography>{company.website || "-"}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={900} color="#123A7C">Status</Typography>
                <Typography>{company.status || "-"}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" fontWeight={900} color="#123A7C">Address</Typography>
                <Typography>{formatAddress(company)}</Typography>
              </Grid>
            </Grid>

            {/* About */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} color="#123A7C">
                About Company
              </Typography>
              <Typography sx={{ mt: 1 }}>
                {company.aboutCompany || "-"}
              </Typography>
            </Box>

            {/* Contact Bar */}
            <Box
              sx={{
                mt: 4,
                p: 2,
                borderRadius: 3,
                background: "#1E3A8A",
                color: "#fff",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
              }}
            >
              <Box>
                <Typography fontWeight={600}>Contact</Typography>
                <Typography variant="body2">
                  {primaryContact?.email || "-"}
                </Typography>
              </Box>

              <Button
                variant="contained"
                href={
                  primaryContact?.phone
                    ? `tel:${primaryContact.phone}`
                    : undefined
                }
                disabled={!primaryContact?.phone}
              >
                Call
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* ADD MODAL HERE */}
      <EditCompanyModal
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        companyData={company}
        refreshCompany={async () => {
          try {
            const res = await getCompanyById(id);
            setCompany(res.data.data);
          } catch (err) {
            console.error(err);
          }
        }}
      />
    </Box>
  );
};

export default CompanyDetails;

