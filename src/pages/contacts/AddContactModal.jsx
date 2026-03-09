import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Box,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import { getAllCompanyNames } from "../../services/companyService";
import { createContact } from "../../services/contactService";
import { useTheme, useMediaQuery } from "@mui/material";

const AddContactModal = ({ open, handleClose, refresh }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [companies, setCompanies] = useState([]);
    const [errors, setErrors] = useState({
        email: "",
        phone: "",
    });

    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        email: "",
        phone: "",
        companyId: "",
        isPrimary: false,
    });

    /* ===============================
       FETCH COMPANIES
    =============================== */
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const list = await getAllCompanyNames("");
                setCompanies(list);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };

        fetchCompanies(); // ✅ CALL FUNCTION
    }, []);

    const validate = (data) => {
        const nextErrors = { email: "", phone: "" };

        const email = (data.email ?? "").trim();
        const phone = (data.phone ?? "").trim();

        if (!email) {
            nextErrors.email = "Email is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email";
        }

        if (!phone) {
            nextErrors.phone = "Phone number is required";
        } else {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone)) nextErrors.phone = "Enter a valid 10-digit phone number";
        }

        setErrors(nextErrors);
        return !nextErrors.email && !nextErrors.phone;
    };

    /* ===============================
       SUBMIT CONTACT
    =============================== */
    const handleSubmit = async () => {
        if (!validate(formData)) return;

        try {
            await createContact(formData); // ✅ use service
            refresh();
            handleClose();

            // ✅ reset form after save
            setFormData({
                name: "",
                designation: "",
                email: "",
                phone: "",
                companyId: "",
                isPrimary: false,
            });
            setErrors({ email: "", phone: "" });
        } catch (error) {
            console.error("Error creating contact:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={fullScreen}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: { xs: 0, sm: 3 },
                    p: { xs: 1, sm: 2 },
                    background:
                        "linear-gradient(135deg, rgba(225, 227, 233, 0.95), rgb(235, 237, 244))",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 32px 80px rgba(45, 61, 98, 0.9)",
          border: "1px solid rgba(121, 151, 194, 0.45)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#0b307b",
                    pb: 1,
                }}
            >
                Add Contact
            </DialogTitle>

            <DialogContent
                sx={{
                    mt: 1,
                    px: { xs: 1.5, sm: 3 },
                    py: { xs: 2, sm: 3 },
                }}
            >
                <Grid container spacing={2}>

                    {/* Name */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Name"
                            size="medium"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }

                        />
                    </Grid>

                    {/* Designation */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Designation"
                            size="medium"
                            value={formData.designation}
                            onChange={(e) =>
                                setFormData({ ...formData, designation: e.target.value })
                            }
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            size="medium"
                            value={formData.email}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            onChange={(e) => {
                                const next = { ...formData, email: e.target.value };
                                setFormData(next);
                                if (errors.email) validate(next);
                            }}
                            onBlur={() => validate(formData)}
                        />
                    </Grid>

                    {/* Phone */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            size="medium"
                            value={formData.phone}
                            error={Boolean(errors.phone)}
                            helperText={errors.phone}
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 10 }}
                            onChange={(e) => {
                                const digitsOnly = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
                                const next = { ...formData, phone: digitsOnly };
                                setFormData(next);
                                if (errors.phone) validate(next);
                            }}
                            onBlur={() => validate(formData)}
                        />
                    </Grid>


                    {/* Company */}
                    <Grid item xs={12}>

                        <Autocomplete
                            options={companies || []}
                            getOptionLabel={(option) => option.companyName || ""}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            value={
                                companies.find((c) => c._id === formData.companyId) || null
                            }
                            onChange={(event, newValue) => {
                                setFormData({
                                    ...formData,
                                    companyId: newValue ? newValue._id : "",
                                });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Company"
                                    placeholder="Select company"
                                    variant="outlined"
                                    size="medium"   // ← important
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}              
                                    sx={{
                                        
                                        '& .MuiInputBase-root': {
                                            height: 56,                     
                                            fontSize: '1rem',  
                                            width: '220px',              
                                        },
                                        '& .MuiInputBase-input': {
                                            padding: '16.5px 14px',          
                                        },
                                       
                                    }}
                                />
                            )}
                        />


                    </Grid>

                    {/* Primary */}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isPrimary}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            isPrimary: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Primary Contact"
                        />
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    pt: 1,
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                    justifyContent: { sm: "flex-end" },
                    gap: 1.5,
                }}
            >
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        width: { xs: "100%", sm: "auto" },
                        backgroundColor: "#1D4ED8",
                        borderRadius: 999,
                        py: 1.2,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 12px 30px rgba(37,99,235,0.7)",
                        "&:hover": { backgroundColor: "#1E40AF" },
                    }}
                >
                    Save →
                </Button>

                <Button
                    onClick={handleClose}
                    sx={{
                        color: "#0b0d11",
                        textTransform: "none",
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddContactModal;

