const express = require("express");
const router = express.Router();
const QuestionsController = require("../controller/questionsController");

router.post("/addQuestion", QuestionsController.addQuestion);
router.post("/storeUserResponse", QuestionsController.storeUserResponse);
router.post("/questionAnswerValidation", QuestionsController.validation);
router.post("/getQuestionAnswer", QuestionsController.getQuestionAnswer);
module.exports = { router };
