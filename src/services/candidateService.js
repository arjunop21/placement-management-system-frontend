import axios from "axios";

const API_URL = "http://localhost:5000/api/candidates";

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

export const updateCandidate = async (id, candidateData) => {
  return axios.put(`${API_URL}/${id}`, candidateData, getAuthHeader());
};
