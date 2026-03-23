import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getInvoices = (id) => API.get(`/invoices?subscriptionId=${id}`);
export const generateInvoice = () => API.get("/invoices/generate");