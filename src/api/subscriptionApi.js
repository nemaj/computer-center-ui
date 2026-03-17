import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getSubscription = (id) => API.get(`/subscriptions?customerId=${id}`);
export const createSubscription = (data) => API.post("/subscriptions", data);
export const updateSubscription = (id, data) => API.put(`/subscriptions/${id}`, data);