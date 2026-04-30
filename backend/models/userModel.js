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

// ✅ GET USER BY ID
const getUserById = async (id) => {
  return await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
};

// ✅ UPDATE USER BY ID
const updateUserById = async (id, userData) => {
  const { nom, prenom, age, sexe, adresse, email, phone, cin } = userData;

  return await db.query(
    `UPDATE users 
     SET nom=$1, prenom=$2, age=$3, sexe=$4, adresse=$5, email=$6, phone=$7, cin=$8
     WHERE id=$9 RETURNING *`,
    [nom, prenom, age, sexe, adresse, email, phone, cin, id]
  );
};

module.exports = {
  createUser,
  getUserByPrenom,
  getUserById,
  updateUserById
};
