const UserModel = require("../models/user.model");

const { getJWTSecret } = require("../config/jwt");
const jwt = require("jsonwebtoken");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  const results = await UserModel.find();
  res.status(200).json(results);
};

// CREATE A NEW USER
const createUser = async (req, res, next) => {
  try {
    const user = new UserModel(req.body);
    await UserModel.init();
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

// LOGIN AND LOGOUT
const createJWTToken = (username) => {
  const today = new Date();
  const exp = new Date(today);

  const secret = getJWTSecret();
  exp.setDate(today.getDate() + 60);

  const payload = { username: username, exp: parseInt(exp.getTime() / 1000) };
  const token = jwt.sign(payload, secret);
  return token;
};

const bcrypt = require("bcryptjs");

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(user.username);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    // Can expiry date on cookie be changed? How about JWT token?
    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      //signed: true,
    });

    res.json({ userType: user.userType });
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
};

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  logoutUser,
};
