import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/candidates`;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createCandidate = async (candidateData) => {
  return axios.post(API_URL, candidateData, getAuthHeader());
};

export const getCandidates = async (params = {}) => {
  return axios.get(API_URL, {
    ...getAuthHeader(),
    params,
  });
};

// Fetches all candidates across pages (for filter dropdowns)
export const getAllCandidates = async ({ limit = 50 } = {}) => {
  const firstRes = await getCandidates({ page: 1, limit });

  const firstData = firstRes?.data?.data ?? [];
  const totalPages = firstRes?.data?.pages ?? 1;

  let all = [...firstData];

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        getCandidates({ page: i + 2, limit })
      )
    );
    for (const r of rest) {
      const pageData = r?.data?.data ?? [];
      all = all.concat(pageData);
    }
  }

  const seen = new Set();
  return all.filter((c) => {
    const id = c?._id ?? c?.id;
    if (!id) return false;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

export const getCandidateById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};

export const updateCandidate = async (id, candidateData) => {
  return axios.put(`${API_URL}/${id}`, candidateData, getAuthHeader());
};

// /:id/history end point for candidate history
export const getCandidateHistory = async (id) => {
  return axios.get(`${API_URL}/${id}/history`, getAuthHeader());
};
