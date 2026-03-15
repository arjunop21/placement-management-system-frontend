import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/contacts`;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ===========================
   GET ALL CONTACTS (Pagination + Search)
=========================== */
export const getContacts = async (page = 1, keyword = "", companyId = "") => {
  const params = new URLSearchParams({ page, keyword });
  if (companyId) params.set("companyId", companyId);
  return axios.get(`${API_URL}?${params.toString()}`, getAuthHeader());
};

/* ===========================
   GET CONTACTS BY COMPANY (for dropdowns)
=========================== */
export const getContactsByCompanyId = async (companyId) => {
  if (!companyId) return { data: { data: [] } };
  return getContacts(1, "", companyId);
};

/* ===========================
   GET CONTACT BY ID
=========================== */
export const getContactById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};

/* ===========================
   CREATE CONTACT
=========================== */
export const createContact = async (contactData) => {
  return axios.post(API_URL, contactData, getAuthHeader());
};

/* ===========================
   UPDATE CONTACT
=========================== */
export const updateContact = async (id, contactData) => {
  return axios.put(`${API_URL}/${id}`, contactData, getAuthHeader());
};

/* ===========================
   DELETE CONTACT
=========================== */
export const deleteContact = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};
