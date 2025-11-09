const { checkChannel, asyncHandler, isLoggedIn } = require("@middlewares/all.middleware")
const { createVideo, deleteVideo, createUpload, getVideo, canEdit, getVideos } = require("@controllers/video.controller")
const express = require("express")
const multer = require("multer")
const path = require('path')
const { createComment, getComments } = require("@controllers/comment.controller")

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp-upload/')
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        cb(null, uniqueName)
    }
})


//get video api
router.get('/get-video/:id', checkChannel, isLoggedIn, getVideo)

//check video edit api
router.get('/can-edit/:id', checkChannel, isLoggedIn, canEdit)

//upload video to bunny api
router.post('/upload', isLoggedIn, asyncHandler(createVideo))

//create video on bunny  api
router.post('/create-upload', isLoggedIn, asyncHandler(createUpload))

//create video on bunny  api
router.post('/create-video', isLoggedIn, multer({ storage: storage }).single('thumbnail'), asyncHandler(createVideo))

//delete video 
router.get('/delete/:videoId', isLoggedIn, deleteVideo)

//send comments  
router.post('/comment/:videoId', isLoggedIn, createComment)

//get comments  
router.get('/:videoId/comments', getComments)



module.exports = router


