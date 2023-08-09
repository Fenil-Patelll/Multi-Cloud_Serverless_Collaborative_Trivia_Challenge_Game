const CommonFunctions = require("../common/commonFunctions");
const AuthGuardService = require("../services/authGaurdService");

const authGuard = async (req, res, next) => {
  const token =
    req.headers?.authorization || req.query?.token || req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized.", loginNeeded: true });
  }
  try {
    const params = {
      AccessToken: req.headers.authorization,
    };
    const response = await AuthGuardService.verifyToken(params);

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
