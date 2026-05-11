const pool = require("../db");

// GET demandes par user
exports.getDemandesByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID manquant" });
    }

    // Esory ny ORDER BY created_at satria tsy misy io colonne io
    const result = await pool.query(
      "SELECT * FROM ref.demandes WHERE id_user = $1",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur getDemandesByUser:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// POST nouvelle demande
exports.addDemande = async (req, res) => {
  try {
    const { id_user, prenom, role, categorie, produit, quantiter, designation, status } = req.body;

    // ⚠️ Ampiasao ny colonne marina: "quantiter" fa tsy "quantite"
    await pool.query(
      "INSERT INTO ref.demandes (id_user, prenom, role, categorie, produit, quantiter, designation, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [id_user, prenom, role, categorie, produit, quantiter, designation, status]
    );

    res.json({ message: "Demande ajoutée" });
  } catch (err) {
    console.error("Erreur addDemande:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
