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

export const updateCandidate = async (id, candidateData) => {
  return axios.put(`${API_URL}/${id}`, candidateData, getAuthHeader());
};
