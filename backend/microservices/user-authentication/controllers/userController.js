const UserServices = require("../services/userService");
const CommonFunctions = require("../common/commonFunctions");

require("dotenv").config();

exports.create = async (req, res) => {
  try {
    const params = {
      ClientId: process.env.CLIENT_ID,
      Username: req.body.email,
      Password: req.body.password,
      UserAttributes: [
        { Name: "email", Value: req.body.email },
        { Name: "family_name", Value: req.body.family_name },
        { Name: "given_name", Value: req.body.given_name },
        { Name: "gender", Value: req.body.gender },
        { Name: "phone_number", Value: req.body.phone_number },
      ],
    };
    const response = await UserServices.create(params);
    if (!response?.error) {
      const requestBody = {
        id: response?.UserSub,
      };
      const saveUserResponse = await UserServices.saveUserToDynamo(requestBody);
      if (!saveUserResponse?.data?.error) {
        res.send(response);
      }
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const params = {
      ClientId: process.env.CLIENT_ID,
      ConfirmationCode: req.body.code,
      Username: req.body.email,
    };

    const response = await UserServices.verifyEmail(params);
    if (!response.error) {
      res.send({ message: "Email Confirmed Successfully!" });
    } else {
      res.send(response);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.verifyEmailWithoutCode = async (req, res) => {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: req.body.email,
      UserAttributes: [{ Name: "email_verified", Value: "true" }],
    };

    const response = await UserServices.verifyEmailWithoutCode(params);
    if (!response.error) {
      const params = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: req.body.email,
      };
      await UserServices.adminConfirmSignUp(params);
      res.send({ message: "Email Confirmed Successfully!", success: true });
    } else {
      res.send({ success: false, response: response });
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.login = async (req, res) => {
  try {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        USERNAME: req.body.email,
        PASSWORD: req.body.password,
      },
    };
    const response = await UserServices.login(params);
    res.cookie("AccessToken", response?.AuthenticationResult?.AccessToken);
    let user;
    if (response?.AuthenticationResult?.AccessToken) {
      const params = {
        AccessToken: response?.AuthenticationResult?.AccessToken,
      };
      const userResponse = await UserServices.getUser(params);
      user = CommonFunctions.getUser(userResponse.UserAttributes);
    }
    const responseMessage = {
      user: user,
      authDetails: response,
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

exports.updateUser = async (req, res) => {
  try {
    const params = {
      AccessToken: req.headers.authorization,
      UserAttributes: [
        { Name: "email", Value: req.body.email },
        { Name: "family_name", Value: req.body.family_name },
        { Name: "given_name", Value: req.body.given_name },
        { Name: "gender", Value: req.body.gender },
        { Name: "phone_number", Value: req.body.phone_number },
        { Name: "picture", Value: req.body.picture },
      ],
    };
    const response = await UserServices.updateUser(params);
    if (!response.error) {
      res.send({ message: "User Updated Successfully!" });
    } else {
      res.send(response);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.getUser = async (req, res) => {
  try {
    const params = {
      AccessToken: req.headers.authorization,
    };
    const response = await UserServices.getUser(params);
    const user = CommonFunctions.getUser(response.UserAttributes);
    res.send(user);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.signout = async (req, res) => {
  try {
    const params = {
      AccessToken: req.headers.authorization,
    };
    const response = await UserServices.signout(params);
    if (!response.error) {
      res.send({ message: "User Signed Out Successfully!" });
    } else {
      res.send(response);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: req.headers.username,
    };

    const response = await UserServices.deleteUser(params);
    if (!response.error) {
      res.send({ message: "User Deleted Successfully!" });
    } else {
      res.send(response);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const params = {
      ClientId: process.env.CLIENT_ID,
      Username: req.body.email,
    };

    const response = await UserServices.forgotPassword(params);
    if (!response.error) {
      res.send({
        message:
          "Password reset initiated. Check your email for further instructions.",
      });
    } else {
      res.send(response);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.confirmPasswordReset = async (req, res) => {
  try {
    const params = {
      ClientId: process.env.CLIENT_ID,
      Username: req.body.email,
      ConfirmationCode: req.body.verificationCode,
      Password: req.body.newPassword,
    };

    const response = await UserServices.confirmPasswordReset(params);
    if (!response.error) {
      res.send({ message: "Password Reset Successfully!" });
    } else {
      res.send(response);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const params = {
      AccessToken: req.body.token,
    };
    const response = await UserServices.getUser(params);
    if (!response.error) {
      const user = CommonFunctions.getUser(response.UserAttributes);
      res.send(user);
    } else {
      const errorMessage = {
        message: "Unauthorized.",
        loginNeeded: true,
      };
      res.send(errorMessage);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: req.params.id,
    };
    const response = await UserServices.getUserById(params);
    const user = CommonFunctions.getUser(response.UserAttributes);
    res.send(user);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
    };
    const response = await UserServices.getAllUsers(params);
    const users = [];
    response.Users.map((val, index) => {
      const user = CommonFunctions.getUser(val.Attributes);
      users.push(user);
    });
    res.send(users);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.makeAdmin = async (req, res) => {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: req.body.id,
      UserAttributes: [{ Name: "custom:isAdmin", Value: "true" }],
    };
    const response = await UserServices.updateUserAdmin(params);
    if (!response.error) {
      res.send({
        message: `${req.user.family_name} ${req.user.given_name} is now an Admin.`,
      });
    } else {
      res.send(response);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.removeAdmin = async (req, res) => {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: req.body.id,
      UserAttributes: [{ Name: "custom:isAdmin", Value: "false" }],
    };
    const response = await UserServices.updateUserAdmin(params);
    if (!response.error) {
      res.send({
        message: `${req.user.family_name} ${req.user.given_name} is now removed from Admin.`,
      });
    } else {
      res.send(response);
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: req.body.id,
    };
    const response = await UserServices.deleteUserById(params);
    if (!response.message) {
      const response = {
        message: `${req.body.id} User Deleted Successfully.`,
      };
      return res.send(response);
    }
    const responseMessage = {
      message: "Error in deleting User.",
    };
    res.send(responseMessage);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Not Found.", error: err });
  }
};
