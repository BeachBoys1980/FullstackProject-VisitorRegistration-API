const bcrypt = require("bcryptjs");

const rounds = 10;

const hash = async (password) => {
  console.log(await bcrypt.hash(password, rounds));
};

hash("password1");
