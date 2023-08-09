const AWS = require("aws-sdk");
const axios = require("axios");
const cognito = new AWS.CognitoIdentityServiceProvider();
require("dotenv").config();

exports.create = async (params) => {
  return cognito.signUp(params).promise();
};

exports.verifyEmail = async (params) => {
  return cognito.confirmSignUp(params).promise();
};

exports.verifyEmailWithoutCode = async (params) => {
  return cognito.adminUpdateUserAttributes(params).promise();
};

exports.adminConfirmSignUp = async (params) => {
  return cognito.adminConfirmSignUp(params).promise();
};

exports.login = async (params) => {
  return cognito.initiateAuth(params).promise();
};

exports.updateUser = async (params) => {
  return cognito.updateUserAttributes(params).promise();
};

exports.getUser = async (params) => {
  return cognito.getUser(params).promise();
};

exports.signout = async (params) => {
  return cognito.globalSignOut(params).promise();
};

exports.deleteUser = async (params) => {
  return cognito.adminDeleteUser(params).promise();
};

exports.forgotPassword = async (params) => {
  return cognito.forgotPassword(params).promise();
};

exports.confirmPasswordReset = (params) => {
  return cognito.confirmForgotPassword(params).promise();
};

exports.getUserById = async (params) => {
  return await cognito.adminGetUser(params).promise();
};

exports.getAllUsers = async (params) => {
  return await cognito.listUsers(params).promise();
};

exports.updateUserAdmin = async (params) => {
  return await cognito.adminUpdateUserAttributes(params).promise();
};

exports.saveUserToDynamo = async (data) => {
  return await axios.post(
    `${process.env.USER_PROFILE_BASE_URL}/saveUser`,
    data
  );
};

exports.deleteUserById = async (params) => {
  return await cognito.adminDeleteUser(params).promise();
};
