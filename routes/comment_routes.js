const express = require('express');
const router  = express.Router();
const comment = require('../controllers/comment');

router.delete("/:id", comment.deleteComment);
router.post("/",comment.createComment);
router.get("/", comment.getComments);
router.get("/:id", comment.getCommentsByPostId);

module.exports = router;