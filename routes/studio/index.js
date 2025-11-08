const express = require("express");
const router = express.Router();
const channel = require("./channel");
const { getStudioVideos , getStudioShorts } = require("@controllers/video.controller");

router.get("/", async (req, res) => res.redirect("/studio/channel/" + req.channel?.uid ));

router.get("/videos", getStudioVideos);
router.get("/shorts", getStudioShorts);

router.use("/channel/:uid", channel);
router.use("/channel", channel);

module.exports = router;