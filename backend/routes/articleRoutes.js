const express = require("express");

const router = express.Router();

const {
  getAllArticles,
  createArticle,
  removeArticle,
} = require("../controllers/articleController");

router.get("/", getAllArticles);

router.post("/", createArticle);

router.delete("/:id", removeArticle);


module.exports = router;