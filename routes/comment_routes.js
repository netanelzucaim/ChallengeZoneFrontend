const express = require('express')
const router  = express.Router()
const comment = require('../controllers/comment')

router.post('/',comment.createComment)

module.exports = router;