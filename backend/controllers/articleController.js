const articleModel =
require("../models/articleModel");


// GET
const getAllArticles =
async (req, res) => {

  try {

    const articles =
      await articleModel.getArticles();

    res.json(articles);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Erreur serveur",
    });

  }
};


// ADD
const createArticle =
async (req, res) => {

  try {

    const {
      ref_cat,
      produit,
      designation,
      stock,
    } = req.body;

    const article =
      await articleModel.addArticle(
        ref_cat,
        produit,
        designation,
        stock
      );

    res.status(201).json(article);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Erreur serveur",
    });

  }
};


// DELETE
const removeArticle =
async (req, res) => {

  try {

    await articleModel.deleteArticle(
      req.params.id
    );

    res.json({
      message: "Article supprimé",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Erreur serveur",
    });

  }
};


module.exports = {
  getAllArticles,
  createArticle,
  removeArticle,
};