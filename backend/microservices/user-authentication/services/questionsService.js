const axios = require("axios");
require("dotenv").config();

exports.addQuestion = async (requestBody) => {
  return await axios.post(
    `${process.env.CLOUD_FUNCTION_BASEURL}/addQuestion`,
    requestBody
  );
};

exports.storeUserResponse = async (requestBody) => {
  return await axios.post(
    `${process.env.CLOUD_FUNCTION_BASEURL}/storeUserResponse`,
    requestBody
  );
};

exports.validate = async (requestBody) => {
  return await axios.post(
    `${process.env.CLOUD_FUNCTION_BASEURL}/questionAnswerValidation`,
    requestBody
  );
};

exports.getQuestionAnswer = async (requestBody) => {
  return await axios.post(
    `${process.env.CLOUD_FUNCTION_BASEURL}/getQuestionAnswer`,
    requestBody
  );
}