const db = require('../db');

// CREATE USER
const createUser = async (userData) => {
  const {
    nom, prenom, age, sexe, cin,
    adresse, email, phone, role, password_hash
  } = userData;

  return await db.query(`
    INSERT INTO users 
    (nom, prenom, age, sexe, cin, adresse, email, phone, role, password_hash, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending')
    RETURNING *
  `, [
    nom, prenom, age, sexe, cin,
    adresse, email, phone, role, password_hash
  ]);
};

// GET USER BY PRENOM
const getUserByPrenom = async (prenom) => {
  return await db.query(
    'SELECT * FROM users WHERE prenom = $1',
    [prenom]
  );
};

module.exports = {
  createUser,
  getUserByPrenom
};