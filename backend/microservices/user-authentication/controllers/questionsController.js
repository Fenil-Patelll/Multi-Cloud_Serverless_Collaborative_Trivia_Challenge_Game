const QuestionService = require("../services/questionsService");

exports.addQuestion = async (req, res) => {
  try {
    const response = await QuestionService.addQuestion(req.body);
    res.send(response.data);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.storeUserResponse = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      question: req.body.question,
      answer: req.body.answer,
    };
    const response = await QuestionService.storeUserResponse(data);
    const responseMessage = {
      message: "User response Added",
      isAdded: true,
      response: response.data,
    };
    res.send(responseMessage);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.validation = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      question: req.body.question,
      answer: req.body.answer,
    };
    const response = await QuestionService.validate(data);
    res.send(response.data);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.getQuestionAnswer = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId
    };
    const response = await QuestionService.getQuestionAnswer(data);
    res.send(response.data);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};
