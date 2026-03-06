import axios from "axios";

// Fetch list of country names from a public API
export const fetchCountries = async () => {
  console.log("Fetching countries...");
  const res = await axios.get(
  "https://restcountries.com/v3.1/all?fields=name"
);
  console.log("Raw country data:", res.data.slice(0, 5)); // Log first 5 entries for verification
  const names =
    res.data
      ?.map((c) => c?.name?.common)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b)) ?? [];
  return names;
};

// Fetch states for a given country using countriesnow public API
export const fetchStatesForCountry = async (country) => {
  if (!country) return [];
  const res = await axios.post(
    "https://countriesnow.space/api/v0.1/countries/states",
    { country }
  );
  if (!res.data?.data?.states) return [];
  return res.data.data.states
    .map((s) => s.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
};

// Fetch cities for a given country + state
export const fetchCitiesForState = async (country, state) => {
  if (!country || !state) return [];
  const res = await axios.post(
    "https://countriesnow.space/api/v0.1/countries/state/cities",
    { country, state }
  );
  if (!res.data?.data) return [];
  return res.data.data
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
};

// For India only: use India Post public API to fetch post offices (areas/streets) and pincodes by city.
export const fetchIndianAreasByCity = async (city) => {
  if (!city) return [];
  const encoded = encodeURIComponent(city);
  const res = await axios.get(
    `https://api.postalpincode.in/postoffice/${encoded}`
  );

  const offices = res.data?.[0]?.PostOffice ?? [];
  return offices
    .map((o) => ({
      name: o.Name,
      pincode: o.Pincode,
    }))
    .filter((o) => o.name && o.pincode);
};

