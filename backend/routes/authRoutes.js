const express = require("express");

const router = express.Router();

const authController =
require("../controllers/authController");


// =============================
// AUTH
// =============================

router.post(
  "/register",
  authController.register
);

router.post(
  "/login",
  authController.login
);


// =============================
// USER
// =============================

// ✅ GET USER BY ID
// exemple:
// /api/auth/user/1

router.get(
  "/user/:id",
  authController.getUser
);


// ✅ UPDATE USER
// exemple:
// /api/auth/user/1

router.put(
  "/user/:id",
  authController.updateUser
);


module.exports = router;