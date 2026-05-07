const categorieModel =
require("../models/categorieModel");

const getAllCategories =
async (req, res) => {

  try {

    const categories =
      await categorieModel.getCategories();

    res.json(categories);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Erreur serveur",
    });

  }
};

module.exports = {
  getAllCategories,
};