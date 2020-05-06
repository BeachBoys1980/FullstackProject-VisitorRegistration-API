const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true, // helps us to find by username, note that this has a significant production impact
    unique: true,
    minlength: 3,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  userType: {
    type: String,
    enum: ["ADMIN", "USER"],
    required: true,
  },
});

//for hashing of password
userSchema.pre("save", async function (next) {
  const rounds = 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;
