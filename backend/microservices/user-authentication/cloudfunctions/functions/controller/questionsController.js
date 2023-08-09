const QuestionService = require("../services/questionsService");

exports.addQuestion = async (req, res) => {
  try {
    const response = await QuestionService.addQuestion(req.body);
    res.send(response);
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
      response,
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
    const snapshot = await QuestionService.validate(req.body);
    const document = snapshot.docs.map((doc) => ({
      id: doc.id,
      isValidated: true,
      ...doc.data(),
    }));

    if (!document.length) {
      res.send({ message: "User Not validated.", isValidated: false });
    } else {
      res.send(document);
    }
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
    const snapshot = await QuestionService.getQuestionAnswer(req.body);
    const document = snapshot.docs.map((doc) => ({
      id: doc.id,
      isValidated: true,
      ...doc.data(),
    }));

    if (!document.length) {
      res.send({ message: "User Not validated." });
    } else {
      res.send(document[0]);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};
