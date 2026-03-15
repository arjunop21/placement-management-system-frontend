import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ===========================
   GET ALL JOBS (Pagination + Search)
=========================== */
export const getJobs = async ({
  page = 1,
  limit = 5,
  keyword = "",
  companyId,
  status,
  interviewDate,
} = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (keyword) params.set("keyword", keyword);
  if (companyId) params.set("companyId", companyId);
  if (status) params.set("status", status);
  if (interviewDate) params.set("interviewDate", interviewDate); // ✅ ADD

  return axios.get(`${API_URL}?${params.toString()}`, getAuthHeader());
};

/* ===========================
   GET JOB BY ID
=========================== */
export const getJobById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};

/* ===========================
   CREATE JOB
=========================== */
export const createJob = async (jobData) => {
  return axios.post(API_URL, jobData, getAuthHeader());
};

/* ===========================
   UPDATE JOB
=========================== */
export const updateJob = async (id, jobData) => {
  return axios.put(`${API_URL}/${id}`, jobData, getAuthHeader());
};

/* ===========================
   DELETE JOB
=========================== */
export const deleteJob = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};

