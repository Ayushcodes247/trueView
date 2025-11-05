const mongoose = require("mongoose");
const multer = require("multer");
const ImageKit = require("imagekit");
const axios = require("axios");

const mongoUri = process.env.MONGODB_URI;

mongoose
  .connect(mongoUri)
  .then(() => console.info("Connected to DATABASE SUCCESSFULLY."))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const conn = mongoose.createConnection(mongoUri);

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

const bunnyStreamEndpoint = `https://video.bunnycdn.com/library/${process.env.BUNNY_STREAM_LIBRARY_ID}/videos`;

const createVideoEntry = async (fileName) => {
  const response = await axios.post(
    bunnyStreamEndpoint,
    { title: fileName },
    {
      headers: {
        AccessKey: process.env.BUNNY_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.guid;
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = {
  conn,
  upload,
  imagekit,
  createVideoEntry,
  bunnyStreamEndpoint,
};
