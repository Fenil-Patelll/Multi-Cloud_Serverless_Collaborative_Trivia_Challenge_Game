const { findQuestionByCategory } = require("../utils/findQuestionByCategory");

module.exports.main = async (event) => {
  const category = event.pathParameters.category;

  const question = await findQuestionByCategory(category);

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
      body: `Question with category ${category} not found.`,
    };
  }
};