const db = require("../db");


// GET ARTICLES
const getArticles = async () => {

  const result = await db.query(`

    SELECT

      a.id,
      a.ref_article AS ref_art,
      a.ref_cat,
      c.nom,
      c.code_compta,
      a.produit,
      a.designation,
      a.stock

    FROM ref.articles a

    INNER JOIN ref.categories c
    ON a.ref_cat = c.ref_cat

    ORDER BY a.id DESC

  `);

  return result.rows;
};


// ADD ARTICLE
const addArticle = async (
  ref_cat,
  produit,
  designation,
  stock
) => {

  // génération REF automatique
  const last =
    await db.query(`
      SELECT id
      FROM ref.articles
      ORDER BY id DESC
      LIMIT 1
    `);

  let nextId = 1;

  if (last.rows.length > 0) {

    nextId = last.rows[0].id + 1;

  }

  const ref_article =
    `ART-${String(nextId).padStart(3, "0")}`;

  const result = await db.query(`

    INSERT INTO ref.articles
    (
      ref_article,
      ref_cat,
      produit,
      designation,
      stock
    )

    VALUES ($1,$2,$3,$4,$5)

    RETURNING *

  `,
  [
    ref_article,
    ref_cat,
    produit,
    designation,
    stock
  ]);

  return result.rows[0];
};


// DELETE
const deleteArticle = async (id) => {

  await db.query(`
    DELETE FROM ref.articles
    WHERE id = $1
  `, [id]);

};


module.exports = {
  getArticles,
  addArticle,
  deleteArticle,
};