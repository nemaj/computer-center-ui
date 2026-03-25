import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getCustomers = (page, search = '') => API.get(`/customers?page=${page}&search=${search}`);
export const getCustomer = (id) => API.get(`/customers/${id}`);
export const createUser = (data) => API.post("/customers", data);
export const updateUser = (id, data) => API.put(`/customers/${id}`, data);
// export const deleteUser = (id) => API.delete(`/users/${id}`);