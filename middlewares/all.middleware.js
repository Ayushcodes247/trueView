const mongoose = require("mongoose");

const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: "Database connection error." });
  }
  next();
};

const checkChannel = (req, res, next) => {
  if (!req.channel?.uid) {
    res.redirect("/channel/create");
  }
  next();
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
};

const asyncHandler = (fn) => {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { checkDBConnection, checkChannel, isLoggedIn, asyncHandler };
