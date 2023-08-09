const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authGuard");
const UserController = require("../controllers/userController");

router.post("/saveUser", UserController.save);
router.get("/getGameData", authGuard, UserController.getGameData);
router.get("/getGamedataByUserId/:id", UserController.getGameDataByUserId);
router.post("/updateGameData", authGuard, UserController.update);
router.post("/updateGameDataById/:id", UserController.updateGameDataById);
module.exports = { router };
