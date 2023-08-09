const UserService = require("../services/userService");

exports.save = async (req, res) => {
  try {
    const params = {
      id: req.body.id,
      totalGamePlayed: 0,
      win: 0,
      loss: 0,
      totalPoints: 0,
      achievements: "none",
    };
    const user = await UserService.save(params);
    res.json(user);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.update = async (req, res) => {
  try {
    const user = await UserService.update(req.user.id, req.body);
    const responseMessage = {
      message: "User updated Successfully!",
      isUpdated: true,
      user: user,
    };
    res.json(responseMessage);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.getGameData = async (req, res) => {
  try {
    const user = await UserService.get(req.user.id);
    const response = {
      userData: req.user,
      gameData: user,
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Not Found.", error: err });
  }
};

exports.updateGameDataById = async (req, res) => {
  try {
    const user = await UserService.update(req.params.id, req.body);
    const responseMessage = {
      message: "User updated Successfully!",
      isUpdated: true,
      user: user,
    };
    res.json(responseMessage);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.getGameDataByUserId = async (req, res) => {
  try {
    const gameData = await UserService.get(req.params.id);
    const userData = await UserService.getCognitoUser(req.params.id);
    const response = {
      userData: userData.data,
      gameData: gameData,
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Not Found.", error: err });
  }
};