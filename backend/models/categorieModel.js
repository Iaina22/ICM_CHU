const db = require("../db");

const getCategories = async () => {

  const result = await db.query(`
  
    SELECT 
      ref_cat,
      nom,
      code_compta
    FROM ref.categories
    ORDER BY nom ASC
  
  `);

  return result.rows;
};

module.exports = {
  getCategories,
};