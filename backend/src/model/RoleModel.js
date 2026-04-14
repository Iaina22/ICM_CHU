const db = require("../db");

const Role = {
  getAll: async () => {
    const result = await db.query("SELECT * FROM role");
    return result.rows;
  }
};

module.exports = Role;