const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  visitDateTime: {
    type: Date,
    required: true,
  },
  nric: {
    type: String,
    required: true,
    index: true, // helps us to find by username, note that this has a significant production impact
    minlength: 3,
    lowercase: true,
  },
  contactNo: {
    type: Number,
    minlength: 3,
  },
});

const VisitModel = mongoose.model("VisitModel", visitSchema);
module.exports = VisitModel;
