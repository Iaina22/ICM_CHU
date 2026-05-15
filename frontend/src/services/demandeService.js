import axios from "axios";

const API = "http://localhost:5000/api/demandes";

export const getAllDemandes = async () => {
  const res = await axios.get(`${API}/all`);
  return res.data;
};

export const getDemandesByUser = async (id) => {
  const res = await axios.get(`${API}/user/${id}`);
  return res.data;
};

export const addDemande = async (data) => {
  const res = await axios.post(`${API}`, data);
  return res.data;
};
export const updateDemandeStatus = async (data) => {
  const res = await axios.put("http://localhost:5000/api/demandes/status", data);
  return res.data;
};