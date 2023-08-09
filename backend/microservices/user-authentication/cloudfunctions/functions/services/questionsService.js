const { QuestionsCollection, UserResponseCollection } = require("../db/db");

exports.addQuestion = async (question) => {
  return await QuestionsCollection.add(question);
};

exports.storeUserResponse = async (userResponse) => {
  return await UserResponseCollection.add(userResponse);
};

exports.validate = async (requestBody) => {
  return await UserResponseCollection.where("userId", "==", requestBody.userId)
    .where("question", "==", requestBody.question)
    .where("answer", "==", requestBody.answer)
    .get();
};

exports.getQuestionAnswer = async (requestBody) => {
  return await UserResponseCollection.where(
    "userId",
    "==",
    requestBody.userId
  ).get();
};
