const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/articleController");

router.get("/", ctrl.getArticles);
router.post("/", ctrl.addArticle);
router.put("/:id", ctrl.updateStock);

module.exports = router;