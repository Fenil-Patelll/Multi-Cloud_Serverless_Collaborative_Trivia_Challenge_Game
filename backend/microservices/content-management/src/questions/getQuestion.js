const { findQuestion } = require("../utils/findQuestion");

module.exports.main = async (event) => {
  const questionId = event.pathParameters.id;

  const question = await findQuestion(questionId);

  if (question) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(question),
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: `Question with ID ${questionId} not found.`,
    };
  }
};