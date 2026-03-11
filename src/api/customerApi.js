import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const findCustomers = (search) => API.get(`/customers?search=${search}`);
export const getCustomers = () => API.get("/customers");
export const getCustomer = (id) => API.get(`/customers/${id}`);
export const createUser = (data) => API.post("/customers", data);
export const updateUser = (id, data) => API.put(`/customers/${id}`, data);
// export const deleteUser = (id) => API.delete(`/users/${id}`);