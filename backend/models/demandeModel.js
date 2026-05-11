const db = require("../db");

// ================= ADD =================
exports.addDemande = async (data) => {

  const result = await db.query(
    `
    INSERT INTO ref.demandes
    (
      id_user,
      prenom,
      role,
      categorie,
      produit,
      quantiter,
      designation,
      status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      data.id_user,
      data.prenom,
      data.role,
      data.categorie,
      data.produit,
      data.quantiter,
      data.designation,
      data.status
    ]
  );

  return result.rows[0];
};

// ================= USER DEMANDES =================
exports.getByUser = async (id_user) => {

  const result = await db.query(
    `
    SELECT *
    FROM ref.demandes
    WHERE id_user = $1
    ORDER BY id DESC
    `,
    [id_user]
  );

  return result.rows;
};

// ================= GET ALL =================
exports.getAll = async () => {

  const result = await db.query(
    `
    SELECT *
    FROM ref.demandes
    ORDER BY id DESC
    `
  );

  return result.rows;
};