const {
  checkChannel,
  asyncHandler,
  isLoggedIn,
} = require("@middlewares/all.middleware");
const {
  createVideo,
  deleteVideo,
  createUpload,
  getVideo,
  canEdit,
  getVideos,
} = require("@controllers/video.controller");
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createComment,
  getComments,
} = require("@controllers/comment.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp-upload/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

router.get("/get-video/:id", checkChannel, isLoggedIn, getVideo);

router.get("/can-edit/:id", checkChannel, isLoggedIn, canEdit);

router.post("/upload", isLoggedIn, asyncHandler(createVideo));

router.post("/create-upload", isLoggedIn, asyncHandler(createUpload));

router.post(
  "/create-video",
  isLoggedIn,
  multer({ storage: storage }).single("thumbnail"),
  asyncHandler(createVideo)
);

router.get("/delete/:videoId", isLoggedIn, deleteVideo);

router.post("/comment/:videoId", isLoggedIn, createComment);

router.get("/:videoId/comments", getComments);

module.exports = router;
