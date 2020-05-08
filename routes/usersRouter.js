const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const usersController = require("../controllers/users.controllers");

// Protect a route trying to find user by username from cookie
const protectRoute = (req, res, next) => {
  console.log(req.cookies);
  try {
    if (!req.cookies.token) {
      throw new Error("You are not logged in.");
    }

    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

// GET ALL USERS
router.get("/", protectRoute, usersController.getAllUsers);

// CREATE A NEW USER
router.post("/create", protectRoute, usersController.createUser);

// LOGIN AND LOGOUT
router.post("/login", usersController.loginUser);
router.post("/logout", usersController.logoutUser);

module.exports = router;
