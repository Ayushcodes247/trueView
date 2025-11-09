const express = require("express");
const router = express.Router();
const api = require("./api");
const channel = require("./channel");
const studio = require("./studio");
const watch = require("./watch");
const {
  getPlayerLink,
  getTagVideos,
  getPublicVideos,
  getShorts,
} = require("@controllers/video.controller");

const { default: axios } = require("axios");

const {
  getChannelAndSubscription,
} = require("@controllers/channel.controller");
const { checkChannel, isLoggedIn } = require("@middlewares/all.middleware");
const Tag = require("@models/tag.model");

//Home page
router.get("/", async (req, res) => {
  res.render("devtube", {
    page: "home",
  });
});
router.get("/search", async (req, res) => {
  res.render("devtube", {
    page: "search",
    search: req.query.search,
  });
});

//route for getting channel by handle for e.g. /@some_channel_handle
router.get(/^\/@(\w+)$/, getChannelAndSubscription);
router.get(/^\/@(\w+)\/videos$/, getChannelAndSubscription);
router.get(/^\/@(\w+)\/shorts$/, getChannelAndSubscription);

//upload  redirect
router.get("/upload", checkChannel, isLoggedIn, (req, res) => {
  res.redirect(`/studio/channel/${req.channel.uid}/content?d=ud`);
});

//hashtag
router.get("/hashtag/:name", async (req, res) => {
  const hashTag = await Tag.findOne({ name: req.params.name });
  res.render("devtube", { page: "hashTag", hashTag });
});

//shorts page
router.get("/shorts/:uid", async (req, res) =>
  res.render("devtube", {
    page: "shorts",
    uid: req.params.uid,
  })
);

//404
router.get("/404", async (req, res) => res.render("404"));

//Forwarded routes
router.use("/api", api);
router.use("/watch", watch);
router.use("/channel", channel);
router.use("/studio", isLoggedIn, checkChannel, studio);

module.exports = router;
