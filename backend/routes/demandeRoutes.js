const express = require("express");
const router = express.Router();

const controller = require("../controllers/demandeController");


router.get("/all", controller.getAllDemandes);

// GET BY USER
router.get("/user/:id", controller.getDemandesByUser);

router.post("/", controller.addDemande);
router.put("/status", controller.updateDemandeStatus);

module.exports = router;