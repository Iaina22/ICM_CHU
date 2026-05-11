const express = require("express");
const router = express.Router();
const { getDemandesByUser, addDemande } = require("../controllers/demandeController");

router.get("/user/:id", getDemandesByUser);
router.post("/", addDemande);

module.exports = router;
