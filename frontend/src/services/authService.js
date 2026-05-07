import axios from "axios";

const API_URL =
  "http://localhost:5000/api/auth";


// GET USER
export const getUser = async (id) => {

  const response =
    await axios.get(
      `${API_URL}/user/${id}`
    );

  return response.data;
};