const express = require("express");
const app = express();
const usersRouter = require("./routes/usersRouter");
const visitsRouter = require("./routes/visitsRouter");

require("./utils/db");

/* CORS */
const cors = require("cors");

var corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
/* end of CORS */

/* Cookies */
const cookieParser = require("cookie-parser");
app.use(cookieParser(process.env.COOKIES_SECRET));

/* end of Cookies */

app.use(express.json());

// "0": "GET    /"
app.get("/", (req, res) => {
  res.json({
    "0": "GET /users",
    "1": "POST /users/create",
    "2": "POST /users/login",
    "3": "POST /users/logout",
  });
});

/* -- user route -- */
app.use("/users", usersRouter);

/* -- visit route -- */
app.use("/visits", visitsRouter);

//error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  console.log(err);
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
