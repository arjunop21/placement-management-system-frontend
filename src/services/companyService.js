import axios from "axios";

const API_URL = "http://localhost:5000/api/companies";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getCompanies = async (page = 1, keyword = "") => {
  return axios.get(
    `${API_URL}?page=${page}&keyword=${keyword}`,
    getAuthHeader()
  );
};

// Fetches all companies across pages, but returns only id + name
export const getAllCompanyNames = async (keyword = "") => {
  const firstRes = await getCompanies(1, keyword);

  const firstData = firstRes?.data?.data ?? [];
  const totalPages = firstRes?.data?.pages ?? 1;

  let all = [...firstData];

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) => getCompanies(i + 2, keyword))
    );
    for (const r of rest) {
      const pageData = r?.data?.data ?? [];
      all = all.concat(pageData);
    }
  }

  const seen = new Set();
  return all
    .filter((c) => {
      const id = c?._id;
      if (!id) return false;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((c) => ({ _id: c._id, companyName: c.companyName }));
};

export const deleteCompany = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};

export const createCompany = async (companyData) => {
  return axios.post(API_URL, companyData, getAuthHeader());
};

export const getCompanyById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};

export const updateCompany = async (id, companyData) => {
  return axios.put(`${API_URL}/${id}`, companyData, getAuthHeader());
}

export const getDashboardCounts = async () => {
  return axios.get(`${API_URL}/dashboard-counts`, getAuthHeader());
};
