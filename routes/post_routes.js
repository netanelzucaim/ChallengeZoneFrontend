const express = require('express')
const router  = express.Router()
const post = require('../controllers/posts')

router.get('/',post.getAllPosts)

router.post('/',post.createPost)


module.exports = router;