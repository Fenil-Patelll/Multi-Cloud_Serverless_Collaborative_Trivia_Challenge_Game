const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const QuestionsController = require("../controllers/questionsController");
const authGuard = require("../middlewares/authGuard");

// User Routes
router.post("/users/create", UserController.create);
router.post("/users/verifyEmail", UserController.verifyEmail);
router.post("/login", UserController.login);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/confirm-password-reset", UserController.confirmPasswordReset);
router.post("/verifyToken", UserController.verifyToken);
router.post("/updateUser", authGuard, UserController.updateUser);
router.get("/getUser", authGuard, UserController.getUser);
router.get("/signout", authGuard, UserController.signout);
router.get("/deleteUser", authGuard, UserController.deleteUser);
router.post("/verifyEmailWithoutCode", UserController.verifyEmailWithoutCode);
router.get("/getuserbyuserid/:id", UserController.getUserById);
router.get("/getAllUsers", UserController.getAllUsers);
router.post("/makeAdmin", UserController.makeAdmin);
router.post("/removeAdmin", UserController.removeAdmin);
router.post("/deleteUserById", UserController.deleteUserById)

// Add Questions to the firebase DB
router.post("/addQuestion", QuestionsController.addQuestion);
router.post("/storeUserResponse", QuestionsController.storeUserResponse);
router.post("/questionAnswerValidation", QuestionsController.validation);
router.post("/getQuestionAnswer", QuestionsController.getQuestionAnswer);
module.exports = { router };
