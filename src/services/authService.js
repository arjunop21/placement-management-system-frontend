import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API = `${API_BASE_URL}/api/auth`;

export const registerUser = (data) => {
  return axios.post(`${API}/register`, data);
};

export const loginUser = (data) => {
  return axios.post(`${API}/login`, data);
};
