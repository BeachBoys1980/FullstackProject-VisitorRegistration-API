const express = require("express");
const router = express.Router();
const VisitModel = require("../models/visit.model");

// GET ALL VISITS
router.get("/", async (req, res) => {
  const results = await VisitModel.find();
  res.status(200).json(results);
});

// REGISTER A NEW VISIT
router.post("/register", async (req, res, next) => {
  try {
    const visit = new VisitModel(req.body);
    await VisitModel.init();
    const newVisit = await visit.save();
    res.status(201).json(newVisit);
  } catch (err) {
    next(err);
  }
});

// CONTACT TRACE
router.get("/nric/:nric/trace", async (req, res, next) => {
  const nricToFind = req.params.nric;
  const dateToFind = new Date(req.query.contactTraceDate);

  const dayAfter = new Date(req.query.contactTraceDate);
  dayAfter.setDate(dayAfter.getDate() + 1);

  console.log(dateToFind.toUTCString(), dayAfter.toUTCString());

  const infectedVisitor = await VisitModel.findOne({
    nric: nricToFind,
    visitDateTime: { $gte: dateToFind, $lt: dayAfter },
  });

  try {
    // check if visitor can be found
    if (!infectedVisitor) {
      const noUserError = new Error("No such visitor");
      noUserError.statusCode = 404;
      throw noUserError;
    }

    //set parameter of minutes limit to trace
    const minutesLimitToTrace = 5;

    //set infected visit date/time
    const infectedDateTime = new Date(infectedVisitor.visitDateTime);

    //get all visits
    const allVisits = await VisitModel.find();

    //compare infected's visit date/time with each visit's date/time
    const contactTraceVisits = allVisits.filter((result) => {
      const visitDateTime = new Date(result.visitDateTime);

      const milliSecondsDifference = Math.abs(infectedDateTime - visitDateTime);

      //   60 seconds/minute * 1000 msecs/second
      const minutesDifference = Math.floor(
        milliSecondsDifference / (1000 * 60)
      );

      //if difference is less or equal to paramter limit, from infected date/time
      if (minutesDifference <= minutesLimitToTrace) {
        return result.toObject();
      }
    });

    res.json(contactTraceVisits);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
