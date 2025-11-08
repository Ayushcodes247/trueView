const express = require("express");
const router = express.Router();
const api = require("./api");
const channel = require("./channel");
const studio = require("./studio");
const watch = require("./watch");
const { getPlayerLink , getTagVideos , getPublicVideos , getShorts } = require("@controllers/video.controller");

const axios = require("axios");

const { getChannelAndSubscription } = require("@controllers/channel.controller");
const { checkChannel , isLoggedIn } = require("@middlewares/all.middleware");
const Tag = require("@models/tag.model");

router.get("/", async (req, res) => {
    res.render("devtube", { page: "home" });
});

router.get("/search", async (req, res) => {
    res.render("devtube", {
        page : "search",
        search : req.query.search
    });
});

router.get(/^\/@(\w+)$/, getChannelAndSubscription);
router.get(/^\/@(\w+)\/videos$/, getChannelAndSubscription);
router.get(/^\/@(\w+)\/shorts$/, getChannelAndSubscription);

router.get("/upload", checkChannel , isLoggedIn , (req, res) => {
    res.redirect(`/studio/channel/${req.channel.uid}/content?d=ud`);
});

router.get("/hashtag/:name", async (req, res) => {
    const hashTag = await Tag.findOne({ name : req.params.name });
    res.render("devtube", { page : "hashTag" , hashTag });
});

router.get("/shorts/:uid", async (req, res) => {
    res.render("devtube", { page : "shorts" , uid : req.params.uid });
});

router.get("/404", async (req, res) => res.render("404"));

router.use("/api", api);
router.use("/watch", watch);
router.use("/channel", channel);
router.use("/studio", isLoggedIn, checkChannel, studio);

module.exports = router;