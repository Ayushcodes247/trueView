const { createComment } = require("@controllers/comment.controller");
const {
  getPlayerLink,
  updateVideoLikesDislikes,
} = require("@controllers/video.controller");
const { isLoggedIn } = require("@middlewares/all.middleware");
const express = require("express");
const router = express.Router();

//Watch Video Page
router.get("/", async (req, res) =>
  res.render("devtube", await getPlayerLink(req, res))
);

router.get("/react/:videoId", isLoggedIn, updateVideoLikesDislikes);

module.exports = router;
