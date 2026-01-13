import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const api = axios.create({ baseURL, timeout: 5000 });

export const fetchGrowEnvs = (params) => {
  return api.get("/api/growEnvs", { params }).then((r) => r.data);
};

export const fetchGrowEnvById = (id) => {
  return api.get(`/api/growEnvs/${id}`).then((r) => r.data);
};

export const createGrowEnv = (data) => {
  return api.post("/api/growEnvs", data).then((r) => r.data);
};

export const deleteGrowEnvById = (id) => {
  return api.delete(`/api/growEnvs/${id}`).then((r) => r.data);
};

export default api;
