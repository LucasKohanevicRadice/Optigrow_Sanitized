import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const api = axios.create({ baseURL, timeout: 5000 });

export const fetchPlants = (params) =>
  api.get("/api/plants", { params }).then((r) => r.data);

export const fetchPlantById = (id) =>
  api.get(`/api/plants/${id}`).then((r) => r.data);

export default api;
