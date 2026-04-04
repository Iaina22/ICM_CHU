
const { Pool } = require('pg'); 

const pool = new Pool({
  user: 'postgres',        
  host: 'localhost',
  database: 'aina',   
  password: 'Rajao123.',        
  port: 5432
});

module.exports = pool;       