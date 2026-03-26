import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getTransactions = (productId, page = 1) => API.get(`/inventory-transactions?page=${page}&productId=${productId}`);
export const createTransaction = (data) => API.post("/inventory-transactions", data);
export const updateTransaction = (id, data) => API.put(`/inventory-transactions/${id}`, data);