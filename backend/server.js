const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());


// ======================
// INSCRIPTION
// ======================
app.post('/api/register', async (req, res) => {
  const { nom, prenom, age, sexe, cin, adresse, email, phone, role, mdp } = req.body;

  if (!nom || !prenom || !email || !mdp) {
    return res.status(400).json({
      success: false,
      message: 'Champs requis manquants'
    });
  }

  try {
    const emailCheck = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }

    const hashedPassword = await bcrypt.hash(mdp, 10);

    const insertQuery = `
      INSERT INTO users 
      (nom, prenom, age, sexe, cin, adresse, email, phone, role, password_hash, status)
      VALUES 
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending')
      RETURNING id
    `;

    const result = await db.query(insertQuery, [
      nom, prenom, age, sexe, cin, adresse, email, phone, role, hashedPassword
    ]);

    res.json({
      success: true,
      message: "Inscription réussie",
      userId: result.rows[0].id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});


// ======================
// LOGIN
// ======================
app.post('/api/login', async (req, res) => {
  const { prenom, mdp } = req.body;

  if (!prenom || !mdp) {
    return res.status(400).json({
      success: false,
      message: "Champs requis"
    });
  }

  try {
    const userQuery = await db.query(
      'SELECT * FROM users WHERE prenom = $1',
      [prenom]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Utilisateur introuvable"
      });
    }

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(mdp, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mot de passe incorrect"
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        status: user.status
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});


// ======================
// ADMIN - PENDING USERS (FIXED)
// ======================
app.get('/api/admin/pending-users', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        nom,
        prenom,
        age,
        sexe,
        cin,
        adresse,
        email,
        phone,
        role
      FROM users
      WHERE status = 'pending'
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
});


// ======================
// APPROVE USER
// ======================
app.post('/api/admin/approve/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE users SET status='active' WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Utilisateur approuvé"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
});


// ======================
// REJECT USER
// ======================
app.post('/api/admin/reject/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE users SET status='rejected' WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Utilisateur refusé"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
});


// ======================
// START SERVER
// ======================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});