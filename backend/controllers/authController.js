const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { nom, prenom, age, sexe, cin, adresse, email, phone, role, mdp } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(mdp, 10);

    const result = await userModel.createUser({
      nom,
      prenom,
      age,
      sexe,
      cin,
      adresse,
      email,
      phone,
      role,
      password_hash: hashedPassword
    });

    res.json({
      success: true,
      message: "Inscription réussie",
      user: result.rows[0]   // 🔥 INFO USER MIVOAKA
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  const { prenom, mdp } = req.body;

  try {
    const userQuery = await userModel.getUserByPrenom(prenom);

    if (userQuery.rows.length === 0) {
      return res.json({
        success: false,
        message: "Compte inexistant"
      });
    }

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(mdp, user.password_hash);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Mot de passe incorrect"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Erreur serveur"
    });
  }
};