const UserServices = require("../services/userService");
const CommonFunctions = require("../common/commonFunctions");

const authGuard = async (req, res, next) => {
  const token =
    req.headers?.authorization || req.query?.token || req.cookies?.AccessToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized.", loginNeeded: true });
  }
  try {
    const params = {
      AccessToken: token,
    };
    const response = await UserServices.getUser(params);
    req.user = CommonFunctions.getUser(response.UserAttributes);
    next();
  } catch (error) {
    const errorMessage = {
      message: "Unauthorized.",
      loginNeeded: true,
    };
    res.send(errorMessage);
  }
};

module.exports = authGuard;
