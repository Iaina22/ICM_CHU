const db = require("../db");

const getUserById = async (id) => {

  if (isNaN(id)) {
    throw new Error("ID invalide");
  }

  const result = await db.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getUserById,
};