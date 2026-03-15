import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const findPlans = (search) => API.get(`/plans?search=${search}`);
export const getPlans = () => API.get("/plans");
export const getPlan = (id) => API.get(`/plans/${id}`);
export const createPlan = (data) => API.post("/plans", data);
export const updatePlan = (id, data) => API.put(`/plans/${id}`, data);
// export const deletePlan = (id) => API.delete(`/users/${id}`);