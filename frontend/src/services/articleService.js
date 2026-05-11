import axios from "axios";

const API = "http://localhost:5000/api/articles";

// GET
export const getArticles = async () => {

  const res = await axios.get(API);

  return res.data;
};

// ADD
export const addArticle = async (data) => {

  const res = await axios.post(API, data);

  return res.data;
};

// UPDATE STOCK
export const updateArticle = async (id, stock) => {

  const res = await axios.put(
    `${API}/${id}`,
    { stock }
  );

  return res.data;
};