require("module-alias/register");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const path = require("path");
const session = require("express-session");
const passport = require("./config");
const routes = require("./routes");

require("@libs/db");

const { checkDBConnection } = require("@middlewares/all.middleware");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(checkDBConnection);

app.use(async (req, res, next) => {
  res.locals.isCreateChannel = false;
  if (req.user) {
    res.locals.channel = req.channel = req.user;
  } else {
    req.channel = res.locals.channel = null;
  }
  next();
});

app.use("/" , checkDBConnection , routes);

app.use((req, res) => {
  res.statusCode(404).render("404");
});

module.exports = app;
