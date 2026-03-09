import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Autocomplete,
    MenuItem,
    Typography,
    Divider,
} from "@mui/material";
import { createCompany } from "../../services/companyService";
import {
    fetchCountries,
    fetchStatesForCountry,
    fetchCitiesForState,
    fetchIndianAreasByCity,
} from "../../services/locationService";
import { useTheme, useMediaQuery } from "@mui/material";

const AddCompanyModal = ({ open, handleClose, refreshCompanies }) => {

    const initialFormState = {
        companyName: "",
        industry: "",
        website: "",
        aboutCompany: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
        },
    };

    const [formData, setFormData] = useState(initialFormState);
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]); // streets/areas with pincodes
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // Load country list when modal opens
    useEffect(() => {
        let isMounted = true;

        if (!open || countryOptions.length > 0) return;

        const loadCountries = async () => {
            try {
                const list = await fetchCountries();
                if (isMounted) {
                    setCountryOptions(list);
                }
            } catch (e) {
                if (isMounted) {
                    setCountryOptions([]);
                }
            }
        };

        loadCountries();

        return () => {
            isMounted = false;
        };
    }, [open]);

    const loadStatesForCountryName = async (countryName) => {
        setLoadingStates(true);
        try {
            const states = await fetchStatesForCountry(countryName);
            setStateOptions(states);
        } catch (e) {
            console.error("Error fetching states:", e);
            setStateOptions([]);
        } finally {
            setLoadingStates(false);
        }
    };

    const loadCitiesForStateName = async (countryName, stateName) => {
        setLoadingCities(true);
        try {
            const cities = await fetchCitiesForState(countryName, stateName);
            setCityOptions(cities);
        } catch (e) {
            console.error("Error fetching cities:", e);
            setCityOptions([]);
        } finally {
            setLoadingCities(false);
        }
    };

    const loadAreasForCity = async (countryName, stateName, cityName) => {
        // Only India has a nice public API for areas/pincodes, fallback to manual otherwise
        if (!countryName || countryName.toLowerCase() !== "india") {
            setAreaOptions([]);
            return;
        }
        setLoadingAreas(true);
        try {
            const areas = await fetchIndianAreasByCity(cityName);
            setAreaOptions(areas);
        } catch (e) {
            console.error("Error fetching areas:", e);
            setAreaOptions([]);
        } finally {
            setLoadingAreas(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.address) {
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleCountryChange = (_event, newValue) => {
        const countryName = newValue || "";
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                country: countryName,
                state: "",
                city: "",
                street: "",
                pincode: "",
            },
        }));
        setStateOptions([]);
        setCityOptions([]);
        setAreaOptions([]);
        if (countryName) {
            loadStatesForCountryName(countryName);
        }
    };

    const handleStateChange = (e) => {
        const stateName = e.target.value;
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                state: stateName,
                city: "",
                street: "",
                pincode: "",
            },
        }));
        setCityOptions([]);
        setAreaOptions([]);
        if (stateName && formData.address.country) {
            loadCitiesForStateName(formData.address.country, stateName);
        }
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                city: cityName,
                street: "",
                pincode: "",
            },
        }));
        setAreaOptions([]);
        if (cityName && formData.address.country) {
            loadAreasForCity(formData.address.country, formData.address.state, cityName);
        }
    };

    const handleStreetChange = (e) => {
        const streetName = e.target.value;
        const streetConfig = areaOptions.find(
            (st) => st.name.toLowerCase() === streetName.toLowerCase()
        );

        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                street: streetName,
                pincode: streetConfig?.pincode || prev.address.pincode,
            },
        }));
    };
    const availableStates = stateOptions;
    const availableCities = cityOptions;
    const availableStreets = areaOptions;

    const handleSubmit = async () => {
        try {
            await createCompany(formData); // ✅ status not sent
            setFormData(initialFormState);
            handleClose();
            refreshCompanies(); // reload table
        } catch (error) {
            console.error("Error creating company:", error);
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
                    borderRadius: { xs: 0, sm: 4 },
                    p: { xs: 1, sm: 2 },
                    background: "linear-gradient(135deg, rgba(225, 227, 233, 0.95), rgb(235, 237, 244))",
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
                    color: "#3f5173f6",
                    pb: 1,
                }}
            >
                Add Company
            </DialogTitle>

            <DialogContent sx={{ mt: 1 }}>
                <Grid container spacing={2}>

                    {/* Company Name */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Company Name"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Industry */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Website */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* About */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="About Company"
                            name="aboutCompany"
                            value={formData.aboutCompany}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Country + State */}
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={countryOptions}
                            value={formData.address.country}
                            onChange={handleCountryChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Country" fullWidth />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={availableStates}
                            value={formData.address.state || null}
                            loading={loadingStates}
                            onChange={(_event, newValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    address: {
                                        ...prev.address,
                                        state: newValue || "",
                                        city: "",
                                        street: "",
                                        pincode: "",
                                    },
                                }));

                                if (newValue && formData.address.country) {
                                    loadCitiesForStateName(formData.address.country, newValue);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="State" fullWidth />
                            )}
                        />
                    </Grid>

                    {/* City */}
                    <Grid item xs={12}>
                        <Autocomplete
                            options={availableCities}
                            value={formData.address.city || null}
                            loading={loadingCities}
                            onChange={(_event, newValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    address: {
                                        ...prev.address,
                                        city: newValue || "",
                                        street: "",
                                        pincode: "",
                                    },
                                }));

                                if (newValue) {
                                    loadAreasForCity(
                                        formData.address.country,
                                        formData.address.state,
                                        newValue
                                    );
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="City" fullWidth />
                            )}
                        />
                    </Grid>

                    {/* Street + Pincode */}
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={availableStreets}
                            getOptionLabel={(option) =>
                                typeof option === "string"
                                    ? option
                                    : `${option.name} (${option.pincode})`
                            }
                            value={
                                availableStreets.find(
                                    (s) => s.name === formData.address.street
                                ) || null
                            }
                            loading={loadingAreas}
                            onChange={(_event, newValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    address: {
                                        ...prev.address,
                                        street: newValue?.name || "",
                                        pincode: newValue?.pincode || "",
                                    },
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Street" fullWidth />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Pincode"
                            name="pincode"
                            value={formData.address.pincode}
                            onChange={handleChange}
                        />
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    pt: 1,
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: 1.5,
                }}
            >
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
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
                        color: "#010205",
                        textTransform: "none",
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCompanyModal;

