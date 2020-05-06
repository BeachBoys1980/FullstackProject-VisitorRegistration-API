const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const visitsController = require("../controllers/visits.controller");

// Protect a route trying to find user by username from cookie
const protectRoute = (req, res, next) => {
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

// GET ALL VISITS
router.get("/", protectRoute, visitsController.getAllVisits);

// REGISTER A NEW VISIT
router.post("/register", protectRoute, visitsController.registerNewVisit);

// CONTACT TRACE
router.get(
  "/nric/:nric/trace",
  protectRoute,
  visitsController.traceNricVisitDate
);

module.exports = router;
